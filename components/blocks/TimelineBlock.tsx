'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getStrapiMedia, parseStrapiText } from '@/lib/api';

interface TimelineBlockProps {
  data?: any;
}

function extractMediaUrl(media: any): string {
  if (!media) return '';
  if (typeof media === 'string') return getStrapiMedia(media);
  if (Array.isArray(media) && media.length > 0) {
    return extractMediaUrl(media[0]);
  }
  if (typeof media === 'object') {
    const url = 
      media.url || 
      media.data?.attributes?.url || 
      media.data?.url || 
      media.attributes?.url || 
      media.image?.url ||
      media.image?.data?.attributes?.url;
    if (url) return getStrapiMedia(url);
  }
  return '';
}

export default function TimelineBlock({ data }: TimelineBlockProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const sectionBadge = parseStrapiText(data?.badgeText || data?.badge || data?.categoryName);
  const title = parseStrapiText(data?.title || data?.heading || data?.name || data?.sectionTitle) || 'Бидний түүхэн замнал';
  const sectionDesc = parseStrapiText(data?.description || data?.desc || data?.text);

  // Extract raw timeline array directly from Strapi
  const rawItems = 
    (Array.isArray(data?.events) && data.events.length > 0 && data.events) ||
    (Array.isArray(data?.items) && data.items.length > 0 && data.items) ||
    (Array.isArray(data?.timeline) && data.timeline.length > 0 && data.timeline) ||
    (Array.isArray(data?.milestones) && data.milestones.length > 0 && data.milestones) ||
    (Array.isArray(data?.histories) && data.histories.length > 0 && data.histories) ||
    (Array.isArray(data?.history) && data.history.length > 0 && data.history) ||
    (Array.isArray(data?.list) && data.list.length > 0 && data.list) ||
    (Array.isArray(data?.cards) && data.cards.length > 0 && data.cards) ||
    (Array.isArray(data?.years) && data.years.length > 0 && data.years) ||
    [];

  const items = rawItems.map((item: any) => {
    const rawYear = item.year || item.date || item.period || item.time || item.title || '';
    const rawTitle = item.title || item.heading || item.name || item.subTitle || '';
    const rawDesc = item.description || item.desc || item.content || item.text || item.detail || item.details || item.body || '';

    const image = extractMediaUrl(item.image || item.img || item.photo || item.media || item.picture) || '/images/who_are_we_main.jpg';
    const logo = extractMediaUrl(item.logo || item.brandLogo || item.icon) || '/logo.png';

    const yearStr = parseStrapiText(rawYear) || (typeof rawYear === 'number' || typeof rawYear === 'string' ? String(rawYear) : '');

    return {
      year: yearStr,
      title: parseStrapiText(rawTitle) || `${yearStr} оны хөгжил`,
      desc: parseStrapiText(rawDesc) || sectionDesc || 'Амуулай Групп тасралтгүй өсөн хөгжиж, шинэ боломжуудыг бүтээсээр байна.',
      image,
      logo,
    };
  }).filter((item: any) => item.year);

  if (!items || items.length === 0) {
    return null;
  }

  const safeActiveIndex = activeIndex >= items.length ? 0 : activeIndex;
  const activeStory = items[safeActiveIndex] || items[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <section 
      className="timeline-slider-section"
      style={{ 
        padding: '90px 0 100px', 
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* SECTION TITLE */}
        {(title || sectionBadge) && (
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            {sectionBadge && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#00829d]/10 text-[#00829d] text-xs font-extrabold uppercase tracking-wider mb-3 border border-[#00829d]/20">
                {sectionBadge}
              </span>
            )}
            <h2 
              style={{ 
                fontSize: '42px', 
                fontWeight: '800', 
                color: '#0f172a', 
                margin: '0 0 10px 0',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* TOP TIMELINE YEARS BAR */}
        <div style={{ position: 'relative', marginBottom: '60px', padding: '0 20px' }}>
          <div 
            style={{ 
              position: 'absolute', 
              top: '42px', 
              left: '50px', 
              right: '50px', 
              height: '2px', 
              borderTop: '2.5px dashed #cbd5e1', 
              zIndex: 1 
            }} 
          />

          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              position: 'relative', 
              zIndex: 2 
            }}
          >
            {items.map((item: any, idx: number) => {
              const isActive = safeActiveIndex === idx;

              return (
                <div 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span 
                    style={{ 
                      fontSize: isActive ? '18px' : '15px', 
                      fontWeight: isActive ? '800' : '600', 
                      color: isActive ? '#00829d' : '#94a3b8', 
                      marginBottom: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item.year}
                  </span>

                  <div 
                    style={{ 
                      width: isActive ? '20px' : '14px', 
                      height: isActive ? '20px' : '14px', 
                      borderRadius: '50%', 
                      background: isActive ? '#00829d' : '#cbd5e1', 
                      border: isActive ? '3px solid #e0f2fe' : '2px solid #ffffff',
                      boxShadow: isActive ? '0 0 0 3px rgba(0, 130, 157, 0.25)' : 'none',
                      transition: 'all 0.3s ease'
                    }} 
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTIVE STORY CONTENT */}
        {activeStory && (
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(12, 1fr)', 
              gap: '45px', 
              alignItems: 'center',
              minHeight: '400px'
            }}
          >
            <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {activeStory.logo && (
                <div style={{ marginBottom: '24px', position: 'relative', width: '120px', height: '45px' }}>
                  <Image 
                    src={activeStory.logo} 
                    alt={activeStory.title || 'Logo'} 
                    fill 
                    style={{ objectFit: 'contain', objectPosition: 'left' }} 
                  />
                </div>
              )}

              {activeStory.title && (
                <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', lineHeight: '1.3' }}>
                  {activeStory.title}
                </h3>
              )}

              {activeStory.desc && (
                <div 
                  style={{ fontSize: '15px', color: '#475569', lineHeight: '1.8', marginBottom: '35px', maxWidth: '520px' }}
                  dangerouslySetInnerHTML={{ __html: activeStory.desc }}
                />
              )}

              {items.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button 
                    onClick={handlePrev}
                    aria-label="Previous story"
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      border: '1px solid #cbd5e1', 
                      background: '#ffffff', 
                      color: '#00829d', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                    className="hover:bg-[#00829d] hover:text-white hover:border-[#00829d]"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button 
                    onClick={handleNext}
                    aria-label="Next story"
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%', 
                      border: '1px solid #cbd5e1', 
                      background: '#ffffff', 
                      color: '#00829d', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                    className="hover:bg-[#00829d] hover:text-white hover:border-[#00829d]"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {activeStory.image && (
              <div style={{ gridColumn: 'span 6' }}>
                <div 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '420px', 
                    borderRadius: '32px', 
                    overflow: 'hidden', 
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <Image 
                    src={activeStory.image} 
                    alt={activeStory.title || 'Image'} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    sizes="(max-width: 1024px) 100vw, 50vw" 
                    className="transition-all duration-700 ease-out"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .timeline-slider-section .container > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .timeline-slider-section .container > div:last-child > div {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
