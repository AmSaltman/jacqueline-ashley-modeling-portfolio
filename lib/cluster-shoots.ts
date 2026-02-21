import {
  type PortfolioImage,
  type PhotoShoot,
  type PhotographerCredit,
} from "@/components/data";

const EXCLUDED_DATES = new Set(["2026-01-09"]);

const PHOTOGRAPHER_CREDITS: Record<string, PhotographerCredit[]> = {
  "2026-01-21": [
    { name: "@mauikao", url: "https://instagram.com/mauikao" },
    { name: "@aeomlifestyle", url: "https://instagram.com/aeomlifestyle" },
  ],
  "2026-01-11": [
    { name: "@aloha.marcela", url: "https://instagram.com/aloha.marcela" },
  ],
  "2025-12-12": [
    { name: "@vivo.visuals", url: "https://instagram.com/vivo.visuals" },
  ],
  "2025-11-22": [
    { name: "@aloha.marcela", url: "https://instagram.com/aloha.marcela" },
  ],
  "2025-11-21": [
    { name: "@rajailiya", url: "https://instagram.com/rajailiya" },
  ],
  "2025-07-01": [
    {
      name: "@thaisaquinophotography",
      url: "https://instagram.com/thaisaquinophotography",
    },
  ],
  "2024-11-12": [
    { name: "@mauikao", url: "https://instagram.com/mauikao" },
    { name: "@aeomlifestyle", url: "https://instagram.com/aeomlifestyle" },
  ],
  "2024-11-09": [
    { name: "@aeomlifestyle", url: "https://instagram.com/aeomlifestyle" },
  ],
  "2024-06-30": [{ name: "Rachel Hernandez" }],
};

function parsePhotoDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (/^\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
    const normalized = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function dateKey(dateStr: string, parsed: Date): string {
  const exifMatch = dateStr.match(/^(\d{4}):(\d{2}):(\d{2})/);
  if (exifMatch) return `${exifMatch[1]}-${exifMatch[2]}-${exifMatch[3]}`;
  return parsed.toISOString().slice(0, 10);
}

function formatDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, month - 1, day, 12);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function clusterIntoShoots(images: PortfolioImage[]): PhotoShoot[] {
  const byDate = new Map<string, { date: Date; images: PortfolioImage[] }>();
  const undated: PortfolioImage[] = [];

  for (const img of images) {
    if (!img.createdTime) {
      undated.push(img);
      continue;
    }
    const parsed = parsePhotoDate(img.createdTime);
    if (!parsed) {
      undated.push(img);
      continue;
    }
    const key = dateKey(img.createdTime, parsed);
    if (EXCLUDED_DATES.has(key)) continue;
    if (!byDate.has(key)) {
      byDate.set(key, { date: parsed, images: [] });
    }
    byDate.get(key)!.images.push(img);
  }

  const sortedKeys = [...byDate.keys()].sort().reverse();

  const shoots: PhotoShoot[] = sortedKeys.map((key, index) => {
    const { date, images: shootImages } = byDate.get(key)!;
    shootImages.sort((a, b) => {
      const da = a.createdTime ? parsePhotoDate(a.createdTime) : null;
      const db = b.createdTime ? parsePhotoDate(b.createdTime) : null;
      if (!da || !db) return 0;
      return da.getTime() - db.getTime();
    });
    return {
      id: `shoot-${index}-${key}`,
      date: date.toISOString(),
      dateLabel: formatDateLabel(key),
      photographers: PHOTOGRAPHER_CREDITS[key] ?? [],
      images: shootImages,
    };
  });

  if (undated.length > 0) {
    shoots.push({
      id: "shoot-undated",
      date: new Date(0).toISOString(),
      dateLabel: "Undated",
      photographers: [],
      images: undated,
    });
  }

  if (shoots.length === 0 && images.length > 0) {
    shoots.push({
      id: "shoot-all",
      date: new Date().toISOString(),
      dateLabel: "All Photos",
      photographers: [],
      images,
    });
  }

  return shoots;
}
