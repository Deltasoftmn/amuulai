'use client';

import React from 'react';
import Image from 'next/image';
import { getStrapiMedia, parseStrapiText } from '@/lib/api';

interface TimelineItem {
  year: string;
  subText?: string;
  title: string;
  desc: string;
  image: string;
  icon?: string;
}

interface TimelineBlockProps {
  data?: any;
}

export default function TimelineBlock({ data }: TimelineBlockProps) {
  const badgeText = parseStrapiText(data?.badgeText || data?.subtitle) || 'БИДНИЙ ТҮҮХ';
  const title = parseStrapiText(data?.title || data?.heading) || 'Бидний түүх';
  const description = parseStrapiText(data?.description || data?.text) || 
    '2003 оноос эхлэн бид тасралтгүй өсөж, хөгжиж, шинэ боломжуудыг бүтээж ирсэн. Өнөөдөр бид Монголын хэрэглэгчдэд дэлхийн шилдэг брэндүүдийг хүргэдэг үндэсний тэргүүлэгч групп компани.';

  // Default timeline milestones matching design image
  const defaultItems: TimelineItem[] = [
    {
      year: '2003',
      subText: '',
      title: 'Анхны алхам',
      desc: 'Амуулай ХХК үүсгэн байгуулагдаж, гадаадын чанартай бараа бүтээгдэхүүнийг Монголын зах зээлд импортолж эхлэв.',
      image: '/images/timeline_2003.jpg',
      icon: 'globe'
    },
    {
      year: '2008',
      subText: '',
      title: 'Mild Cosmetics',
      desc: 'Мэдлэг, гоо сайхны ертөнцийг Монголд нэвтрүүлэх зорилгоор Mild Cosmetics дэлгүүрийг нээв.',
      image: '/images/who_are_we_mild.jpg',
      icon: 'bag'
    },
    {
      year: '2014',
      subText: '',
      title: 'Genki',
      desc: 'Эрүүл мэнд, эм бэлдмэлийн чиглэлд шинэ стандартыг тогтоохоор Genki эрүүл мэндийн дэлгүүр нээгдэв.',
      image: '/images/who_are_we_genki.jpg',
      icon: 'health'
    },
    {
      year: '2018',
      subText: '',
      title: 'OEO',
      desc: 'Бүтээлч сэтгэлгээ, чанарлаг канцеляр болон амьдралын хэв маягийн бүтээгдэхүүнээр OEO дэлгүүр нээгдэв.',
      image: '/images/who_are_we_oeo.jpg',
      icon: 'pencil'
    },
    {
      year: '2023',
      subText: '',
      title: 'TON618',
      desc: "Эрчүүдийн стиль, чанар, сонголтыг нэгтгэсэн TON618 Men's Concept Store брэндийг байгууллаа.",
      image: '/images/who_are_we_ton618.jpg',
      icon: 'shirt'
    },
    {
      year: '2026',
      subText: 'БИД ӨНӨӨДӨР',
      title: 'Үргэлжилсэн өсөлт',
      desc: '62 салбар, 7,400+ бүтээгдэхүүн, 50+ брэнд, 21 аймгийг хамарсан хүргэлтийн сүлжээтэй болов.',
      image: '/images/who_are_we_main.jpg',
      icon: 'chart'
    }
  ];

  // Strapi items parsing (events or items or timeline)
  const rawItems = Array.isArray(data?.events) 
    ? data.events 
    : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.timeline) ? data.timeline : []));
  
  const items: TimelineItem[] = rawItems.length > 0 
    ? rawItems.map((item: any, idx: number) => {
        const rawImg = typeof item.image === 'string' 
          ? item.image 
          : (item.image?.url || item.image?.data?.attributes?.url);
        
        const rawIcon = typeof item.icon === 'string'
          ? item.icon
          : (item.icon?.url || item.icon?.data?.attributes?.url);

        return {
          year: parseStrapiText(item.year) || defaultItems[idx % defaultItems.length].year,
          subText: parseStrapiText(item.subText || item.subtitle) || (idx === rawItems.length - 1 ? 'БИД ӨНӨӨДӨР' : ''),
          title: parseStrapiText(item.title || item.heading) || defaultItems[idx % defaultItems.length].title,
          desc: parseStrapiText(item.description || item.desc || item.text) || defaultItems[idx % defaultItems.length].desc,
          image: rawImg ? getStrapiMedia(rawImg) : defaultItems[idx % defaultItems.length].image,
          icon: rawIcon ? getStrapiMedia(rawIcon) : defaultItems[idx % defaultItems.length].icon
        };
      })
    : defaultItems;

  const renderIcon = (iconVal?: string) => {
    if (!iconVal) return null;
    if (iconVal.startsWith('http://') || iconVal.startsWith('https://') || iconVal.startsWith('/')) {
      return (
        <div style={{ position: 'relative', width: '22px', height: '22px' }}>
          <Image src={iconVal} alt="icon" fill style={{ objectFit: 'contain' }} />
        </div>
      );
    }
    switch (iconVal) {
      case 'globe':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case 'bag':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        );
      case 'health':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
          </svg>
        );
      case 'pencil':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        );
      case 'shirt':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          </svg>
        );
      case 'chart':
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <path d="M3 20h18" />
          </svg>
        );
    }
  };

  return (
    <section 
      className="timeline-section"
      style={{ 
        padding: '100px 0', 
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }} className="fade-in-up">
          <span 
            style={{ 
              color: '#2563eb', 
              fontSize: '14px', 
              fontWeight: '700', 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase',
              marginBottom: '10px',
              display: 'block'
            }}
          >
            {badgeText}
          </span>
          <h2 
            style={{ 
              fontSize: '44px', 
              fontWeight: '800', 
              color: '#0f172a', 
              margin: '0 0 16px 0',
              lineHeight: '1.2',
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </h2>
          {description && (
            <p 
              style={{ 
                maxWidth: '780px', 
                margin: '0 auto', 
                color: '#475569', 
                fontSize: '16px', 
                lineHeight: '1.7',
                fontWeight: '400'
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* TIMELINE VISUAL WAVE & YEARS HEADER */}
        <div style={{ position: 'relative', marginBottom: '40px', paddingTop: '30px' }} className="fade-in-up">
          
          {/* YEARS ROW */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${items.length}, 1fr)`, 
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
              marginBottom: '12px'
            }}
          >
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span 
                  style={{ 
                    fontSize: '22px', 
                    fontWeight: '800', 
                    color: '#1d4ed8',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {item.year}
                </span>
                {item.subText && (
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      color: '#475569', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginTop: '2px'
                    }}
                  >
                    {item.subText}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* CURVED TIMELINE CONNECTOR LINE (SVG) */}
          <div style={{ width: '100%', height: '50px', position: 'relative' }}>
            <svg 
              viewBox="0 0 1200 50" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', display: 'block' }}
              preserveAspectRatio="none"
            >
              {/* Main solid curved path for early years */}
              <path 
                d="M 100 22 C 300 8, 500 32, 700 18 C 800 12, 900 24, 1000 24" 
                stroke="#3b82f6" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
              
              {/* Final dashed path leading to present year with arrow */}
              <path 
                d="M 1000 24 L 1110 24" 
                stroke="#3b82f6" 
                strokeWidth="2.5" 
                strokeDasharray="6 5"
                strokeLinecap="round"
              />
              {/* Arrow Head at the end of line */}
              <path 
                d="M 1104 18 L 1114 24 L 1104 30" 
                stroke="#3b82f6" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Node Dots on the Timeline */}
              {items.map((_, i) => {
                const posX = 100 + i * (900 / Math.max(items.length - 1, 1));
                const posY = i % 2 === 0 ? 20 : 25;
                return (
                  <circle key={i} cx={posX} cy={posY} r="5" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
                );
              })}
            </svg>
          </div>
        </div>

        {/* TIMELINE CARDS GRID */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${items.length}, 1fr)`, 
            gap: '16px' 
          }}
          className="fade-in-up"
        >
          {items.map((item, idx) => (
            <div 
              key={idx}
              style={{ 
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative'
              }}
              className="hover:-translate-y-1 hover:shadow-lg group"
            >
              {/* TOP CIRCULAR ICON BADGE */}
              <div 
                style={{ 
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#061830',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(6, 24, 48, 0.3)',
                  border: '2px solid #ffffff'
                }}
              >
                {renderIcon(item.icon)}
              </div>

              {/* IMAGE CONTAINER */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '145px',
                  overflow: 'hidden'
                }}
              >
                <Image 
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 1024px) 50vw, 16vw"
                  className="transition-transform duration-500 group-hover:scale-108"
                />
              </div>

              {/* CARD CONTENT */}
              <div style={{ padding: '16px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 
                  style={{ 
                    fontSize: '15px', 
                    fontWeight: '700', 
                    color: '#0f172a', 
                    margin: '0 0 8px 0',
                    lineHeight: '1.3'
                  }}
                >
                  {item.title}
                </h3>
                <p 
                  style={{ 
                    fontSize: '12px', 
                    color: '#64748b', 
                    lineHeight: '1.55', 
                    margin: 0,
                    fontWeight: '400'
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* RESPONSIVE STYLING */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .timeline-section .container > div:last-child {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .timeline-section .container > div:last-child {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
