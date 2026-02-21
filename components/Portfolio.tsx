"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import {
  type PhotoShoot,
  type PortfolioImage,
  type PhotographerCredit,
} from "./data";
import { cn } from "@/lib/utils";

const ROW_HEIGHT_DESKTOP = 380;
const ROW_HEIGHT_MOBILE = 260;

const CONTACT = {
  phone: "+1 (555) 123-4567",
  email: "jacqueline@example.com",
};

// ─── Main Component ─────────────────────────────────────────────

interface PortfolioProps {
  initialShoots: PhotoShoot[];
}

export default function Portfolio({ initialShoots }: PortfolioProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [showContact, setShowContact] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const allImages = useMemo<PortfolioImage[]>(
    () => initialShoots.flatMap((s) => s.images),
    [initialShoots]
  );

  const imageIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    allImages.forEach((img, i) => map.set(img.id, i));
    return map;
  }, [allImages]);

  const openLightbox = useCallback(
    (imageId: string) => {
      const idx = imageIndexMap.get(imageId);
      if (idx !== undefined) {
        setLightboxLoaded(false);
        setLightboxIndex(idx);
      }
    },
    [imageIndexMap]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLightboxLoaded(false);
      setLightboxIndex((prev) =>
        prev !== null ? (prev - 1 + allImages.length) % allImages.length : null
      );
    },
    [allImages.length]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLightboxLoaded(false);
      setLightboxIndex((prev) =>
        prev !== null ? (prev + 1) % allImages.length : null
      );
    },
    [allImages.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, handlePrev, handleNext]);

  useEffect(() => {
    document.body.style.overflow =
      lightboxIndex !== null || showContact ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, showContact]);

  if (!mounted) return null;

  const currentImage = lightboxIndex !== null ? allImages[lightboxIndex] : null;
  const currentShoot = currentImage
    ? initialShoots.find((s) => s.images.some((img) => img.id === currentImage.id))
    : null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="pt-16 md:pt-24 pb-10 md:pb-14 text-center px-6">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl tracking-tight"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Jacqueline Ashley
        </h1>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[var(--muted)]/40" />
          <p className="text-xs md:text-sm text-[var(--muted)] tracking-[0.25em] uppercase">
            Portfolio
          </p>
          <div className="h-px w-8 bg-[var(--muted)]/40" />
        </div>
        <p className="mt-5 text-[11px] text-[var(--muted)]/50 tracking-widest">
          {allImages.length} images &middot; {initialShoots.length} sessions
        </p>

        <button
          onClick={() => setShowContact(true)}
          className="mt-8 inline-flex items-center gap-2 px-7 py-3 border border-[var(--foreground)] text-[var(--foreground)] text-xs tracking-[0.2em] uppercase hover:bg-[var(--foreground)] hover:text-white transition-all duration-300 rounded-full"
        >
          Work with me
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* ── Shoot sections ─────────────────────────────────────── */}
      <div className="pb-24 space-y-0">
        {initialShoots.map((shoot, shootIndex) => (
          <ShootSection
            key={shoot.id}
            shoot={shoot}
            shootIndex={shootIndex}
            loadedImages={loadedImages}
            onImageLoad={(id) => setLoadedImages((prev) => new Set(prev).add(id))}
            onImageClick={openLightbox}
          />
        ))}
      </div>

      {/* ── Lightbox ───────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-white flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-5 right-5 p-2 text-[var(--muted)]/50 hover:text-[var(--foreground)] transition-colors z-50"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <button
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 p-3 text-[var(--muted)]/30 hover:text-[var(--foreground)] transition-colors z-50 hidden md:flex items-center justify-center"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 p-3 text-[var(--muted)]/30 hover:text-[var(--foreground)] transition-colors z-50 hidden md:flex items-center justify-center"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Glow loader */}
            <AnimatePresence>
              {!lightboxLoaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                >
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200/60 via-gray-100/40 to-gray-200/60 blur-2xl lightbox-glow" />
                    <div className="absolute inset-0 w-32 h-32 rounded-full overflow-hidden lightbox-shimmer" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center px-4 md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.srcFull || currentImage.src}
                alt={currentImage.alt}
                className={cn(
                  "max-h-[85vh] w-auto max-w-full object-contain select-none transition-opacity duration-500",
                  lightboxLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setLightboxLoaded(true)}
                draggable={false}
              />
              <div className="absolute inset-y-0 left-0 w-1/3 z-40 md:hidden" onClick={handlePrev} />
              <div className="absolute inset-y-0 right-0 w-1/3 z-40 md:hidden" onClick={handleNext} />
            </motion.div>

            {/* Bottom info */}
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
              {currentShoot && (
                <p className="text-[var(--muted)]/40 text-[11px] tracking-[0.15em] uppercase">
                  {currentShoot.dateLabel}
                  {currentShoot.photographers.length > 0 && (
                    <>
                      {" — "}
                      {currentShoot.photographers.map((p) => p.name).join(" & ")}
                    </>
                  )}
                </p>
              )}
              <p className="text-[var(--muted)]/25 text-[10px] tracking-[0.3em] tabular-nums mt-1">
                {lightboxIndex + 1} / {allImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contact modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl p-10 md:p-14 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 p-1.5 text-[var(--muted)]/40 hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2
                className="text-2xl md:text-3xl tracking-tight text-center"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Let&apos;s Work Together
              </h2>
              <p className="text-sm text-[var(--muted)] text-center mt-3 max-w-xs mx-auto leading-relaxed">
                Interested in booking a shoot or collaboration? I&apos;d love to
                hear from you.
              </p>

              <div className="mt-10 space-y-4">
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--foreground)]/20 hover:bg-[var(--surface)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center group-hover:bg-[var(--foreground)] group-hover:text-white transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted)] tracking-widest uppercase">
                      Phone
                    </p>
                    <p className="text-sm font-medium tracking-wide mt-0.5">
                      {CONTACT.phone}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--foreground)]/20 hover:bg-[var(--surface)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center group-hover:bg-[var(--foreground)] group-hover:text-white transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted)] tracking-widest uppercase">
                      Email
                    </p>
                    <p className="text-sm font-medium tracking-wide mt-0.5">
                      {CONTACT.email}
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Photographer Credits ───────────────────────────────────────

