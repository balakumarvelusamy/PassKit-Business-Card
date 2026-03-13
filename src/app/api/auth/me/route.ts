import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || "fallback_secret_for_development_only");

export async function GET(request: Request) {
    try {
        const authHeaderOrCookie = request.headers.get("cookie");
        const match = authHeaderOrCookie?.match(/auth_token=([^;]+)/);
        const token = match ? match[1] : null;

        if (!token) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        
        return NextResponse.json({ email: payload.email });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
