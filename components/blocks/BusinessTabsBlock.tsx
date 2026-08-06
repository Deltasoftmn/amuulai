'use client';

import React, { useState } from 'react';
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

function getBrandFallbackLogo(titleStr?: string): string {
  const t = (titleStr || '').toLowerCase();
  if (t.includes('mild')) return '/mild.png';
  if (t.includes('genki')) return '/genki.png';
  if (t.includes('oeo') || t.includes('oo')) return '/oo.png';
  if (t.includes('ton')) return '/Ton.png';
  if (t.includes('ikigai')) return '/ikigai.png';
  if (t.includes('amuulai')) return '/logo.png';
  return '/logo.png';
}

function getBrandFallbackImage(titleStr?: string): string {
  const t = (titleStr || '').toLowerCase();
  if (t.includes('mild')) return '/images/who_are_we_mild.jpg';
  if (t.includes('genki')) return '/images/who_are_we_genki.jpg';
  if (t.includes('oeo') || t.includes('oo')) return '/images/who_are_we_oeo.jpg';
  if (t.includes('ton')) return '/images/who_are_we_ton618.jpg';
  if (t.includes('ikigai')) return '/images/subsidiary_care.png';
  return '/images/who_are_we_main.jpg';
}

export default function BusinessTabsBlock({ data }: BusinessTabsBlockProps) {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [canonicalTabsData, setCanonicalTabsData] = useState<any>(null);

  React.useEffect(() => {
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
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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

        {/* 3-Column Business Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
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

            return (
              <div 
                key={brand.id || idx} 
                className="branch-card group"
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                {/* Full-bleed Cover Image Header */}
                <div 
                  style={{ 
                    height: '210px',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {displayImage ? (
                    <>
                      <Image
                        src={displayImage}
                        alt={brand.title || 'Brand'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Subtle dark gradient overlay at bottom for smooth contrast */}
                      <div 
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.25) 0%, transparent 60%)'
                        }}
                      />
                    </>
                  ) : (
                    /* NO PICTURE PLACEHOLDER WHEN NO IMAGE IS UPLOADED */
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
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                    {brand.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', flexGrow: 1 }}>
                    {brand.description || brand.desc}
                  </p>
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
                      gap: '6px'
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
    </section>
  );
}
