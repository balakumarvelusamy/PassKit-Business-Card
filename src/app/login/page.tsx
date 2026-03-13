"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import config from "../../config.json";
import "./login.css"; // We'll create a module/css file for the scoped premium styles

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Auto-login if secure local storage has the credentials
    useEffect(() => {
        const storedEmail = secureLocalStorage.getItem("email") as string;
        const storedOtp = secureLocalStorage.getItem("otp") as string;
        const isLoggedIn = secureLocalStorage.getItem("logged_in");

        if (isLoggedIn === true && storedEmail && storedOtp) {
            const autoLogin = async () => {
                setLoading(true);
                try {
                    const res = await fetch("/api/auth/auto-login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: storedEmail, otp: storedOtp }),
                    });

                    if (res.ok) {
                        window.location.href = "/";
                    } else {
                        secureLocalStorage.removeItem("logged_in");
                        setLoading(false);
                    }
                } catch (e) {
                    setLoading(false);
                }
            };
            autoLogin();
        }
    }, []);

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

    const submitOtp = async (otpValue: string) => {
        if (!otpValue) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpValue }),
            });

            const data = await res.json();
            console.log("OTP API Response Data:", data);

            if (!res.ok) {
                throw new Error(data.error || "Failed to verify OTP");
            }

            // Save encrypted values to secure local storage
            secureLocalStorage.setItem("email", email);
            secureLocalStorage.setItem("otp", otpValue);
            secureLocalStorage.setItem("logged_in", true);

            // Successful login, force a full page reload to ensure middleware gets the new cookie
            window.location.href = "/";
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error("Verification Exception:", msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitOtp(otp);
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setOtp(value);
        if (value.length === 6) {
            submitOtp(value);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card fade-in">
                <div className="brand">
                    <div className="logo-placeholder"><img src="/passkitapp.jpg" width="100" height="100" alt="PassKit Logo" /></div>
                    <h1>{config.title}</h1>
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
                                type="tel"
                                inputMode="numeric"
                                placeholder="123456"
                                value={otp}
                                onChange={handleOtpChange}
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
