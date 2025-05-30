import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [moderationResult, setModerationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setModerationResult(null);
  };

  const handleModerate = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/moderate/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModerationResult(response.data);
    } catch (error) {
      console.error("Moderation failed:", error);
      setModerationResult({ error: "Failed to moderate image." });
    } finally {
      setLoading(false);
    }
  };

  const getDecisionStyle = (decision) => {
    switch (decision) {
      case "appropriate":
        return { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" };
      case "inappropriate":
        return { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" };
      default:
        return { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" };
    }
  };

  return (
    <div className="App" style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🛡️ Image Content Moderation</h1>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <br />
        <button
          onClick={handleModerate}
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Moderating..." : "Moderate Image"}
        </button>
      </div>

      {selectedImage && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h3>Uploaded Image:</h3>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Preview"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
          />
        </div>
      )}

      {moderationResult && (
        <div style={{ padding: "1.5rem", borderRadius: "10px", ...getDecisionStyle(moderationResult.decision) }}>
          <h2>Moderation Decision: {moderationResult.decision.toUpperCase()}</h2>

          {moderationResult.annotated_image && (
            <>
              <h4>📍 Annotated Image:</h4>
              <img
                src={`data:image/jpeg;base64,${moderationResult.annotated_image}`}
                alt="Annotated"
                style={{ maxWidth: "100%", borderRadius: "10px", marginTop: "0.5rem" }}
              />
            </>
          )}

          {moderationResult.labels?.length > 0 && (
            <>
              <h4 style={{ marginTop: "1rem" }}>🧾 Detected Tags:</h4>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {moderationResult.labels.map(([label, score], idx) => (
                  <li key={idx} style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>
                    🔹 <strong>{label}</strong> — Confidence: {(score * 100).toFixed(2)}%
                  </li>
                ))}
              </ul>
            </>
          )}

          {moderationResult.explanation && (
            <>
              <h4 style={{ marginTop: "1.5rem" }}>🤖 AI Explanation:</h4>
              <div
                style={{
                  background: "#f4f4f4",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontStyle: "italic",
                  whiteSpace: "pre-wrap",
                }}
              >
                {moderationResult.explanation}
              </div>
            </>
          )}
        </div>
      )}

      {moderationResult?.error && (
        <div style={{ marginTop: "1rem", color: "red", textAlign: "center" }}>
          {moderationResult.error}
        </div>
      )}
    </div>
  );
}

export default App;
