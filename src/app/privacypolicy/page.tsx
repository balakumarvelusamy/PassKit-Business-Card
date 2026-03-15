"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100dvh", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <Link href="/profile" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--primary, #eaf2fa)", textDecoration: "none", fontWeight: 500 }}>
                        <ArrowLeft size={20} />
                        Back to Profile
                    </Link>
                </div>
                
                <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", fontWeight: "bold" }}>Privacy Policy</h1>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6", color: "#e5e5ea" }}>
                    <p>
                        This Privacy Policy describes how we collect, use, and handle your information when you use the PassKit Business Card Generator.
                    </p>
                    
                    <section>
                        <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "0.5rem" }}>Data Collection and Storage</h2>
                        <p>
                            <strong>We are not saving your login info.</strong> The authentication relies on an emailed one-time passcode and secure cookies placed securely on your local device. We do not permanently store your email or passcode on our servers after your session is active.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "0.5rem" }}>Your Control Over Data</h2>
                        <p>
                            You have full access to delete your PassKit Business Card at any time from your account using the provided interface. When you delete a pass, all associated data and media uploaded for that specific pass are permanently purged from the cloud storage bucket alongside the digital pass itself.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "0.5rem" }}>Analytics and Tracking</h2>
                        <p>
                            We do not use any targeted marketing cookies, trackers, or invasive analytics platforms on this service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
