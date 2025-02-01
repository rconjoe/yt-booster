import React, { useState } from "react";

function App() {
  const [targetUrl, setTargetUrl] = useState("");
  const [isDownloadReady, setIsDownloadReady] = useState(false);

  const handleRetrieve = async () => {
    if (!targetUrl) return;

    try {
      const response = await fetch(`http://localhost:3400/api/retrieve?target_url=${encodeURIComponent(targetUrl)}`, {
        method: "GET",
      });

      if (response.ok) {
        console.log("Retrieve success!");
        setIsDownloadReady(true);
      } else {
        console.error("Retrieve failed:", await response.text());
        setIsDownloadReady(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      setIsDownloadReady(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:3400/api/download", {
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error("Download failed:", await response.text());
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>YouTube Video Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={targetUrl}
        onChange={(e) => setTargetUrl(e.target.value)}
        style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={handleRetrieve} style={{ margin: "5px", padding: "10px" }}>
        Retrieve Video
      </button>
      <button onClick={handleDownload} disabled={!isDownloadReady} style={{ margin: "5px", padding: "10px" }}>
        Download Video
      </button>
    </div>
  );
}

export default App;
