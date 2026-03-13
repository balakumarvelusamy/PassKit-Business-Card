"use client";

import { useState } from "react";
import QRCode from "qrcode";
import PassForm from "../../components/PassForm";
import PassPreview from "../../components/PassPreview";
import "./home.css";

declare global {
    interface Window {
        ReactNativeWebView: any;
    }
}

export interface PassData {
  icon: string;
  name: string;
  title: string;
  profession: string;
  image: string;
  field1name: string;
  field1value: string;
  field2name: string;
  field2value: string;
  themeColor: string;
}

export default function HomePage() {
  const [passData, setPassData] = useState<PassData>({
    icon: "",
    name: "",
    title: "",
    profession: "",
    image: "",
    field1name: "",
    field1value: "",
    field2name: "",
    field2value: "",
    themeColor: "#677b5a", // default theme color from screenshot
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorResult, setErrorResult] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorResult(null);
    setSuccessUrl(null);
    setQrCodeDataUrl(null);

    if (!passData.title || passData.title.trim() === "") {
        setErrorResult("Organisation Name is required to generate a pass.");
        setIsGenerating(false);
        return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessUrl(data.url);
      const qrDataUrl = await QRCode.toDataURL(data.url, { width: 200, margin: 2 });
      setQrCodeDataUrl(qrDataUrl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorResult(`Error: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

    const handleDownload = async () => {
        if (!successUrl) return;
        try {
            const encodedUrl = encodeURIComponent(successUrl);
            const downloadUrl = `/api/download?url=${encodedUrl}`;

            // If we are inside the React Native App WebView, we need to trigger a standard
            // navigation so that the 'onShouldStartLoadWithRequest' interceptor can catch
            // the download URL and pass it natively to iOS Safari / Apple Wallet.
            if (window.ReactNativeWebView) {
                window.location.href = downloadUrl;
                return;
            }

            const res = await fetch(downloadUrl);
            if (!res.ok) throw new Error("Download failed");
            
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = passData.title ? `${passData.title.trim()}-pass.pkpass` : 'pass.pkpass';
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Download error:", err);
            alert("Error downloading pass. Please try again.");
        }
    };

    return (
    <div className="home-container">
      <div className="home-header" style={{ display: "none" }}>
        <span className="text-center text-sm-100 font-italic"> To Create a Business Card Pass Fill out the details below to generate an Apple Wallet Business Card.</span>
      </div>

      <div className="pass-workspace">
        <div className="workspace-column form-panel">
          <PassForm data={passData} onChange={setPassData} />

          <div className="action-panel">
            {errorResult && (
              <div className="alert error">
                {errorResult}
              </div>
            )}
            {successUrl && (
              <div
                className="alert success"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1.5rem",
                  backgroundColor: passData.themeColor,
                  color: "#ffffff"
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "1.125rem" }}>Pass generated successfully!</span>
                {qrCodeDataUrl && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src={qrCodeDataUrl} alt="QR Code for Pass" style={{ width: "180px", height: "180px", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem", backgroundColor: "white" }} />
                    <span style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#ffffff", fontWeight: 500 }}>Scan and Save</span>
                  </div>
                )}
                <button onClick={handleDownload} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ffffff", textDecoration: "underline", fontSize: "1rem", fontWeight: 500, marginTop: "0.5rem" }}>
                  Download Pass
                </button>
              </div>
            )}
            <button
              className={`generate-btn ${isGenerating ? "loading" : ""}`}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Pass"}
            </button>
          </div>
        </div>

        <div className="workspace-column preview-panel">
          <PassPreview data={passData} qrCodeUrl={qrCodeDataUrl} />
        </div>
      </div>
    </div>
  );
}
