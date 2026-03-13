import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { jwtVerify } from "jose";
import config from "../../../config.json";
import { getSecrets } from "../generate/route";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || "fallback_secret_for_development_only");

export async function GET(request: Request) {
    try {
        let userEmail = "";
        const authHeaderOrCookie = request.headers.get("cookie");
        const match = authHeaderOrCookie?.match(/auth_token=([^;]+)/);
        const token = match ? match[1] : null;

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            if (payload && typeof payload.email === "string") {
                userEmail = payload.email.replace(/@/g, "-").replace(/[^a-zA-Z0-9.-]/g, ""); 
            }
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (!userEmail) return NextResponse.json({ error: "No email" }, { status: 400 });

        const s3ConfigString = `ssndigitalmedia/ssnpasskitapp/prod/${userEmail}/`;
        const parts = s3ConfigString.split('/').filter(Boolean);
        const bucketName = parts[0]; 
        const prefixPath = parts.slice(1).join('/'); 

        const secrets = await getSecrets();

        const s3Client = new S3Client({
            region: config.REGION,
            credentials: {
                accessKeyId: secrets.s3key || secrets.AWS_ACCESS_KEY_ID || "MOCK_ACCESS_KEY",
                secretAccessKey: secrets.s3secret || secrets.AWS_SECRET_ACCESS_KEY || "MOCK_SECRET_KEY",
            },
        });

        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefixPath.endsWith('/') ? prefixPath : `${prefixPath}/`,
        });

        const listResponse = await s3Client.send(listCommand);
        const contents = listResponse.Contents || [];
        
        // Sort by LastModified (newest first)
        contents.sort((a, b) => {
            const timeA = a.LastModified ? a.LastModified.getTime() : 0;
            const timeB = b.LastModified ? b.LastModified.getTime() : 0;
            return timeB - timeA;
        });

        const passes = contents.map(obj => ({
            key: obj.Key,
            lastModified: obj.LastModified,
            size: obj.Size,
            url: `https://${bucketName}.s3.amazonaws.com/${obj.Key}`
        }));

        return NextResponse.json({ passes, count: passes.length, max: config.MAX_PASSES });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { key } = await request.json();
        if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 });

        let userEmail = "";
        const authHeaderOrCookie = request.headers.get("cookie");
        const match = authHeaderOrCookie?.match(/auth_token=([^;]+)/);
        const token = match ? match[1] : null;

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            if (payload && typeof payload.email === "string") {
                userEmail = payload.email.replace(/@/g, "-").replace(/[^a-zA-Z0-9.-]/g, ""); 
            }
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Verify that the requested key actually belongs to this user
        if (!key.includes(`ssnpasskitapp/prod/${userEmail}/`)) {
            return NextResponse.json({ error: "Unauthorized to delete this pass" }, { status: 403 });
        }

        const s3ConfigString = `ssndigitalmedia/ssnpasskitapp/prod/${userEmail}/`;
        const bucketName = s3ConfigString.split('/')[0];

        const secrets = await getSecrets();

        const s3Client = new S3Client({
            region: config.REGION,
            credentials: {
                accessKeyId: secrets.s3key || secrets.AWS_ACCESS_KEY_ID || "MOCK_ACCESS_KEY",
                secretAccessKey: secrets.s3secret || secrets.AWS_SECRET_ACCESS_KEY || "MOCK_SECRET_KEY",
            },
        });

        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(deleteCommand);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
