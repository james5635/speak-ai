import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const sendToApi = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/api/ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data: { role: string; content: string; audio_url: string } =
        await res.json();
      setResponse(data.content);

      const audio = new Audio(`http://localhost:8000${data.audio_url}`);
      audio.play();
      
    } catch (err) {
      console.error(err);
      setResponse("Error calling API");
    } finally {
      setLoading(false);
    }
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

      <h3>Response:</h3>
      <p>{response}</p>
    </div>
  );
}

export default App;
