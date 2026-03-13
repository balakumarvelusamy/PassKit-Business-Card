"use client";

import React, { useEffect, useState } from "react";
import "../home.css";

export default function ProfilePage() {
    const [userEmail, setUserEmail] = useState<string>("Loading...");

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUserEmail(data.email || "Not Logged In");
                } else {
                    setUserEmail("Not Logged In");
                }
            } catch (err) {
                setUserEmail("Not Logged In");
            }
        };
        checkLogin();
    }, []);

    return (
        <div className="home-container">

            <div className="pass-workspace" style={{ justifyContent: "center" }}>
                <div className="workspace-column form-panel" style={{ maxWidth: "600px", padding: "2rem", backgroundColor: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                    <h2 style={{ marginBottom: "1.5rem" }}>Profile Information</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", fontWeight: 600 }}>USER EMAIL</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>{userEmail}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
