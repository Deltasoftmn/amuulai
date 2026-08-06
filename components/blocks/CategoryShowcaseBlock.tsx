'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/lib/api';

interface CategoryShowcaseBlockProps {
  data?: any;
  index?: number;
}

const cardBgColors = [
  '#0047b3', // 1st: Deep Blue
  '#a21daf', // 2nd: Magenta / Purple
  '#059669', // 3rd: Vibrant Green
  '#0284c7', // 4th: Cyan / Teal
  '#d97706', // 5th: Amber / Orange
];

const defaultLogos = [
  { name: 'Vilo', url: '/images/vilo_logo.png' },
  { name: 'SMART', url: '/images/smart_logo.png' },
  { name: 'Tide', url: '/images/tide_logo.png' },
  { name: 'ARIEL', url: '/images/ariel_logo.png' },
  { name: 'Safeguard', url: '/images/safeguard_logo.png' },
  { name: 'FAIRY', url: '/images/fairy_logo.png' },
  { name: 'Flamingo', url: '/images/flamingo_logo.png' },
];

export default function CategoryShowcaseBlock({ data, index = 0 }: CategoryShowcaseBlockProps) {
  const title = data?.title || data?.categoryName || 'Ахуйн бараа';
  const description = data?.description || data?.excerpt || 'Анунгоо ХХК нь 1999 оноос хойш Монгол Улсын худалдааны зах зээлд амжилттай үйл ажиллагаа явуулж, хэрэглэгчид болон харилцагчдынхаа итгэлийг тууштайгаар хүлээн ирсэн билээ.';
  const buttonText = data?.buttonText || 'Дэлгэрэнгүй';
  const buttonUrl = data?.buttonUrl || data?.link || '#';

  // Determine alternating side (Even index = Image Left, Odd index = Image Right)
  const isImageLeft = index % 2 === 1;

  // Determine card background color
  const bgColor = data?.bgColor || cardBgColors[index % cardBgColors.length];

  // Extract showcase image from Strapi
  const rawShowcaseImg = data?.featuredImage?.url || data?.featuredImage?.data?.attributes?.url || data?.heroImage?.url || data?.image?.url || data?.coverImage?.url || data?.showcaseImage?.url;
  const showcaseImg = rawShowcaseImg ? getStrapiMedia(rawShowcaseImg) : '/images/mild_shelf_1783644620504.png';

  // Extract logos from Strapi (nested brands relation or featuredLogos)
  const rawBrands = data?.brands || data?.featuredLogos || data?.logos || [];
  let brandLogos: any[] = [];
  if (Array.isArray(rawBrands) && rawBrands.length > 0) {
    rawBrands.forEach((b: any) => {
      const bTitle = b.title || b.name || '';
      if (Array.isArray(b.featuredLogos) && b.featuredLogos.length > 0) {
        b.featuredLogos.forEach((logoObj: any) => {
          const lUrl = typeof logoObj === 'string' ? logoObj : (logoObj?.url || logoObj?.attributes?.url);
          if (lUrl) {
            brandLogos.push({
              name: bTitle || 'Brand',
              url: getStrapiMedia(lUrl)
            });
          }
        });
      } else {
        const logoUrl = b.logo?.url || b.featuredLogos?.url || b.url || b.image?.url || b.logoUrl;
        if (logoUrl) {
          brandLogos.push({
            name: bTitle || 'Brand',
            url: getStrapiMedia(logoUrl)
          });
        } else if (bTitle) {
          brandLogos.push({
            name: bTitle,
            url: null
          });
        }
      }
    });
  }

  const [enrichedLogos, setEnrichedLogos] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (Array.isArray(rawBrands) && rawBrands.length > 0) {
      const needsLogos = rawBrands.some((b: any) => !b.featuredLogos || b.featuredLogos.length === 0);
      if (needsLogos) {
        import('@/lib/api').then(({ getBrands, getStrapiMedia }) => {
          getBrands().then((allBrands: any[]) => {
            const resultLogos: any[] = [];
            rawBrands.forEach((b: any) => {
              const bSlug = (b.slug || b.title || b.name || '').toLowerCase();
              const matched = allBrands.find((fb: any) => 
                (fb.slug && fb.slug.toLowerCase() === bSlug) || 
                (fb.title && fb.title.toLowerCase() === bSlug) ||
                fb.id === b.id
              );
              const bTitle = matched?.title || b.title || b.name || '';
              const fLogos = matched?.featuredLogos || b.featuredLogos || [];
              if (Array.isArray(fLogos) && fLogos.length > 0) {
                fLogos.forEach((logoObj: any) => {
                  const lUrl = typeof logoObj === 'string' ? logoObj : (logoObj?.url || logoObj?.attributes?.url);
                  if (lUrl) {
                    resultLogos.push({
                      name: bTitle || 'Brand',
                      url: getStrapiMedia(lUrl)
                    });
                  }
                });
              } else if (bTitle) {
                resultLogos.push({ name: bTitle, url: null });
              }
            });
            if (resultLogos.length > 0) {
              setEnrichedLogos(resultLogos);
            }
          });
        });
      }
    }
  }, [data]);

  const activeLogos = enrichedLogos.length > 0 ? enrichedLogos : brandLogos;

  return (
    <section className="section" style={{ padding: '80px 0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
            gap: '60px', 
            alignItems: 'center' 
          }}
        >
          
          {/* TEXT CONTENT COLUMN */}
          <div 
            className={isImageLeft ? 'animate-fade-in-right' : 'animate-fade-in-left'}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              order: isImageLeft ? 2 : 1
            }}
          >
            {/* Title */}
            <h2 
              style={{ 
                fontSize: '36px', 
                fontWeight: '800', 
                color: '#111827', 
                lineHeight: '1.2', 
                marginBottom: '20px' 
              }}
            >
              {title}
            </h2>

            {/* Description */}
            <p 
              style={{ 
                fontSize: '15px', 
                lineHeight: '1.75', 
                color: '#4b5563', 
                marginBottom: '30px', 
                maxWidth: '560px' 
              }}
            >
              {description}
            </p>

            {/* Pill Button matching Section Brand Theme Color */}
            <Link 
              href={buttonUrl}
              style={{ 
                backgroundColor: bgColor, 
                color: '#ffffff', 
                padding: '10px 30px', 
                borderRadius: '30px', 
                fontSize: '14px', 
                fontWeight: '600', 
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '45px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
              }}
              className="hover:opacity-90 hover:scale-105"
            >
              {buttonText}
            </Link>

            {/* Horizontal Brand Logos Row */}
            {activeLogos.length > 0 && (
              <div 
                style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  alignItems: 'center', 
                  gap: '24px', 
                  paddingTop: '20px', 
                  borderTop: '1px solid #f3f4f6', 
                  width: '100%' 
                }}
              >
                {activeLogos.map((brand: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', minHeight: '36px' }}>
                    {brand.url ? (
                      <img 
                        src={brand.url} 
                        alt={brand.name} 
                        style={{ maxHeight: '38px', maxWidth: '100px', objectFit: 'contain', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }} 
                        className="hover:scale-[1.12]"
                        onError={(e: any) => {
                          e.currentTarget.style.display = 'none';
                          const nextEl = e.currentTarget.nextElementSibling;
                          if (nextEl) nextEl.style.display = 'inline-block';
                        }}
                      />
                    ) : null}
                    <span 
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        color: '#4b5563', 
                        display: brand.url ? 'none' : 'inline-block',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                        cursor: 'pointer' 
                      }}
                      className="hover:scale-[1.08] hover:text-[#00829d]"
                    >
                      {brand.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* SHOWCASE HERO IMAGE CARD COLUMN (Alternates Left / Right with Zoom-In Effect) */}
          <div 
            className={`group cursor-pointer ${isImageLeft ? 'animate-fade-in-left' : 'animate-fade-in-right'}`}
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '460px', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              backgroundColor: bgColor,
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 65%)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
              order: isImageLeft ? 1 : 2
            }}
          >
            {/* Background Dotted Radial Rings Effect */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '-60px', 
                right: '-60px', 
                width: '320px', 
                height: '320px', 
                borderRadius: '50%', 
                border: '28px radial rgba(255, 255, 255, 0.12)',
                pointerEvents: 'none' 
              }} 
            />

            <Image
              src={showcaseImg}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 ease-out group-hover:scale-105"
              priority
            />
          </div>

        </div>

      </div>
    </section>
  );
}
