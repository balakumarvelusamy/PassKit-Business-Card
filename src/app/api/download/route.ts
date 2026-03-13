import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const urlReq = searchParams.get('url');

        if (!urlReq) {
            return new NextResponse("URL parameter is required", { status: 400 });
        }

        const passResponse = await fetch(urlReq);
        if (!passResponse.ok) {
            return new NextResponse("Failed to fetch the pass", { status: 500 });
        }

        const passBuffer = await passResponse.arrayBuffer();
        
        // Extract the filename from the URL, or default to pass.pkpass
        const urlParts = urlReq.split('/');
        const filename = urlParts[urlParts.length - 1] || "pass.pkpass";

        const headers = new Headers();
        headers.set('Content-Type', 'application/vnd.apple.pkpass');
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

        return new NextResponse(passBuffer, {
            status: 200,
            headers,
        });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        return new NextResponse(`Error downloading: ${msg}`, { status: 500 });
    }
}
