"use client";

import { useState } from "react";
import QRCode from "qrcode";
import PassForm from "../../components/PassForm";
import PassPreview from "../../components/PassPreview";
import "./home.css";

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
    title: "Organisation Name",
    profession: "",
    image: "",
    field1name: "Contact",
    field1value: "5021234567",
    field2name: "Name",
    field2value: "John",
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

  return (
    <div className="home-container">
      <div className="home-header">
        <span className="text-2xl font-bold text-center font-bold">To Create a Business Card Pass</span>
        <span className="text-center text-sm-600 font-italic"> Fill out the details below to generate an Apple Wallet Business Card.</span>
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
                <a href={successUrl} style={{ color: "#ffffff", textDecoration: "underline", fontWeight: 500, marginTop: "0.5rem" }}>
                  Download Pass
                </a>
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
