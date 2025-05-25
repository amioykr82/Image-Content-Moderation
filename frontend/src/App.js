import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);
    setLoading(true);

    try {
      const response = await axios.post("REACT_APP_BACKEND_URL/moderate/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err) {
      console.error("Upload failed:", err);
    }

    setLoading(false);
  };

  const renderBanner = () => {
    if (!result) return null;
    const decision = result.decision;
    const className =
      decision === "appropriate" ? "banner green" :
      decision === "inappropriate" ? "banner red" : "banner yellow";

    const text =
      decision === "appropriate" ? "✅ This image is APPROPRIATE." :
      decision === "inappropriate" ? "🚫 This image is INAPPROPRIATE!" :
      "⚠️ UNTRAINED CATEGORY – AI Summary Provided";

    return <div className={className}>{text}</div>;
  };

  return (
    <div className="App">
      <h1>🛡️ AI Image Moderation</h1>

      <div className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
          }}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Analyzing..." : "Moderate Image"}
        </button>
      </div>

      {preview && (
        <div className="preview">
          <p>📷 Uploaded Image</p>
          <img src={preview} alt="preview" />
        </div>
      )}

      {result && (
        <>
          {renderBanner()}

          <div className="preview">
            <p>🖼️ Annotated Image</p>
            <img src={`data:image/jpeg;base64,${result.annotated_image}`} alt="annotated" />
          </div>

          <div className="labels">
            <h3>🎯 Detected Tags:</h3>
            {result.labels.length === 0 ? (
              <p>No tags found.</p>
            ) : (
              result.labels.map(([label, score], i) => (
                <div className="tag" key={i}>
                  <b>{label}</b>: {score}
                </div>
              ))
            )}
          </div>

          <div className="explanation">
            <h3>🧠 AI Reasoning:</h3>
            <p>{result.explanation}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
