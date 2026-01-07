"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: {
    url: string;
    altText: string;
    width?: number | null;
    height?: number | null;
  }[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Sin imágenes disponibles</p>
      </div>
    );
  }

  const mainImage = images[0];
  const thumbnails = images.slice(1, 5); // Show max 4 thumbnails
  const remainingCount = images.length - 5;

  return (
    <>
      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-2 h-[500px]">
        {/* Main large image */}
        <button
          onClick={() => openLightbox(0)}
          className="col-span-4 md:col-span-3 md:row-span-2 relative overflow-hidden rounded-lg group"
        >
          <Image
            src={mainImage.url}
            alt={mainImage.altText}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 75vw"
            priority
          />
        </button>

        {/* Thumbnails */}
        {thumbnails.map((image, index) => {
          const isLast = index === thumbnails.length - 1;
          const actualIndex = index + 1;

          return (
            <button
              key={actualIndex}
              onClick={() => openLightbox(actualIndex)}
              className={cn(
                "relative overflow-hidden rounded-lg group",
                "col-span-2 md:col-span-1 aspect-square"
              )}
            >
              <Image
                src={image.url}
                alt={image.altText}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {isLast && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    +{remainingCount} fotos
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </Button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {selectedIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-10 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-8 w-8" />
              <span className="sr-only">Imagen anterior</span>
            </Button>
          )}

          {/* Next Button */}
          {selectedIndex < images.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-10 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-8 w-8" />
              <span className="sr-only">Siguiente imagen</span>
            </Button>
          )}

          {/* Main Image */}
          <div
            className="relative w-full h-full flex items-center justify-center p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].altText}
              fill
              className="object-contain"
              sizes="100vw"
              quality={90}
            />
          </div>

          {/* Image Caption */}
          {images[selectedIndex].altText && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white text-sm bg-black/50 px-4 py-2 rounded-full max-w-2xl text-center">
              {images[selectedIndex].altText}
            </div>
          )}
        </div>
      )}
    </>
  );
}
