"use client";

import { useState } from "react";
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
  email: string;
  website: string;
  instagram: string;
  pinterest: string;
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
    email: "info@youremail.com",
    website: "www.yourwebsite.com",
    instagram: "@yourinstagram",
    pinterest: "",
    themeColor: "#677b5a", // default theme color from screenshot
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGenerationResult(`Pass generated successfully! S3 URL: ${data.url}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setGenerationResult(`Error: ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Create a Business Card Pass</h2>
        <p>Fill out the details below to generate an Apple Wallet Business Card.</p>
      </div>

      <div className="pass-workspace">
        <div className="workspace-column form-panel">
          <PassForm data={passData} onChange={setPassData} />

          <div className="action-panel">
            {generationResult && (
              <div className={`alert ${generationResult.includes("Error") ? "error" : "success"}`}>
                {generationResult}
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
          <PassPreview data={passData} />
        </div>
      </div>
    </div>
  );
}
