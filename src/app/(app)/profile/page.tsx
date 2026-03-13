"use client";

import React, { useEffect, useState } from "react";
import "../home.css";

export default function ProfilePage() {
    const [userEmail, setUserEmail] = useState<string>("Loading...");
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [contactStatus, setContactStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setContactStatus(null);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, subject, description })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send message");
            setContactStatus({ type: "success", message: "Message sent! Please check your email for a copy." });
            setName("");
            setSubject("");
            setDescription("");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setContactStatus({ type: "error", message: msg });
        } finally {
            setIsSending(false);
        }
    };

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

                    <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", lineHeight: "1.4", display: "block" }}>
                            <strong>Note:</strong> We are not saving your personal information. You have full access to delete your pass key from your account.
                        </span>
                    </div>

                    <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
                        <h3 style={{ marginBottom: "1rem" }}>Contact Us</h3>
                        {contactStatus && (
                            <div style={{ marginBottom: "1rem", padding: "1rem", borderRadius: "8px", backgroundColor: contactStatus.type === "error" ? "rgba(255,59,48,0.1)" : "rgba(52,199,89,0.1)", color: contactStatus.type === "error" ? "#ff453a" : "#32d74b", border: `1px solid ${contactStatus.type === "error" ? "rgba(255,59,48,0.3)" : "rgba(52,199,89,0.3)"}` }}>
                                {contactStatus.message}
                            </div>
                        )}
                        <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--foreground-muted)" }}>Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your Name" style={{ padding: "0.75rem", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "#fff", outline: "none" }} />
                            </div>
                            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--foreground-muted)" }}>Subject</label>
                                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="Message Subject" style={{ padding: "0.75rem", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "#fff", outline: "none" }} />
                            </div>
                            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--foreground-muted)" }}>Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} placeholder="How can we help you?" style={{ padding: "0.75rem", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "#fff", outline: "none", resize: "vertical" }} />
                            </div>
                            <button type="submit" disabled={isSending} style={{ padding: "0.75rem", marginTop: "0.5rem", background: "var(--foreground)", color: "var(--background)", border: "none", borderRadius: "8px", fontWeight: 600, cursor: isSending ? "not-allowed" : "pointer", opacity: isSending ? 0.7 : 1 }}>
                                {isSending ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
