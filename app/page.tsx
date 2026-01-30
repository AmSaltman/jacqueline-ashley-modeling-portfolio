import Portfolio from "@/components/Portfolio";
import { getImagesFromDrive } from "@/lib/google-drive";
import { images as staticImages } from "@/components/data";

export const metadata = {
  title: "Jacqueline Ashley | Modeling Portfolio",
  description: "Professional modeling portfolio of Jacqueline Ashley",
};

// Revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  const FOLDER_ID = "1hRy9BWcSsCFjDDcfNG3-jF3TXH6VQdJQ";
  let portfolioImages = staticImages;

  // Use API Key if available, otherwise fall back to static images
  // For public folders, we can use the API key method without Service Account
  if (process.env.GOOGLE_API_KEY) {
    try {
      const driveImages = await getImagesFromDrive(FOLDER_ID);
      if (driveImages.length > 0) {
        portfolioImages = driveImages;
      }
    } catch (e) {
      console.error("Failed to fetch images", e);
    }
  }

  return (
    <main>
      <Portfolio initialImages={portfolioImages} />
    </main>
  );
}
