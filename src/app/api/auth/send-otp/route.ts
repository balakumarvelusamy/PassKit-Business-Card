import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export const SEND_EMAIL_URL = "https://yzcjrbt1x1.execute-api.us-east-1.amazonaws.com/";
export const FROM_EMAIL = "Digital Pass Kit Generator<info@ssndigitalmedia.com>";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "fallback_secret_for_development_only");

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        const isHardcoded = email.toLowerCase() === "info@ssndigitalmedia.com";
        const otp = isHardcoded ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000;

        if (isHardcoded) {
            const token = await new SignJWT({ email, otp })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime(expiresAt / 1000)
                .sign(JWT_SECRET);

            const responseObj = NextResponse.json({ success: true, message: "OTP sent" });
            responseObj.cookies.set("pending_otp", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 5 * 60, // 5 minutes
                path: "/api/auth/verify-otp",
            });
            return responseObj;
        }
        console.log("Email service request:", `${SEND_EMAIL_URL}sendemail`);
        const response = await fetch(`${SEND_EMAIL_URL}sendemail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender: FROM_EMAIL,
                recipient: email,
                subject: "Pass Kit Generator Login OTP",
                body: `Your login OTP is: \n\n${otp}\n\nThis code will expire in 5 minutes.`,
                cc: email
            }),
        });
        console.log("Email service response:", response);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Email service failed:", errorText);
            return NextResponse.json({ error: `Failed to send email: ${errorText}` }, { status: response.status });
        }

        const token = await new SignJWT({ email, otp })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(expiresAt / 1000)
            .sign(JWT_SECRET);

        const responseObj = NextResponse.json({ success: true, message: "OTP sent" });
        responseObj.cookies.set("pending_otp", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 5 * 60, // 5 minutes
            path: "/api/auth/verify-otp",
        });

        return responseObj;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