function PhotographerCredits({
  photographers,
}: {
  photographers: PhotographerCredit[];
}) {
  if (photographers.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <Camera className="w-3.5 h-3.5 text-[var(--muted)]/40 flex-shrink-0" />
      <span className="text-sm text-[var(--muted)]">
        {photographers.map((credit, i) => (
          <React.Fragment key={credit.name}>
            {i > 0 && (
              <span className="text-[var(--muted)]/30 mx-1">&</span>
            )}
            {credit.url ? (
              <a
                href={credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--foreground)] transition-colors underline underline-offset-2 decoration-[var(--border)]"
              >
                {credit.name}
              </a>
            ) : (
              <span>{credit.name}</span>
            )}
          </React.Fragment>
        ))}
      </span>
    </div>
  );
}

// ─── Shoot Section ──────────────────────────────────────────────

interface ShootSectionProps {
  shoot: PhotoShoot;
  shootIndex: number;
  loadedImages: Set<string>;
  onImageLoad: (id: string) => void;
  onImageClick: (imageId: string) => void;
}

function ShootSection({
  shoot,
  shootIndex,
  loadedImages,
  onImageLoad,
  onImageClick,
}: ShootSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [rowHeight, setRowHeight] = useState(ROW_HEIGHT_DESKTOP);

  useEffect(() => {
    const update = () =>
      setRowHeight(
        window.innerWidth < 768 ? ROW_HEIGHT_MOBILE : ROW_HEIGHT_DESKTOP
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "right" ? el.clientWidth * 0.75 : -el.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  const fadeMask =
    canScrollLeft && canScrollRight
      ? "scroll-fade"
      : canScrollRight
        ? "scroll-fade-right"
        : canScrollLeft
          ? "scroll-fade-left"
          : "scroll-fade-none";

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: shootIndex < 3 ? shootIndex * 0.1 : 0,
      }}
      className="py-8 md:py-10"
    >
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-16 mb-5 flex items-end justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h2
            className="text-xl md:text-2xl tracking-tight text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {shoot.dateLabel}
          </h2>
          <p className="text-[11px] text-[var(--muted)]/60 mt-1 tracking-widest uppercase">
            {shoot.images.length}{" "}
            {shoot.images.length === 1 ? "photo" : "photos"}
          </p>
        </div>

        <PhotographerCredits photographers={shoot.photographers} />
      </div>

      {/* Photo strip */}
      <div className="relative group/strip">
        {canScrollLeft && (
          <button
            onClick={() => scrollBy("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity duration-200 hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scrollBy("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity duration-200 hover:bg-white"
          >
            <ChevronRight className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        )}

        <div
          ref={scrollRef}
          className={cn(
            "photo-strip flex gap-1.5 overflow-x-auto px-6 md:px-12 lg:px-16",
            fadeMask
          )}
        >
          {shoot.images.map((image, imgIndex) => {
            const aspectRatio = image.width / image.height;
            const photoWidth = Math.round(rowHeight * aspectRatio);

            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(imgIndex * 0.03, 0.3),
                }}
                className="relative flex-shrink-0 group/photo cursor-zoom-in overflow-hidden rounded-[3px]"
                style={{ width: photoWidth, height: rowHeight }}
                onClick={() => onImageClick(image.id)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500 ease-out will-change-transform group-hover/photo:scale-[1.03]",
                    loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => onImageLoad(image.id)}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                {!loadedImages.has(image.id) && (
                  <div className="absolute inset-0 bg-[var(--surface)] animate-pulse" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/[0.06] transition-colors duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 md:mt-10 mx-6 md:mx-12 lg:mx-16 border-t border-[var(--border)]/50" />
    </motion.section>
  );
}
