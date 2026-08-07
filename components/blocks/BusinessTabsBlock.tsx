'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/lib/api';

interface BusinessTabsBlockProps {
  data?: any;
}

const defaultConsumerBusinesses = [
  {
    title: "Mild Cosmetics",
    slug: "mild-cosmetics",
    desc: "Японы гоо сайхан, арьс арчилгааны сүлжээ дэлгүүр",
    logoUrl: "/mild.png",
    image: "/images/who_are_we_mild.jpg",
    bgTint: "rgba(255, 240, 245, 0.7)"
  },
  {
    title: "Genki Drugstore",
    slug: "genki-drugstore",
    desc: "Япон гар ахуй, хүнс, эрүүл мэндийн бүтээгдэхүүний сүлжээ",
    logoUrl: "/genki.png",
    image: "/images/who_are_we_genki.jpg",
    bgTint: "rgba(232, 244, 248, 0.7)"
  },
  {
    title: "OEO",
    slug: "oeo",
    desc: "Гар урлал, бүтээлч хоббиг дэмжигч төрөлжсөн дэлгүүр",
    logoUrl: "/oo.png",
    image: "/images/who_are_we_oeo.jpg",
    bgTint: "rgba(244, 244, 246, 0.7)"
  }
];

const defaultDistributionBusinesses = [
  {
    title: "TON 618",
    slug: "ton",
    desc: "Олон улсын хүнс, өргөн хэрэглээний барааны дистрибьюшн сүлжээ",
    logoUrl: "/Ton.png",
    image: "/images/who_are_we_ton618.jpg",
    bgTint: "rgba(240, 244, 248, 0.7)"
  },
  {
    title: "Ikigai",
    slug: "ikigai",
    desc: "Сургалт, хүний хөгжил, байгууллагын хөгжлийн төв",
    logoUrl: "/ikigai.png",
    image: "/images/subsidiary_care.png",
    bgTint: "rgba(244, 248, 240, 0.7)"
  }
];

