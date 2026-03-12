import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only");

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");
    const isAuthApi = request.nextUrl.pathname.startsWith("/api/auth");

    // Allow auth API routes
    if (isAuthApi) {
        return NextResponse.next();
    }

    // If there's no token and we're not on the login page, redirect to login
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token) {
        try {
            // Verify token
            await jwtVerify(token, JWT_SECRET);

            // If user is logged in, redirect away from login page to home
            if (isLoginPage) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch {
            // Token is invalid or expired
            if (!isLoginPage) {
                const response = NextResponse.redirect(new URL("/login", request.url));
                response.cookies.delete("auth_token");
                return response;
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes) -> Except we handled it inside
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
