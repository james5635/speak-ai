import { useState, useRef } from "react";
import Markdown from "react-markdown";

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const sendToApi = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`${apiUrl}/api/ai/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data: { role: string; content: string; audio_url: string } =
        await res.json();
      setResponse(data.content);

      const audio = new Audio(`${apiUrl}${data.audio_url}`);
      audio.play();
    } catch (err) {
      console.error(err);
      setResponse("Error calling API");
    } finally {
      setLoading(false);
    }
  };

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    chunks.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("file", blob, "input.webm"); // ✅ correct extension

      const res = await fetch(`${apiUrl}/api/ai/voice`, {
        method: "POST",
        body: formData,
      });

      const data: { role: string; content: string; audio_url: string } =
        await res.json();
      setResponse(data.content);

      const audio = new Audio(`${apiUrl}${data.audio_url}`);
      audio.play();
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>AI Chat</h2>

      <textarea
        rows={4}
        cols={50}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />

      <br />
      <br />

      <button onClick={sendToApi} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>

      <div>
        <button onClick={recording ? stopRecording : startRecording}>
          {recording ? "Stop" : "Record"}
        </button>
      </div>

      <h3>Response:</h3>
      <Markdown>{response}</Markdown>
    </div>
  );
}

export default App;