export default function BusinessTabsBlock({ data }: BusinessTabsBlockProps) {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [canonicalTabsData, setCanonicalTabsData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Touch and Drag State for Swiper
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Detect Mobile Viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset Swiper index on Tab change
  useEffect(() => {
    setCurrentIndex(0);
    setDragOffset(0);
  }, [activeTabIndex]);

  useEffect(() => {
    const hasFullTabs = Array.isArray(data?.tabs) && data.tabs.length > 1 && data.tabs.some((t: any) => Array.isArray(t.brands) && t.brands.length > 0);
    if (!hasFullTabs) {
      import('@/lib/api').then(({ fetchStrapiAPI }) => {
        fetchStrapiAPI<any>('/home', {
          'populate[blocks][on][components.tabs-section][populate][tabs][populate][brands][populate]': '*'
        }).then(res => {
          const homeBlocks = res?.data?.blocks || res?.data?.attributes?.blocks || [];
          const homeTabsBlock = homeBlocks.find((b: any) => b.__component === 'components.tabs-section');
          if (homeTabsBlock) {
            setCanonicalTabsData(homeTabsBlock);
          }
        });
      });
    }
  }, [data]);

  const activeData = canonicalTabsData || data;
  const title = activeData?.mainTitle || activeData?.title || 'АМУУЛАЙ ГРУПП';

  // Section level background image from Strapi
  const sectionBgObj = activeData?.backgroundImage || activeData?.bgImage || activeData?.background;
  const sectionBgUrl = typeof sectionBgObj === 'string' ? sectionBgObj : (sectionBgObj?.url || sectionBgObj?.data?.attributes?.url);
  const fullSectionBg = sectionBgUrl ? getStrapiMedia(sectionBgUrl) : null;

  // Strapi tabs array
  const strapiTabs = Array.isArray(activeData?.tabs) ? activeData.tabs : [];

  const tab1Label = strapiTabs[0]?.tabTitle || 'Consumer Businesses';
  const tab2Label = strapiTabs[1]?.tabTitle || 'Distribution & Services';

  // Determine items to display
  let currentBrands: any[] = [];
  if (activeTabIndex === 0) {
    const rawTab1 = strapiTabs[0]?.brands;
    currentBrands = Array.isArray(rawTab1) && rawTab1.length > 0 ? rawTab1 : defaultConsumerBusinesses;
  } else {
    const rawTab2 = strapiTabs[1]?.brands;
    currentBrands = Array.isArray(rawTab2) && rawTab2.length > 0 ? rawTab2 : defaultDistributionBusinesses;
  }

  // Calculate slidesPerView & maxIndex
  // Desktop: 3 full + 15% peeking (3.15 slidesPerView) if count > 3, else 3 full cards
  // Mobile: 1 full + 18% peeking (1.18 slidesPerView)
  const isOverflow = isMobile ? currentBrands.length > 1 : currentBrands.length > 3;
  const slidesPerView = isMobile ? 1.18 : (isOverflow ? 3.18 : 3);
  const maxIndex = Math.max(0, currentBrands.length - Math.floor(isMobile ? 1 : 3));

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Drag & Touch Event Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isOverflow) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !isOverflow) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isOverflow) return;
    setIsDragging(false);
    
    // Threshold to trigger slide change
    if (dragOffset < -50 && currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > 50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    setDragOffset(0);
  };

  return (
    <section 
      className="section" 
      id="businesses" 
      style={{ 
        padding: '100px 0 120px', 
        background: fullSectionBg 
          ? `linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.94)), url(${fullSectionBg}) center/cover no-repeat` 
          : 'linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(/pattern2.png) repeat',
        backgroundSize: fullSectionBg ? 'cover' : 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {/* Title & Tab Switcher */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#00738a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            {title}
          </h2>
          <div style={{ width: '45px', height: '3px', background: '#0099b8', margin: '0 auto', borderRadius: '2px' }} />

          {/* Pill Tab Switcher */}
          <div 
            style={{ 
              display: 'inline-flex', 
              background: 'rgba(238, 244, 248, 0.95)', 
              backdropFilter: 'blur(8px)',
              padding: '6px', 
              borderRadius: '40px', 
              marginTop: '30px',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
            }}
          >
            <button
              onClick={() => setActiveTabIndex(0)}
              style={{
                padding: '12px 28px',
                borderRadius: '30px',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: activeTabIndex === 0 ? '#00829d' : 'transparent',
                color: activeTabIndex === 0 ? '#ffffff' : '#475569',
                boxShadow: activeTabIndex === 0 ? '0 4px 14px rgba(0, 130, 157, 0.35)' : 'none',
              }}
            >
              {tab1Label}
            </button>
            <button
              onClick={() => setActiveTabIndex(1)}
              style={{
                padding: '12px 28px',
                borderRadius: '30px',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: activeTabIndex === 1 ? '#00829d' : 'transparent',
                color: activeTabIndex === 1 ? '#ffffff' : '#475569',
                boxShadow: activeTabIndex === 1 ? '0 4px 14px rgba(0, 130, 157, 0.35)' : 'none',
              }}
            >
              {tab2Label}
            </button>
          </div>
        </div>

        {/* SWIPER CONTAINER WITH NAVIGATION ARROWS */}
        <div style={{ position: 'relative', width: '100%' }}>
          
          {/* Swiper Cards Track */}
          <div 
            ref={containerRef}
            style={{ 
              overflow: 'hidden', 
              width: '100%',
              cursor: isOverflow ? (isDragging ? 'grabbing' : 'grab') : 'default',
              userSelect: 'none',
              padding: '10px 0 20px'
            }}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              style={{ 
                display: 'flex', 
                gap: '24px', 
                transform: `translateX(calc(-${currentIndex * (100 / slidesPerView)}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                willChange: 'transform'
              }}
            >
              {currentBrands.map((brand: any, idx: number) => {
                // Logo overlay path
                const rawLogo = brand.logo?.url || brand.logo?.data?.attributes?.url || brand.logoUrl || brand.logo;
                const logoPath = typeof rawLogo === 'string'
                  ? (rawLogo.startsWith('/') && !rawLogo.startsWith('/uploads') ? rawLogo : getStrapiMedia(rawLogo))
                  : (rawLogo ? getStrapiMedia(rawLogo) : null);

                // Cover background image
                const rawImageObj = brand.backgroundImage || brand.bgImage || brand.coverImage || brand.image || brand.photo || brand.picture;
                const rawImage = typeof rawImageObj === 'string' ? rawImageObj : (rawImageObj?.url || rawImageObj?.data?.attributes?.url);
                const displayImage = rawImage
                  ? (rawImage.startsWith('/') && !rawImage.startsWith('/uploads') ? rawImage : getStrapiMedia(rawImage))
                  : null;

                const slug = brand.slug || brand.title?.toLowerCase().replace(/\s+/g, '-') || 'business';

                // Responsive slide flex-basis: 
                // Desktop 3.18 slides (3 full + 18% peeking 4th card), or 3 full if count <= 3
                // Mobile 1.18 slides (1 full + 18% peeking 2nd card)
                const cardFlexWidth = isMobile
                  ? 'calc((100% - 24px) / 1.18)'
                  : (isOverflow ? 'calc((100% - 24px * 2) / 3.18)' : 'calc((100% - 24px * 2) / 3)');

                return (
                  <div 
                    key={brand.id || idx} 
                    className="branch-card group"
                    style={{
                      flex: `0 0 ${cardFlexWidth}`,
                      minWidth: isMobile ? '280px' : '300px',
                      background: '#ffffff',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '460px', // Uniform height
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    {/* Cover Image Header */}
                    <div 
                      style={{ 
                        height: '210px',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {displayImage ? (
                        <>
                          <Image
                            src={displayImage}
                            alt={brand.title || 'Brand'}
                            fill
                            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 30vw"
                            style={{ objectFit: "cover" }}
                            className="transition-transform duration-500 group-hover:scale-105"
                          />
                          <div 
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.25) 0%, transparent 60%)'
                            }}
                          />
                        </>
                      ) : (
                        /* NO PICTURE PLACEHOLDER */
                        <div 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: '#94a3b8',
                            gap: '6px',
                            userSelect: 'none'
                          }}
                        >
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                          <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'lowercase' }}>
                            no picture
                          </span>
                        </div>
                      )}

                      {/* Glassmorphism Logo Badge overlay */}
                      {logoPath && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '14px',
                            right: '14px',
                            background: 'rgba(255, 255, 255, 0.94)',
                            backdropFilter: 'blur(8px)',
                            padding: '6px 14px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            maxHeight: '42px',
                            zIndex: 10
                          }}
                        >
                          <Image
                            src={logoPath}
                            alt={`${brand.title} logo`}
                            width={80}
                            height={30}
                            style={{ objectFit: 'contain', maxHeight: '26px', width: 'auto' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                          {brand.title}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '13.5px', lineHeight: '1.55', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {brand.description || brand.desc}
                        </p>
                      </div>
                      
                      <Link 
                        href={`/businesses/${slug}`} 
                        style={{
                          color: '#00829d',
                          fontSize: '13px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '16px'
                        }}
                      >
                        ДЭЛГЭРЭНГҮЙ <span style={{ fontSize: '15px' }}>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NAVIGATION ARROWS & PAGINATION DOTS (Primary Color #00829d) */}
          {isOverflow && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '25px' }}>
              {/* Left Arrow Button */}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Previous Slide"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentIndex === 0 ? 'rgba(0, 130, 157, 0.15)' : '#00829d',
                  color: currentIndex === 0 ? '#94a3b8' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: currentIndex === 0 ? 'none' : '0 4px 14px rgba(0, 130, 157, 0.35)',
                }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Pagination Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    style={{
                      width: currentIndex === dotIdx ? '28px' : '9px',
                      height: '9px',
                      borderRadius: '10px',
                      border: 'none',
                      background: currentIndex === dotIdx ? '#00829d' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                aria-label="Next Slide"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentIndex >= maxIndex ? 'rgba(0, 130, 157, 0.15)' : '#00829d',
                  color: currentIndex >= maxIndex ? '#94a3b8' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentIndex >= maxIndex ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: currentIndex >= maxIndex ? 'none' : '0 4px 14px rgba(0, 130, 157, 0.35)',
                }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
