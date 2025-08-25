import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL; // must be https/wss in prod

// ✅ Use STUN + TURN in production
const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // ---- TURN (required for many prod networks) ----
    // Create your own coturn or use a provider (Twilio, Cloudflare, etc.)
    // {
    //   urls: ["turn:YOUR_TURN_HOST:3478"],
    //   username: "TURN_USER",
    //   credential: "TURN_PASS",
    // },
  ],
  // iceTransportPolicy: "all", // default; can set "relay" to force TURN
};

export default function VideoCall({ bookingId, role }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null);
  const socket = useRef(null);
  const localStream = useRef(null);
  const pendingRemoteCandidates = useRef([]);

  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // --- helpers ---
  const safePlay = (video) => {
    try {
      const p = video?.play?.();
      if (p && typeof p.then === "function") p.catch(() => {});
    } catch {}
  };

  const attachLocal = () => {
    if (!localVideoRef.current || !localStream.current) return;
    localVideoRef.current.srcObject = localStream.current;
    localVideoRef.current.muted = true; // self-preview muted
    localVideoRef.current.playsInline = true;
    safePlay(localVideoRef.current);
  };

  const attachRemote = (stream) => {
    if (!remoteVideoRef.current) return;
    remoteVideoRef.current.srcObject = stream;
    remoteVideoRef.current.playsInline = true;
    safePlay(remoteVideoRef.current);
  };

  const registerSocketHandlers = () => {
    // Use once() to avoid duplicate handlers across reconnects
    socket.current.once("ready", async () => {
      if (role === "doctor") {
        // offerer only
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        socket.current.emit("offer", { bookingId, offer });
      }
    });

    socket.current.on("offer", async (offer) => {
      // answerer path
      if (!pc.current.currentRemoteDescription) {
        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      }
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.current.emit("answer", { bookingId, answer });
      // flush any buffered candidates
      while (pendingRemoteCandidates.current.length) {
        const c = pendingRemoteCandidates.current.shift();
        try { await pc.current.addIceCandidate(c); } catch {}
      }
    });

    socket.current.on("answer", async (answer) => {
      if (!pc.current.currentRemoteDescription) {
        await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
      // flush any buffered candidates
      while (pendingRemoteCandidates.current.length) {
        const c = pendingRemoteCandidates.current.shift();
        try { await pc.current.addIceCandidate(c); } catch {}
      }
    });

    socket.current.on("ice-candidate", async (candidate) => {
      const rtc = new RTCIceCandidate(candidate);
      if (pc.current?.remoteDescription?.type) {
        try { await pc.current.addIceCandidate(rtc); } catch (e) { console.error("ICE add error", e); }
      } else {
        // buffer until remoteDescription is set
        pendingRemoteCandidates.current.push(rtc);
      }
    });

    // (Optional) if socket reconnects, the server should re-emit "ready" when room has 2 peers.
    socket.current.on("connect_error", (e) => console.warn("Socket connect error:", e?.message));
  };

  const createPeerConnection = () => {
    pc.current = new RTCPeerConnection(servers);

    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.current.emit("ice-candidate", { bookingId, candidate: e.candidate });
      }
    };

    pc.current.ontrack = (evt) => {
      if (evt.streams && evt.streams[0]) attachRemote(evt.streams[0]);
    };

    pc.current.onconnectionstatechange = () => {
      const s = pc.current.connectionState;
      console.log("pc connectionState:", s);
      if (s === "failed" || s === "disconnected" || s === "closed") {
        // keep UI responsive; you can auto-retry if you want
      }
    };
  };

  const addLocalTracks = () => {
    localStream.current.getTracks().forEach((t) => pc.current.addTrack(t, localStream.current));
  };

  // --- join ---
  const joinCall = async () => {
    if (inCall) return;

    // 1) connect socket over WSS with explicit websocket transport
    socket.current = io(SOCKET_URL, {
      path: "/socket.io",         // default path; keep same on server
      transports: ["websocket"],  // no long-polling in prod
      withCredentials: true,
      query: { bookingId, role },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // 2) create pc
    createPeerConnection();

    // 3) get A/V before signaling
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (err) {
      console.error("getUserMedia error:", err);
      alert("Camera/Mic permission is required to start the call.");
      socket.current.disconnect();
      return;
    }

    // 4) attach & add tracks
    attachLocal();
    addLocalTracks();

    // 5) signal handlers
    registerSocketHandlers();

    setInCall(true);
  };

  // --- toggles (no re-add) ---
  const toggleCamera = () => {
    const track = localStream.current?.getVideoTracks?.()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  const toggleMic = () => {
    const track = localStream.current?.getAudioTracks?.()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  // --- leave/cleanup ---
  const endCall = () => {
    try { socket.current?.disconnect(); } catch {}
    try {
      pc.current?.getSenders?.().forEach((s) => s.track && s.track.stop());
      localStream.current?.getTracks?.().forEach((t) => t.stop());
      pc.current?.close?.();
    } catch {}
    pendingRemoteCandidates.current = [];
    localStream.current = null;
    pc.current = null;
    socket.current = null;
    setInCall(false);
    setMicOn(true);
    setCamOn(true);
  };

  useEffect(() => {
    return () => endCall(); // cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-[80vh]">
      {!inCall ? (
        <button
          onClick={joinCall}
          className="px-6 py-3 bg-green-600 text-white rounded-xl text-lg shadow-md"
        >
          Join Call
        </button>
      ) : (
        <>
          <div className="flex gap-4 w-full h-[70vh]">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-1/2 rounded-lg border bg-black"
            />
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-1/2 rounded-lg border bg-black"
            />
          </div>

          <div className="flex gap-4">
            <button onClick={toggleCamera} className="px-4 py-2 bg-green-500 text-white rounded-lg">
              {camOn ? "Turn Off Camera" : "Turn On Camera"}
            </button>
            <button onClick={toggleMic} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              {micOn ? "Mute Mic" : "Unmute Mic"}
            </button>
            <button onClick={endCall} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              End Call
            </button>
          </div>
        </>
      )}
    </div>
  );
}
