import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "fallback_secret_for_development_only");

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
        }

        // Retrieve the pending_otp cookie
        const authHeaderOrCookie = request.headers.get("cookie");
        const match = authHeaderOrCookie?.match(/pending_otp=([^;]+)/);
        const pendingToken = match ? match[1] : null;

        if (!pendingToken) {
            return NextResponse.json({ error: "No OTP requests found. Please request a new code or ensure cookies are enabled." }, { status: 400 });
        }

        let decoded;
        try {
            const { payload } = await jwtVerify(pendingToken, JWT_SECRET);
            decoded = payload;
        } catch (err) {
            return NextResponse.json({ error: "OTP token is invalid or expired." }, { status: 400 });
        }

        if (decoded.email !== email || decoded.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
        }

        // Create a JWT session token for full auth access
        const token = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d") // 7 days expiration
            .sign(JWT_SECRET);

        // Set HTTP-only cookie
        const response = NextResponse.json({ success: true, message: "Logged in successfully" });

        // Log the user in
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/",
        });

        // Destroy the temp OTP cookie so it can't be reused
        response.cookies.set("pending_otp", "", {
            maxAge: -1,
            path: "/api/auth/verify-otp",
        });

        return response;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
