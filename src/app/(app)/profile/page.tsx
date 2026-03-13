"use client";

import React from "react";
import "../home.css";

export default function ProfilePage() {
    return (
        <div className="home-container">

            <div className="pass-workspace" style={{ justifyContent: "center" }}>
                <div className="workspace-column form-panel" style={{ maxWidth: "600px", padding: "2rem", backgroundColor: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                    <h2 style={{ marginBottom: "1rem" }}>Profile Information</h2>
                    <p style={{ color: "var(--foreground-muted)" }}>Profile management features will be available here soon.</p>
                </div>
            </div>
        </div>
    );
}
