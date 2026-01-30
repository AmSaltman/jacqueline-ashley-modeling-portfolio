export interface PortfolioImage {
  id: string;
  src: string;
  srcFull?: string; // Optional full-size image for lightbox
  width: number;
  height: number;
  alt: string;
}

// Using placeholder images from Unsplash
export const images: PortfolioImage[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", width: 800, height: 1200, alt: "Model portrait" },
  { id: "2", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80", width: 800, height: 1000, alt: "Fashion shoot" },
  { id: "3", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80", width: 800, height: 1200, alt: "Street style" },
  { id: "4", src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80", width: 800, height: 1100, alt: "Studio shot" },
  { id: "5", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80", width: 800, height: 800, alt: "Headshot" },
  { id: "6", src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80", width: 800, height: 1200, alt: "Fashion close-up" },
  { id: "7", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80", width: 800, height: 1000, alt: "Urban model" },
  { id: "8", src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80", width: 800, height: 1200, alt: "Artistic portrait" },
  { id: "9", src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80", width: 800, height: 1100, alt: "Editorial" },
  { id: "10", src: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9?auto=format&fit=crop&w=800&q=80", width: 800, height: 1200, alt: "Runway style" },
  { id: "11", src: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80", width: 800, height: 800, alt: "Lifestyle" },
  { id: "12", src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", width: 800, height: 1000, alt: "Nature shoot" },
];
