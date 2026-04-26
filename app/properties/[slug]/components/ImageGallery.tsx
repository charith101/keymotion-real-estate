"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { PropertyImage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <section className="bg-background">
        <div className="relative aspect-[16/9] w-full md:aspect-[21/9] bg-black">
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || title}
            fill
            className="object-contain md:object-cover"
            priority
            sizes="100vw"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Expand Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4 bg-background/80 backdrop-blur-sm shadow-md z-10"
            onClick={() => setLightboxOpen(true)}
            aria-label="View full image"
          >
            <Expand className="h-4 w-4" />
          </Button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm shadow-md z-10 hidden md:flex"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm shadow-md z-10 hidden md:flex"
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              {/* Mobile tap zones */}
              <div className="absolute inset-y-0 left-0 w-1/4 z-0 md:hidden" onClick={goToPrevious} />
              <div className="absolute inset-y-0 right-0 w-1/4 z-0 md:hidden" onClick={goToNext} />
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm z-10 shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="container py-4 border-b">
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg transition-all border-2",
                    currentIndex === index
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-primary/50"
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[100vw] max-h-[100dvh] h-[100dvh] w-[100vw] p-0 bg-black/95 border-none rounded-none flex flex-col m-0 sm:rounded-none">
          <DialogTitle className="sr-only">{title} - Image Gallery</DialogTitle>
          <DialogDescription className="sr-only">
            Full screen image viewer. Use arrow keys or buttons to navigate between images.
          </DialogDescription>
          
          <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden touch-none">
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-white hover:bg-white/20 z-50 bg-black/20 backdrop-blur-sm rounded-full"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full hidden sm:flex bg-black/20 backdrop-blur-sm z-50"
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full hidden sm:flex bg-black/20 backdrop-blur-sm z-50"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
                
                {/* Mobile tap zones */}
                <div className="absolute inset-y-0 left-0 w-1/3 sm:hidden z-10" onClick={goToPrevious} />
                <div className="absolute inset-y-0 right-0 w-1/3 sm:hidden z-10" onClick={goToNext} />
              </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm z-50 shadow-lg">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
