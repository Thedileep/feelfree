import React, { useEffect, useState, useRef } from "react";
import { db } from "../VideoCall/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ChatBox = ({ roomId, sender }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const storage = getStorage();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 🔽 Auto scroll to bottom when new message comes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔄 Fetch messages
  useEffect(() => {
    if (!roomId) return;
    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [roomId]);

  // 📩 Send Message
  const sendMessage = async () => {
    if (!input.trim() && !file && !audioBlob) return;

    let imageUrl = "";
    let audioUrl = "";

    // Upload image
    if (file) {
      const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
      setFile(null);
    }

    // Upload audio
    if (audioBlob) {
      const storageRef = ref(storage, `audios/${Date.now()}.webm`);
      await uploadBytes(storageRef, audioBlob);
      audioUrl = await getDownloadURL(storageRef);
      setAudioBlob(null);
    }

    await addDoc(collection(db, "rooms", roomId, "messages"), {
      text: input,
      sender,
      imageUrl,
      audioUrl,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  // 🗑 Delete Message
  const deleteMessage = async (id) => {
    await deleteDoc(doc(db, "rooms", roomId, "messages", id));
  };

  // ✏️ Edit Message
  const editMessage = async (id, oldText) => {
    const newText = prompt("Edit your message:", oldText);
    if (newText !== null && newText.trim() !== "") {
      await updateDoc(doc(db, "rooms", roomId, "messages", id), {
        text: newText,
      });
    }
  };

  // 🎤 Start/Stop Recording
  const toggleRecording = async () => {
    if (recording) {
      mediaRecorder.stop();
      setRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          setAudioBlob(blob);
        };
        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
      } catch (err) {
        console.error("Mic permission error:", err);
      }
    }
  };

  // 📷 Camera Capture (fixed with metadata load)
  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      stream.getTracks().forEach((track) => track.stop());

      canvas.toBlob(async (blob) => {
        const fileName = `camera-${Date.now()}.png`;
        const storageRef = ref(storage, `images/${fileName}`);
        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);

        await addDoc(collection(db, "rooms", roomId, "messages"), {
          sender,
          imageUrl,
          text: "",
          timestamp: serverTimestamp(),
        });
      });
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto border rounded-xl shadow-lg bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isSender = msg.sender === sender;
          return (
            <div key={msg.id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] p-3 rounded-2xl shadow-md relative ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {/* Message Text */}
                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                {/* Image */}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="uploaded"
                    className="mt-2 rounded-lg max-h-60 object-cover"
                  />
                )}

                {/* Audio */}
                {msg.audioUrl && (
                  <audio controls className="mt-2 w-full">
                    <source src={msg.audioUrl} type="audio/webm" />
                  </audio>
                )}

                {/* Actions */}
                {isSender && (
                  <div className="flex gap-3 text-xs mt-2 justify-end">
                    <button
                      onClick={() => editMessage(msg.id, msg.text)}
                      className="text-green-200 hover:text-white"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-300 hover:text-red-100"
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Preview Selected File */}
      {file && (
        <div className="p-2 border-t flex items-center bg-gray-50">
          <p className="text-sm text-gray-600 truncate">{file.name}</p>
          <button
            onClick={() => setFile(null)}
            className="ml-2 text-red-500 text-xs"
          >
            ✖ Cancel
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t flex items-center gap-2 bg-gray-50">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Type a message..."
        />
        {/* File Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-gray-200 px-3 py-2 rounded-full hover:bg-gray-300"
        >
          📎
        </button>
        {/* Camera */}
        <button
          onClick={takePhoto}
          className="bg-gray-200 px-3 py-2 rounded-full hover:bg-gray-300"
        >
          📷
        </button>
        {/* Mic */}
        <button
          onClick={toggleRecording}
          className={`px-3 py-2 rounded-full ${
            recording ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          🎤
        </button>
        {/* Send */}
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
