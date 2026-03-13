import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import config from "../../../config.json";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "fallback_secret_for_development_only");

export async function POST(request: Request) {
    try {
        const { name, subject, description } = await request.json();

        // Get user email from token
        const cookieHeader = request.headers.get("cookie") || "";
        const tokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
        let userEmail = "";

        if (tokenMatch) {
            try {
                const { payload } = await jwtVerify(tokenMatch[1], JWT_SECRET);
                userEmail = payload.email as string;
            } catch (e) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!name || !subject || !description) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const response = await fetch(`${config.SEND_EMAIL_URL}sendemail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender: config.FROM_EMAIL,
                recipient: userEmail,
                subject: `Support Request: ${subject}`,
                body: `Message from ${name} (${userEmail}):\n\n${description}`,
                cc: "info@ssndigitalmedia.com"
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Email sending failed: ${errorText}`);
        }

        return NextResponse.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
