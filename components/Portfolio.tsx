"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { images as staticImages, type PortfolioImage } from "./data";
import { cn } from "@/lib/utils";

interface PortfolioProps {
  initialImages: PortfolioImage[];
}

export default function Portfolio({ initialImages }: PortfolioProps) {
  const [images] = useState<PortfolioImage[]>(initialImages);
  const [sliderValue, setSliderValue] = useState(50); // 0 to 100
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate columns based on slider and window width
  const columns = useMemo(() => {
    if (windowWidth === 0) return 1; // SSR/Initial
    
    // Map slider (0-100) to target image width (e.g., 200px to 800px)
    // Invert logic: Lower slider = smaller images = more columns
    const minWidth = 150;
    const maxWidth = 800;
    const targetWidth = minWidth + (sliderValue / 100) * (maxWidth - minWidth);
    
    const calculatedCols = Math.floor(windowWidth / targetWidth);
    return Math.max(1, Math.min(calculatedCols, images.length));
  }, [sliderValue, windowWidth, images.length]);

  // Distribute images into columns for masonry layout
  const masonryColumns = useMemo(() => {
    const cols: PortfolioImage[][] = Array.from({ length: columns }, () => []);
    images.forEach((img, i) => {
      cols[i % columns].push(img);
    });
    return cols;
  }, [columns, images]);

  // Navigation handlers
  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  }, [images.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handlePrev, handleNext]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-light tracking-widest uppercase">
          Jacqueline Ashley
        </h1>
        <p className="text-sm md:text-base text-gray-500 tracking-wider uppercase">
          Modeling Portfolio
        </p>
      </header>

      {/* Controls */}
      <div className="sticky top-4 z-10 flex justify-center mb-8">
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200 flex items-center gap-4 w-full max-w-md">
          <span className="text-xs text-gray-400 uppercase tracking-widest">Small</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
          <span className="text-xs text-gray-400 uppercase tracking-widest">Large</span>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="flex gap-4 items-start justify-center">
        {masonryColumns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4 flex-1">
            {col.map((image) => (
              <motion.div
                layout
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative group cursor-zoom-in overflow-hidden rounded-sm"
                onClick={() => setSelectedImageIndex(images.findIndex((i) => i.id === image.id))}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className={cn(
                    "w-full h-auto object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105",
                    !loadedImages.has(image.id) && "bg-gray-100 min-h-[200px]"
                  )}
                  onLoad={() => setLoadedImages((prev) => new Set(prev).add(image.id))}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition-colors z-50"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Nav Left */}
            <button
              className="absolute left-4 p-4 text-gray-400 hover:text-black transition-colors z-50 hidden md:block"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Nav Right */}
            <button
              className="absolute right-4 p-4 text-gray-400 hover:text-black transition-colors z-50 hidden md:block"
              onClick={handleNext}
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image Container */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImageIndex].srcFull || images[selectedImageIndex].src}
                alt={images[selectedImageIndex].alt}
                className="max-h-[85vh] w-auto max-w-full object-contain"
                loading="eager"
                fetchPriority="high"
              />
              
              {/* Mobile Nav Overlay (invisible but clickable areas) */}
               <div className="absolute inset-y-0 left-0 w-1/4 z-40 md:hidden" onClick={handlePrev} />
               <div className="absolute inset-y-0 right-0 w-1/4 z-40 md:hidden" onClick={handleNext} />
            </motion.div>

            {/* Caption/Counter */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500 text-sm tracking-widest uppercase">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
