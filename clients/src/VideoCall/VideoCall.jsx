import React, { useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import { collection, doc, setDoc, addDoc, onSnapshot } from "firebase/firestore";
import { FiCamera, FiCameraOff, FiMic, FiMicOff, FiPhoneOff } from "react-icons/fi";
import { motion } from "framer-motion";

// Load ICE servers from environment variables
const servers = {
  iceServers: [
    {
      urls: import.meta.env.VITE_STUN_URL
    },
    {
      urls: [import.meta.env.VITE_TURN_URL],
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL
    }
  ]
};


export default function VideoCall({ bookingId, role }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null);
  const localStream = useRef(null);
  const pendingCandidates = useRef([]);

  const [remoteStream, setRemoteStream] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPeerConnection = () => {
    pc.current = new RTCPeerConnection(servers);

    pc.current.onicecandidate = async (event) => {
      if (!event.candidate) return;
      const candidatesRef = collection(
        db,
        "bookings",
        bookingId,
        role === "doctor" ? "doctorCandidates" : "userCandidates"
      );
      await addDoc(candidatesRef, { candidate: event.candidate.toJSON() });
    };

    pc.current.ontrack = (event) => {
      if (event.streams && event.streams[0]) setRemoteStream(event.streams[0]);
    };
  };

  const addLocalTracks = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => pc.current.addTrack(track, localStream.current));
    }
  };

  const processPendingCandidates = async () => {
    if (!pc.current?.remoteDescription) return; 
    while (pendingCandidates.current.length > 0) {
      const candidate = pendingCandidates.current.shift();
      try {
        await pc.current.addIceCandidate(candidate);
      } catch (err) {
        // Handle "Unknown ufrag" errors gracefully - these are usually harmless
        if (err.message && err.message.includes('ufrag')) {
          console.warn("ICE candidate with mismatched ufrag - likely stale candidate:", err);
        } else {
          console.error("Failed to add ICE candidate:", err);
        }
      }
    }
  };

  const listenFirestore = () => {
    const callDoc = doc(db, "bookings", bookingId);
    const offerCandidatesCol = collection(db, "bookings", bookingId, "userCandidates");
    const answerCandidatesCol = collection(db, "bookings", bookingId, "doctorCandidates");
    const candidatesCol = role === "doctor" ? offerCandidatesCol : answerCandidatesCol;

    onSnapshot(callDoc, async (snap) => {
      const data = snap.data();
      if (!data) return;

      try {
        if (role === "doctor" && data.offer && !pc.current.currentRemoteDescription) {
          await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);
          await setDoc(callDoc, { answer: pc.current.localDescription.toJSON() }, { merge: true });
          await processPendingCandidates();
        }

        if (role === "user" && data.answer && !pc.current.currentRemoteDescription) {
          await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          await processPendingCandidates();
        }
      } catch (err) {
        console.error("Error setting remote description:", err);
      }
    });

    onSnapshot(candidatesCol, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data().candidate);
          if (pc.current?.remoteDescription) {
            pc.current.addIceCandidate(candidate).catch(console.error);
          } else {
            pendingCandidates.current.push(candidate);
          }
        }
      });
    });
  };

  const joinCall = async () => {
    if (inCall || loading) return;
    setLoading(true);
    setError(null);

    try {
      createPeerConnection();
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;
      addLocalTracks();
      listenFirestore();

      const callDoc = doc(db, "bookings", bookingId);
      if (role === "user") {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        await setDoc(callDoc, { offer: pc.current.localDescription.toJSON() });
      }

      setCamOn(true);
      setMicOn(true);
      setInCall(true);
    } catch (err) {
      console.error(err);
      setError("Camera/Mic permission required or device not available");
      if (localStream.current) endCall();
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = () => {
    const track = localStream.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  };

  const toggleMic = () => {
    const track = localStream.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  const endCall = () => {
    pc.current?.getSenders().forEach((s) => s.track?.stop());
    pc.current?.close();
    pc.current = null;

    localStream.current?.getTracks().forEach((t) => t.stop());
    localStream.current = null;

    pendingCandidates.current = [];
    setRemoteStream(null);
    setInCall(false);
    setCamOn(false);
    setMicOn(false);
  };

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => () => inCall && endCall(), [inCall]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full p-2 bg-gray-100">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}

      {!inCall ? (
        <motion.button
          onClick={joinCall}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-green-600 text-white rounded-xl text-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Joining..." : "Join Call"}
        </motion.button>
      ) : (
        <motion.div className="flex flex-col md:flex-row gap-4 w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="relative flex-1 rounded-lg overflow-hidden border bg-black flex items-center justify-center h-[40vh] md:h-full">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {!camOn && <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-2xl font-bold">YOU</div>}
          </div>
          <div className="relative flex-1 rounded-lg overflow-hidden border bg-black flex items-center justify-center h-[40vh] md:h-full">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!remoteStream && <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-2xl font-bold">Waiting...</div>}
          </div>
          <div className="flex gap-4 justify-center mt-4 md:mt-0 md:flex-col">
            <button onClick={toggleCamera} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              {camOn ? <FiCamera /> : <FiCameraOff />} {camOn ? "Camera On" : "Camera Off"}
            </button>
            <button onClick={toggleMic} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              {micOn ? <FiMic /> : <FiMicOff />} {micOn ? "Mic On" : "Mic Off"}
            </button>
            <button onClick={endCall} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              <FiPhoneOff /> End Call
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
