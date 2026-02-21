import { google } from "googleapis";

export async function getImagesFromDrive(folderId: string) {
  try {
    let drive;

    // Use Service Account if available (preferred for higher limits)
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
    // Fallback to API Key (simpler, works for public folders)
    else if (process.env.GOOGLE_API_KEY) {
      drive = google.drive({ version: "v3", auth: process.env.GOOGLE_API_KEY });
    } else {
      console.warn("No Google Drive credentials found.");
      return [];
    }

    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/') and trashed = false`,
      fields: "files(id, name, mimeType, webContentLink, imageMediaMetadata, thumbnailLink, createdTime)",
      pageSize: 1000,
    });

    const files = response.data.files;

    if (!files) return [];

    return files.map((file) => {
       const createdTime = file.imageMediaMetadata?.time || file.createdTime || undefined;
       
       return {
        id: file.id!,
        name: file.name!,
        src: `/api/image/${file.id}?w=600&q=70`,
        srcFull: `/api/image/${file.id}`,
        width: file.imageMediaMetadata?.width || 800,
        height: file.imageMediaMetadata?.height || 1000,
        alt: file.name || "Portfolio Image",
        createdTime,
      };
    });
  } catch (error) {
    console.error("Error fetching images from Drive:", error);
    return [];
  }
}
