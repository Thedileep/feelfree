import axios from "axios";
const API = import.meta.env.VITE_API_URL;
const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id; 

export const sendMediaHelper = async (file, filename, bookingId, setMessages, scrollToBottom, setUploading) => {
  if (!file) return;
  setUploading(true);
  const formData = new FormData();
  formData.append("file", file, filename || file.name || "file");

  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API}/api/messages/${bookingId}/media`, formData, {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
    });
    setMessages((prev) => [...prev, res.data]);
    scrollToBottom();
  } catch (err) {
    console.error("Error uploading media:", err);
  } finally {
    setUploading(false);
  }
};

export const startRecording = (sendMedia) => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/mp3" });
        sendMedia(blob, "audio.mp3");
      };
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 60000);
    })
    .catch(err => console.error(err));
};

export const capturePhoto = async (sendMedia) => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement("video");
  video.srcObject = stream;
  video.play();

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  canvas.toBlob(blob => sendMedia(blob, "image.jpg"), "image/jpeg");

  stream.getTracks().forEach(track => track.stop());
};
