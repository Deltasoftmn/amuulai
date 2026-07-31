'use client';

import React from 'react';
import Image from 'next/image';
import { getStrapiMedia, parseStrapiText } from '@/lib/api';

interface VisionMissionCard {
  subtitle: string;
  title: string;
  desc: string;
  icon?: string;
  image?: string;
}

interface VisionMissionBlockProps {
  data?: any;
}

export default function VisionMissionBlock({ data }: VisionMissionBlockProps) {
  // Default Vision & Mission cards matching the design screenshot
  const defaultCards: VisionMissionCard[] = [
    {
      subtitle: 'VISION',
      title: 'Алсын хараа',
      desc: 'Монголын хэрэглэгчдэд дэлхийн шилдэг брэнд, бүтээгдэхүүн, үйлчилгээг тогтвортой хүргэдэг тэргүүлэгч групп компани байх.',
      icon: 'mountain',
      image: '/images/vision_earth.jpg'
    },
    {
      subtitle: 'MISSION',
      title: 'Эрхэм зорилго',
      desc: 'Дэлхийн үйлдвэрлэгчид, харилцагчид болон хэрэглэгчдийг холбосон найдвартай түнш байж, чанартай бүтээгдэхүүн, үнэ цэнтэй үйлчилгээгээр илүү сайн амьдралын хэв маягийг түгээнэ.',
      icon: 'target',
      image: '/images/who_are_we_main.jpg'
    }
  ];

  // Parse Strapi cards if present
  const rawCards = Array.isArray(data?.cards) 
    ? data.cards 
    : (Array.isArray(data?.values) ? data.values : (Array.isArray(data?.items) ? data.items : []));

  const cards: VisionMissionCard[] = rawCards.length > 0
    ? rawCards.map((card: any, idx: number) => {
        const descStr = parseStrapiText(card.description || card.desc);

        const rawImg = typeof card.backgroundImage === 'string'
          ? card.backgroundImage
          : (card.backgroundImage?.url || card.backgroundImage?.data?.attributes?.url || card.image?.url || card.image?.data?.attributes?.url || card.image);

        const rawIcon = typeof card.icon === 'string'
          ? card.icon
          : (card.icon?.url || card.icon?.data?.attributes?.url);

        return {
          subtitle: parseStrapiText(card.subtitle || card.badgeText) || (idx === 0 ? 'VISION' : 'MISSION'),
          title: parseStrapiText(card.title || card.heading) || defaultCards[idx % defaultCards.length].title,
          desc: descStr || defaultCards[idx % defaultCards.length].desc,
          icon: rawIcon ? getStrapiMedia(rawIcon) : defaultCards[idx % defaultCards.length].icon,
          image: rawImg ? getStrapiMedia(rawImg) : defaultCards[idx % defaultCards.length].image
        };
      })
    : defaultCards;

  const renderCardIcon = (iconVal?: string, idx?: number) => {
    if (iconVal && (iconVal.startsWith('http://') || iconVal.startsWith('https://') || iconVal.startsWith('/'))) {
      return (
        <div style={{ position: 'relative', width: '30px', height: '30px' }}>
          <Image src={iconVal} alt="icon" fill style={{ objectFit: 'contain' }} />
        </div>
      );
    }
    if (iconVal === 'mountain' || idx === 0) {
      // Mountain with flag icon for Vision
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
          <path d="M4.14 15.08 7.5 9l2.7 4.5" />
          <path d="M12 3v3" />
        </svg>
      );
    }
    // Target bullseye icon for Mission
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  };

  return (
    <section 
      className="vision-mission-section"
      style={{ 
        padding: '90px 0', 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* CARDS GRID */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${Math.min(cards.length, 2)}, 1fr)`, 
            gap: '30px' 
          }}
          className="fade-in-up"
        >
          {cards.map((card, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'linear-gradient(180deg, #091a32 0%, #051020 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '490px',
                paddingTop: '40px',
                textAlign: 'center',
                position: 'relative'
              }}
              className="group hover:border-blue-500/30 transition-all duration-300"
            >
              {/* CARD TOP CONTENT */}
              <div style={{ padding: '0 32px', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* ICON BADGE */}
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    background: 'radial-gradient(circle, rgba(14, 116, 244, 0.25) 0%, rgba(6, 30, 60, 0.8) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    boxShadow: '0 0 20px rgba(2, 132, 199, 0.2)'
                  }}
                >
                  {renderCardIcon(card.icon, idx)}
                </div>

                {/* SUBTITLE / BADGE */}
                <span 
                  style={{ 
                    color: '#0284c7', 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    letterSpacing: '0.12em', 
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}
                >
                  {card.subtitle}
                </span>

                {/* TITLE */}
                <h3 
                  style={{ 
                    fontSize: '32px', 
                    fontWeight: '800', 
                    color: '#ffffff', 
                    margin: '0 0 12px 0',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {card.title}
                </h3>

                {/* ACCENT LINE */}
                <div 
                  style={{ 
                    width: '36px', 
                    height: '3px', 
                    backgroundColor: '#0284c7', 
                    borderRadius: '2px', 
                    marginBottom: '20px' 
                  }} 
                />

                {/* DESCRIPTION */}
                <p 
                  style={{ 
                    fontSize: '15px', 
                    color: 'rgba(255, 255, 255, 0.85)', 
                    lineHeight: '1.75', 
                    maxWidth: '450px',
                    margin: '0 0 30px 0',
                    fontWeight: '400'
                  }}
                >
                  {card.desc}
                </p>

              </div>

              {/* BOTTOM BACKGROUND IMAGE CONTAINER */}
              {card.image && (
                <div 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '195px', 
                    marginTop: 'auto',
                    overflow: 'hidden'
                  }}
                >
                  <Image 
                    src={card.image}
                    alt={card.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Top gradient overlay for seamless dark fade */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'linear-gradient(to bottom, #051020 0%, rgba(5, 16, 32, 0.3) 40%, transparent 100%)' 
                    }} 
                  />
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

      {/* RESPONSIVE STYLING */}
      <style jsx>{`
        @media (max-width: 768px) {
          .vision-mission-section .container > div {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
