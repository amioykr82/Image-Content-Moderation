
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setModerationResult(response.data);
    } catch (error) {
      console.error("Moderation failed:", error);
      setModerationResult({ error: "Failed to moderate image." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🛡️ Image Content Moderation</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleModerate} disabled={loading}>
        {loading ? "Moderating..." : "Moderate Image"}
      </button>

      {selectedImage && (
        <div className="preview">
          <h3>Uploaded Image:</h3>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Preview"
            width="300"
          />
        </div>
      )}

      {moderationResult && (
        <div className="results">
          <h3>
            Moderation Decision:{" "}
            <span
              style={{
                color:
                  moderationResult.decision === "appropriate"
                    ? "green"
                    : moderationResult.decision === "inappropriate"
                    ? "red"
                    : "orange",
              }}
            >
              {moderationResult.decision.toUpperCase()}
            </span>
          </h3>

          {moderationResult.annotated_image && (
            <>
              <h3>Annotated Image:</h3>
              <img
                src={`data:image/png;base64,${moderationResult.annotated_image}`}
                alt="Annotated"
                width="400"
              />
            </>
          )}

          {moderationResult.labels && (
            <>
              <h4>Detected Tags:</h4>
              <ul>
                {moderationResult.labels.map((label, index) => (
                  <li key={index}>
                    {label[0]} – Confidence: {(label[1] * 100).toFixed(2)}%
                  </li>
                ))}
              </ul>
            </>
          )}

          {moderationResult.explanation && (
            <>
              <h4>AI Explanation:</h4>
              <p>{moderationResult.explanation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
