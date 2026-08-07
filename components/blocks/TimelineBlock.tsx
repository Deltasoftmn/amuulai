'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getStrapiMedia, parseStrapiText } from '@/lib/api';

interface TimelineItem {
  year: string;
  subText?: string;
  title: string;
  desc: string;
  image: string;
  logo?: string;
}

interface TimelineBlockProps {
  data?: any;
}

export default function TimelineBlock({ data }: TimelineBlockProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const title = parseStrapiText(data?.title || data?.heading) || 'Бидний түүхэн замнал';

  // Default timeline milestones matching reference design
  const defaultItems: TimelineItem[] = [
    {
      year: '1999',
      title: 'Компанийн гараа',
      desc: '1999 оноос эхлэн бид дэлхийн нэр хүндтэй брэндүүдийг Монголын зах зээлд албан ёсоор оруулж ирэн хэрэглэгчиддээ чанартай бүтээгдэхүүн, үйлчилгээг санал болгож эхэлсэн.',
      image: '/images/who_are_we_main.jpg',
      logo: '/logo.png'
    },
    {
      year: '2008',
      title: 'Mild Cosmetics дэлгүүрийн нээлт',
      desc: 'Мэдлэг, гоо сайхны ертөнцийг Монголд нэвтрүүлэх зорилгоор Японы шилдэг арьс арчилгааны дэлгүүрийн сүлжээ Mild Cosmetics-ийг нээв.',
      image: '/images/who_are_we_mild.jpg',
      logo: '/mild.png'
    },
    {
      year: '2014',
      title: 'Genki эрүүл мэндийн сүлжээ',
      desc: 'Эрүүл мэнд, эм бэлдмэл, өргөн хэрэглээний бараа бүтээгдэхүүнийг нэг дороос санал болгох Genki дэлгүүрийн сүлжээг амжилттай хөгжүүлэв.',
      image: '/images/who_are_we_genki.jpg',
      logo: '/genki.png'
    },
    {
      year: '2018',
      title: 'OEO Craft & Hobby',
      desc: 'Бүтээлч хобби, канцеляр болон амьдралын хэв маягийг дэмжих OEO төрөлжсөн дэлгүүрийн анхны салбарыг нээж хэрэглэгчдийн итгэлийг хүлээв.',
      image: '/images/who_are_we_oeo.jpg',
      logo: '/oo.png'
    },
    {
      year: '2021',
      title: 'Олон улсын дистрибьюшн',
      desc: 'Олон улсын шилдэг үйлдвэрлэгчидтэй түншлэлээ улам өргөжүүлэн, 21 аймгийн сүлжээ дэлгүүрүүдэд шууд дистрибьюц хийх логистикийн төвийг ашиглалтад орууллаа.',
      image: '/images/who_are_we_ton618.jpg',
      logo: '/Ton.png'
    },
    {
      year: '2026',
      title: 'Бид өнөөдөр',
      desc: '62 салбар дэлгүүр, 7,400+ нэр төрлийн бүтээгдэхүүн, 50+ олон улсын брэндийг Монгол орон даяар амжилттай борлуулан ажиллаж байна.',
      image: '/images/who_are_we_main.jpg',
      logo: '/logo.png'
    }
  ];

  // Strapi dynamic events parsing
  const rawItems = Array.isArray(data?.events) 
    ? data.events 
    : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.timeline) ? data.timeline : []));
  
  const items: TimelineItem[] = rawItems.length > 0 
    ? rawItems.map((item: any, idx: number) => {
        const rawImg = typeof item.image === 'string' 
          ? item.image 
          : (item.image?.url || item.image?.data?.attributes?.url);
        
        const rawLogo = typeof item.logo === 'string'
          ? item.logo
          : (item.logo?.url || item.logo?.data?.attributes?.url);

        return {
          year: parseStrapiText(item.year) || defaultItems[idx % defaultItems.length].year,
          title: parseStrapiText(item.title || item.heading) || defaultItems[idx % defaultItems.length].title,
          desc: parseStrapiText(item.description || item.desc || item.text) || defaultItems[idx % defaultItems.length].desc,
          image: rawImg ? getStrapiMedia(rawImg) : defaultItems[idx % defaultItems.length].image,
          logo: rawLogo ? getStrapiMedia(rawLogo) : defaultItems[idx % defaultItems.length].logo
        };
      })
    : defaultItems;

  const activeStory = items[activeIndex] || items[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  // Touch handlers for Mobile Swipe
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
        <div style={{ textAlign: 'left', marginBottom: '50px' }}>
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

        {/* TOP TIMELINE YEARS BAR (ANUNGOO STYLE) */}
        <div style={{ position: 'relative', marginBottom: '60px', padding: '0 20px' }}>
          
          {/* HORIZONTAL DASHED/DOTTED CONNECTOR LINE */}
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

          {/* YEARS ROW */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              position: 'relative', 
              zIndex: 2 
            }}
          >
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;

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
                  {/* Year Text */}
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

                  {/* Dot Marker */}
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

        {/* BOTTOM ACTIVE STORY CONTENT (SPLIT VIEW) */}
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
          {/* LEFT COLUMN: LOGO + DESCRIPTION TEXT + NAV ARROWS */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            {/* Logo / Badge */}
            {activeStory.logo && (
              <div style={{ marginBottom: '24px', position: 'relative', width: '120px', height: '45px' }}>
                <Image 
                  src={activeStory.logo} 
                  alt={activeStory.title} 
                  fill 
                  style={{ objectFit: 'contain', objectPosition: 'left' }} 
                />
              </div>
            )}

            {/* Active Year Title */}
            <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', lineHeight: '1.3' }}>
              {activeStory.title}
            </h3>

            {/* Active Year Story Description */}
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.8', marginBottom: '35px', maxWidth: '520px' }}>
              {activeStory.desc}
            </p>

            {/* LEFT & RIGHT NAVIGATION ARROWS */}
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
          </div>

          {/* RIGHT COLUMN: LARGE ROUNDED MILESTONE PHOTO */}
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
                alt={activeStory.title} 
                fill 
                style={{ objectFit: 'cover' }} 
                sizes="(max-width: 1024px) 100vw, 50vw" 
                className="transition-all duration-700 ease-out"
                priority
              />
            </div>
          </div>

        </div>

      </div>

      {/* MOBILE RESPONSIVE MEDIA QUERIES */}
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

