import Portfolio from "@/components/Portfolio";
import { getImagesFromDrive } from "@/lib/google-drive";
import { clusterIntoShoots } from "@/lib/cluster-shoots";
import { images as staticImages } from "@/components/data";

export const metadata = {
  title: "Jacqueline Ashley | Modeling Portfolio",
  description: "Professional modeling portfolio of Jacqueline Ashley",
};

export const revalidate = 3600;

export default async function Home() {
  const FOLDER_ID = "1hRy9BWcSsCFjDDcfNG3-jF3TXH6VQdJQ";
  let portfolioImages = staticImages;

  if (process.env.GOOGLE_API_KEY || (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)) {
    try {
      const driveImages = await getImagesFromDrive(FOLDER_ID);
      if (driveImages.length > 0) {
        portfolioImages = driveImages;
      }
    } catch (e) {
      console.error("Failed to fetch images", e);
    }
  }

  const shoots = clusterIntoShoots(portfolioImages);

  return (
    <main>
      <Portfolio initialShoots={shoots} />
    </main>
  );
}
