import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

function getDriveClient() {
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    return google.drive({ version: "v3", auth });
  }
  if (process.env.GOOGLE_API_KEY) {
    return google.drive({ version: "v3", auth: process.env.GOOGLE_API_KEY });
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing file ID", { status: 400 });

  const drive = getDriveClient();
  if (!drive) return new NextResponse("Missing credentials", { status: 500 });

  try {
    const url = new URL(request.url);
    const targetWidth = url.searchParams.get("w");
    const quality = parseInt(url.searchParams.get("q") || "80", 10);

    if (targetWidth) {
      // Compressed thumbnail: fetch as buffer, resize with sharp, return JPEG
      const response = await drive.files.get(
        { fileId: id, alt: "media" },
        { responseType: "arraybuffer" }
      );
      const source = Buffer.from(response.data as ArrayBuffer);

      try {
        const resized = await sharp(source)
          .resize({ width: parseInt(targetWidth, 10), withoutEnlargement: true })
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();

        return new Response(new Uint8Array(resized), {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch {
        return new Response(new Uint8Array(source), {
          headers: {
            "Content-Type": "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // Full-resolution: stream original file
    const meta = await drive.files.get({ fileId: id, fields: "mimeType" });
    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    const headers = new Headers();
    headers.set("Content-Type", meta.data.mimeType || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // @ts-expect-error — Google stream is compatible with Response body
    return new NextResponse(response.data, { headers });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
