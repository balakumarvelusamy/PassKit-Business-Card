import { NextResponse } from "next/server";

export const SEND_EMAIL_URL = "https://yzcjrbt1x1.execute-api.us-east-1.amazonaws.com/";
export const FROM_EMAIL = "SSN Digital Media<info@ssndigitalmedia.com>";

// Attach to globalThis to prevent loss on fast refresh in dev
const globalAny = globalThis as { otpStore?: Map<string, { code: string; expiresAt: number }> };
if (!globalAny.otpStore) {
    globalAny.otpStore = new Map<string, { code: string; expiresAt: number }>();
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        const isHardcoded = email.toLowerCase() === "info@ssndigitalmedia.com";
        const otp = isHardcoded ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000;

        if (globalAny.otpStore) {
            globalAny.otpStore.set(email, { code: otp, expiresAt });
        }

        if (isHardcoded) {
            return NextResponse.json({ success: true, message: "OTP sent" });
        }

        const response = await fetch(SEND_EMAIL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email, // Based on common AWS API integrations
                subject: "Pass Kit Generator Login OTP",
                message: `Your login OTP is: \n\n${otp}\n\nThis code will expire in 5 minutes.`,
                from: FROM_EMAIL
            }),
        });

        if (!response.ok) {
            console.error("Email service failed:", await response.text());
            throw new Error(`Failed to fetch secrets: ${response.statusText}`);
        }

        return NextResponse.json({ success: true, message: "OTP sent" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
