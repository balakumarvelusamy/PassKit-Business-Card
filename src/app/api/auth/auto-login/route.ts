import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "fallback_secret_for_development_only");

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required for auto-login" }, { status: 400 });
        }

        // Create a JWT session token for full auth access
        const token = await new SignJWT({ email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d") // 7 days expiration
            .sign(JWT_SECRET);

        // Set HTTP-only cookie
        const response = NextResponse.json({ success: true, message: "Auto-logged in successfully" });
        
        // Log the user in
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Error auto-logging in:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
