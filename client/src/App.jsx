import "./App.css";
import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);
  const [input, setInput] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQRCode] = useState("");
  const [showType, setShowType] = useState(""); 

  const handleTinyURL = async () => {
    setLoading(true);
    setShowType(""); 

    try {
      const res = await fetch("http://localhost:3000/tinyurl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl: input }),
      });

      if (res.ok) {
        const data = await res.json();
        setShortUrl(data.shortUrl);
        setShowType("url");
      } else {
        console.error("Failed to generate Tiny URL");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQRCode = async () => {
    setLoadingQR(true);
    setShowType(""); 

    try {
      const res = await fetch("http://localhost:3000/generateQR", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      });

      if (res.ok) {
        const data = await res.json();
        setQRCode(data.qrUrl);
        setShowType("qr");
      } else {
        console.error("Failed to generate QR Code");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Tiny URL & QR Generator</h1>

      <div className="card">
        <input
          className="input"
          type="text"
          placeholder="Enter your URL here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="button-group">
          <button className="button" onClick={handleTinyURL} disabled={loading}>
            {loading ? "Loading..." : "Tiny URL"}
          </button>
          <button className="button" onClick={handleQRCode} disabled={loadingQR}>
            {loadingQR ? "Loading..." : "QR Code"}
          </button>
        </div>
      </div>

      {showType === "url" && shortUrl && (
        <div className="response-box">
          <p className="short-url">{shortUrl}</p>
          <div className="action-buttons">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="button">
              Visit <ExternalLink size={16} />
            </a>
            <button className="button">
              Copy <Copy size={16} />
            </button>
          </div>
        </div>
      )}

      {showType === "qr" && qrCode && (
        <div className="response-box qr-box">
          <h2>QR Code</h2>
          <img src={qrCode} alt="QR Code" className="qr-img" />
        </div>
      )}
    </div>
  );
}
