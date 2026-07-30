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
    bgTint: "rgba(255, 240, 245, 0.7)"
  },
  {
    title: "Genki Drugstore",
    slug: "genki-drugstore",
    desc: "Япон гар ахуй, хүнс, эрүүл мэндийн бүтээгдэхүүний сүлжээ",
    logoUrl: "/genki.png",
    bgTint: "rgba(232, 244, 248, 0.7)"
  },
  {
    title: "OEO",
    slug: "oeo",
    desc: "Гар урлал, бүтээлч хоббиг дэмжигч төрөлжсөн дэлгүүр",
    logoUrl: "/oo.png",
    bgTint: "rgba(244, 244, 246, 0.7)"
  }
];

const defaultDistributionBusinesses = [
  {
    title: "TON 618",
    slug: "ton",
    desc: "Олон улсын хүнс, өргөн хэрэглээний барааны дистрибьюшн сүлжээ",
    logoUrl: "/Ton.png",
    bgTint: "rgba(240, 244, 248, 0.7)"
  },
  {
    title: "Ikigai",
    slug: "ikigai",
    desc: "Сургалт, хүний хөгжил, байгууллагын хөгжлийн төв",
    logoUrl: "/ikigai.png",
    bgTint: "rgba(244, 248, 240, 0.7)"
  }
];

export default function BusinessTabsBlock({ data }: BusinessTabsBlockProps) {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const title = data?.mainTitle || data?.title || 'АМУУЛАЙ ГРУПП';

  // Strapi tabs array
  const strapiTabs = Array.isArray(data?.tabs) ? data.tabs : [];

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
        background: 'linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(/pattern2.png) repeat',
        backgroundSize: 'auto',
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
            const logoUrl = brand.logoUrl || brand.logo?.url || brand.logo?.data?.attributes?.url;
            const fullLogoPath = logoUrl 
              ? (logoUrl.startsWith('/') && !logoUrl.startsWith('/uploads') ? logoUrl : getStrapiMedia(logoUrl))
              : '/mild.png';
            const slug = brand.slug || brand.title?.toLowerCase().replace(/\s+/g, '-') || 'business';

            return (
              <div 
                key={brand.id || idx} 
                className="branch-card"
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
                {/* Patterned/Tinted Header */}
                <div 
                  style={{ 
                    height: '190px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    position: 'relative',
                    background: `linear-gradient(rgba(240, 248, 250, 0.78), rgba(240, 248, 250, 0.78)), url('/pattern2.png') center/cover no-repeat`,
                    backgroundColor: brand.bgTint || '#f0f8fa',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <Image
                    src={fullLogoPath}
                    alt={brand.title || 'Brand'}
                    width={180}
                    height={80}
                    style={{ objectFit: "contain", maxHeight: "80px", maxWidth: "85%" }}
                  />
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
