'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/lib/api';

interface WhoAreWeBlockProps {
  data?: any;
}

export default function WhoAreWeBlock({ data }: WhoAreWeBlockProps) {
  // Extract subtitle / badge
  const badgeText = data?.subtitle || data?.badgeText || 'БИДНИЙ ТУХАЙ';
  
  // Extract main title
  const title = data?.title || data?.heading || 'Бид хэн бэ?';

  // Extract button link & text
  const linkUrl = data?.button?.url || data?.buttonUrl || data?.link || '/about-us';
  const buttonText = data?.button?.text || data?.button?.label || data?.buttonText || 'Дэлгэрэнгүй';

  // Extract description / paragraphs
  const defaultParagraphs = [
    'Амуулай Групп нь 2003 онд үүсгэн байгуулагдсан, хэрэглээний барааны салбарт тэргүүлэгч үндэсний хэмжээний групп компани юм.',
    'Бид дэлхийн шилдэг үйлдвэрлэгчдийн чанартай бүтээгдэхүүнийг Монголын хэрэглэгчдэд албан ёсоор импортлон, дистрибьюц хийж, өргөн хүрээний жижиглэн худалдаа болон бизнесийн үйлчилгээ эрхлэн ажиллаж байна.',
    'Өнөөдөр бид Retail, Distribution болон Business Services гэсэн 3 үндсэн чиглэлээр үйл ажиллагаа явуулж, 62 салбар дэлгүүр, 7,400+ нэр төрлийн бүтээгдэхүүн, 50+ брэндийг 21 аймгийн хэрэглэгчдэд хүргэж байна.',
  ];

  let paragraphs: string[] = defaultParagraphs;
  if (Array.isArray(data?.paragraphs) && data.paragraphs.length > 0) {
    paragraphs = data.paragraphs;
  } else if (typeof data?.description === 'string' && data.description.trim().length > 15) {
    const split = data.description.split('\n').map((s: string) => s.trim()).filter(Boolean);
    if (split.length > 0) {
      paragraphs = split;
    }
  }

  // Gallery or individual image fields from Strapi
  const rawGallery = Array.isArray(data?.gallery) 
    ? data.gallery 
    : (Array.isArray(data?.gallery?.data) ? data.gallery.data : []);

  // Main banner image (try mainImage, coverImage, or gallery main image)
  const rawMainImage = typeof data?.mainImage === 'string' 
    ? data.mainImage 
    : (data?.mainImage?.url || data?.mainImage?.data?.attributes?.url || data?.coverImage?.url || data?.coverImage?.data?.attributes?.url);

  let mainImageUrl = rawMainImage ? getStrapiMedia(rawMainImage) : '';
  if (!mainImageUrl && rawGallery.length > 0) {
    // Check if any gallery image is named warehouse/main or pick first/last
    const mainMatch = rawGallery.find((g: any) => {
      const url = g?.url || g?.attributes?.url || '';
      return url.includes('main') || url.includes('warehouse') || url.includes('center');
    });
    const mainObj = mainMatch || rawGallery[rawGallery.length - 1] || rawGallery[0];
    const rawUrl = mainObj?.url || mainObj?.attributes?.url;
    if (rawUrl) {
      mainImageUrl = getStrapiMedia(rawUrl);
    }
  }
  if (!mainImageUrl) {
    mainImageUrl = '/images/who_are_we_main.jpg';
  }

  // Stores grid images (default 4 stores matching design)
  const defaultStores = [
    { name: 'MILD Cosmetics', image: '/images/who_are_we_mild.jpg' },
    { name: 'GENKI', image: '/images/who_are_we_genki.jpg' },
    { name: 'OEO Craft', image: '/images/who_are_we_oeo.jpg' },
    { name: 'TON618', image: '/images/who_are_we_ton618.jpg' },
  ];

  let stores = defaultStores;

  if (Array.isArray(data?.stores) && data.stores.length > 0) {
    stores = data.stores.map((item: any, i: number) => ({
      name: item.name || defaultStores[i % defaultStores.length].name,
      image: item.image ? getStrapiMedia(item.image) : defaultStores[i % defaultStores.length].image
    }));
  } else if (rawGallery.length > 0) {
    stores = defaultStores.map((defStore, i) => {
      const galleryItem = rawGallery[i % rawGallery.length];
      const url = galleryItem?.url || galleryItem?.attributes?.url;
      return {
        name: defStore.name,
        image: url ? getStrapiMedia(url) : defStore.image
      };
    });
  }

  return (
    <section 
      className="who-are-we-section"
      style={{ 
        padding: '90px 0', 
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(12, 1fr)', 
            gap: '40px',
            alignItems: 'center' 
          }}
        >
          {/* LEFT COLUMN: Text Content & Action Button */}
          <div 
            className="who-are-we-left fade-in-up"
            style={{ 
              gridColumn: 'span 5',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {/* Tagline */}
            <span 
              style={{ 
                color: '#2563eb', 
                fontSize: '14px', 
                fontWeight: '700', 
                letterSpacing: '0.05em', 
                textTransform: 'uppercase',
                marginBottom: '10px',
                display: 'block'
              }}
            >
              {badgeText}
            </span>

            {/* Main Title */}
            <h2 
              style={{ 
                fontSize: '42px', 
                fontWeight: '800', 
                color: '#0f172a', 
                margin: '0 0 16px 0',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}
            >
              {title}
            </h2>

            {/* Accent Line */}
            <div 
              style={{ 
                width: '40px', 
                height: '4px', 
                backgroundColor: '#2563eb', 
                borderRadius: '2px', 
                marginBottom: '28px' 
              }} 
            />

            {/* Paragraphs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {paragraphs.map((text: string, index: number) => (
                <p 
                  key={index} 
                  style={{ 
                    color: '#475569', 
                    fontSize: '15px', 
                    lineHeight: '1.7', 
                    margin: 0,
                    fontWeight: '400'
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Main Banner + 4-Grid Store Images */}
          <div 
            className="who-are-we-right fade-in-up"
            style={{ 
              gridColumn: 'span 7',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Top Large Warehouse / Center Image */}
            <div 
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '370px', 
                borderRadius: '20px', 
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9'
              }}
              className="group"
            >
              <Image 
                src={mainImageUrl}
                alt="Amuulai Group Distribution Center"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Bottom 4 Stores Grid */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '14px' 
              }}
            >
              {stores.map((store: { name: string; image: string }, idx: number) => (
                <div 
                  key={idx}
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '135px', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f1f5f9'
                  }}
                  className="group"
                >
                  <Image 
                    src={store.image}
                    alt={store.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive adjustments styling */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .who-are-we-left {
            grid-column: span 12 !important;
          }
          .who-are-we-right {
            grid-column: span 12 !important;
          }
        }
        @media (max-width: 640px) {
          .who-are-we-right > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
