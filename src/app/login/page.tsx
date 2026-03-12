"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css"; // We'll create a module/css file for the scoped premium styles

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send OTP");
            }

            setStep("otp");
            setMessage("OTP sent to your email!");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            console.log("OTP API Response Data:", data);
            if (!data.success) {
                console.error("API Error Data:", data);
                throw new Error(data.error || "Invalid OTP");
            }

            // Successful login, middleware will allow us into /
            router.push("/");
            router.refresh();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("Verification Exception:", msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card fade-in">
                <div className="brand">
                    <div className="logo-placeholder"></div>
                    <h1>SSN PassKit</h1>
                </div>

                <p className="subtitle">
                    {step === "email" ? "Sign in to manage your digital cards" : "Enter the 6-digit code sent to your email"}
                </p>

                {error && <div className="alert error shake">{error}</div>}
                {message && <div className="alert success">{message}</div>}

                {step === "email" ? (
                    <form onSubmit={handleSendOtp} className="login-form slide-up">
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="info@yourdomain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
                            {loading ? "Sending..." : "Continue with Email"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="login-form slide-up">
                        <div className="input-group">
                            <label htmlFor="otp">Verification Code</label>
                            <input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength={6}
                                pattern="[0-9]{6}"
                                disabled={loading}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
                            {loading ? "Verifying..." : "Sign In"}
                        </button>
                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => { setStep("email"); setOtp(""); setError(""); setMessage(""); }}
                            disabled={loading}
                        >
                            Back to Email
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
