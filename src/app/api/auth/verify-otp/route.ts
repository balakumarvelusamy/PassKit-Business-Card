import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only");

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
        }

        const globalAny = globalThis as { otpStore?: Map<string, { code: string; expiresAt: number }> };
        const store = globalAny.otpStore;

        if (!store) {
            return NextResponse.json({ error: "No OTP requests found. Please request a new code." }, { status: 400 });
        }

        const record = store.get(email);

        if (!record) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        if (Date.now() > record.expiresAt) {
            store.delete(email);
            return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
        }

        if (record.code !== otp) {
            return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
        }

        // OTP fits, success
        store.delete(email);

        // Create a JWT session token
        const token = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d") // 7 days expiration
            .sign(JWT_SECRET);

        // Set HTTP-only cookie
        const response = NextResponse.json({ success: true, message: "Logged in successfully" });
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
