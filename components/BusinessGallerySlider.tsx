'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface BusinessGallerySliderProps {
  images: string[];
  name?: string;
}

export default function BusinessGallerySlider({ images, name = 'Бизнес' }: BusinessGallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Detect Mobile Viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation for Lightbox (ESC, Left, Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev <= 0 ? images.length - 1 : prev - 1) : null));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images.length]);

  // 2 full slides + 3rd peeking (2.35 slidesPerView on desktop, 1.25 on mobile)
  const slidesPerView = isMobile ? 1.25 : 2.35;
  const maxIndex = Math.max(0, images.length - Math.floor(isMobile ? 1 : 2));

  // Auto-slide timer (every 3.5 seconds) - pauses when hovered or lightbox open
  useEffect(() => {
    if (!images || images.length <= 1 || isHovered || lightboxIndex !== null) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [images, isHovered, lightboxIndex, maxIndex]);

  if (!images || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const cardFlexWidth = isMobile
    ? 'calc((100% - 12px) / 1.25)'
    : 'calc((100% - 16px * 2) / 2.35)';

  return (
    <>
      <div 
        className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>Зургийн Цомог</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#00829d]/10 text-[#00829d] border border-[#00829d]/20">
              {images.length} зураг
            </span>
          </h3>

          {images.length > 2 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Өмнөх зураг"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#00829d] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                aria-label="Дараах зураг"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#00829d] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Outer Overflow Hidden Track Wrapper */}
        <div className="overflow-hidden w-full rounded-2xl py-1">
          <div
            className="flex gap-4 transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1)"
            style={{
              transform: `translateX(calc(-${currentIndex * (100 / slidesPerView)}%))`,
              willChange: 'transform',
            }}
          >
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative h-44 sm:h-48 md:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-gray-100 shadow-sm flex-shrink-0 group cursor-pointer"
                style={{
                  flex: `0 0 ${cardFlexWidth}`,
                }}
              >
                <Image
                  src={imgUrl}
                  alt={`${name} gallery photo ${idx + 1}`}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Dynamic Gradient & Zoom Icon on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-[#00829d] flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-[#00829d]' : 'w-2 bg-slate-200 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20"
            aria-label="Хаах"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Container */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={images[lightboxIndex]}
                alt={`${name} enlarged photo ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Counter & Controls */}
            <div className="mt-4 flex items-center gap-6 text-white">
              {images.length > 1 && (
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev <= 0 ? images.length - 1 : prev - 1) : null))}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                  aria-label="Өмнөх"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <span className="text-sm font-semibold tracking-wider text-slate-300">
                {lightboxIndex + 1} / {images.length}
              </span>

              {images.length > 1 && (
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                  aria-label="Дараах"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
