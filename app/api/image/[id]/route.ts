import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id) {
    return new NextResponse("Missing file ID", { status: 400 });
  }

  try {
    let drive;
    // Use Service Account if available
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
       const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      });
      drive = google.drive({ version: "v3", auth });
    } 
    // Fallback to API Key
    else if (process.env.GOOGLE_API_KEY) {
       drive = google.drive({ version: "v3", auth: process.env.GOOGLE_API_KEY });
    } else {
       // If no credentials, we can't proxy the image from Google Drive.
       // However, since the folder is public, we might not strictly need proxying if we had the direct link.
       // But the 'webContentLink' from 'list' usually forces a download or auth check.
       // To fetch the binary data via API (which this route does), we need an API key at minimum.
       return new NextResponse("Missing credentials", { status: 500 });
    }

    // Get file metadata to set correct content type
    const fileMetadata = await drive.files.get({
      fileId: id,
      fields: "mimeType, name",
    });

    // Get file content as stream
    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    // Create a new headers object (HeadersInit type)
    const headers = new Headers();
    headers.set("Content-Type", fileMetadata.data.mimeType || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // Return the stream
    // @ts-ignore - The types for Google Drive stream and Next.js response body are slightly mismatched but compatible
    return new NextResponse(response.data, {
      headers,
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
