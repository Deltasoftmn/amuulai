'use client';

import React from 'react';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/api';

interface OurValuesBlockProps {
  data?: any;
}

const defaultValues = [
  {
    title: 'Итгэлцэл',
    description: 'Урт хугацааны хамтын ажиллагаа болон ил тод харилцаа.',
  },
  {
    title: 'Чанар',
    description: 'Албан ёсны чанартай бүтээгдэхүүн үйлчилгээ.',
  },
  {
    title: 'Инноваци',
    description: 'Шинэ санаа, шинэ шийдлийг үргэлж эрэлхийлнэ.',
  },
  {
    title: 'Хэрэглэгч төвтэй',
    description: 'Хэрэглэгчийн хэрэгцээг нэгдүгээрт тавина.',
  },
  {
    title: 'Хариуцлага',
    description: 'Нийгэм, түншүүд болон байгаль орчны өмнө хариуцлагатай.',
  },
  {
    title: 'Хөгжил',
    description: 'Хүмүүс, брэнд, бизнесийн тогтвортой хөгжлийг дэмжинэ.',
  },
];

function getValueIcon(idx: number, titleStr?: string) {
  const t = (titleStr || '').toLowerCase();
  if (t.includes('итгэл') || idx === 0) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    );
  }
  if (t.includes('чанар') || idx === 1) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  if (t.includes('инноваци') || idx === 2) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.64 2.94 1.68 3.93.63.63 1.05 1.34 1.32 2.07" />
      </svg>
    );
  }
  if (t.includes('хэрэглэгч') || idx === 3) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    );
  }
  if (t.includes('хариуцлага') || idx === 4) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export default function OurValuesBlock({ data }: OurValuesBlockProps) {
  const sectionTitle = data?.sectionTitle || data?.title || 'БИДНИЙ ҮНЭ ЦЭНЭ';
  const overlayTitle = data?.imageOverlayTitle || 'Бидний тухай';
  const overlayDesc = data?.imageOverlayDescription || 'Урт хугацааны хамтын ажиллагаа, ил тод байдал.';

  const rawImage = typeof data?.leftImage === 'string'
    ? data.leftImage
    : (data?.leftImage?.url || data?.leftImage?.data?.attributes?.url);
  const leftImageUrl = rawImage ? getStrapiMedia(rawImage) : '/images/corporate_team.png';

  const rawValues = data?.values;
  const valuesList = Array.isArray(rawValues) && rawValues.length > 0 ? rawValues : defaultValues;

  return (
    <section className="section our-values-section" id="values" style={{ padding: '100px 0', background: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          
          {/* Left Column: Image with Overlay Text at Bottom Left */}
          <div style={{ position: 'relative', width: '100%', height: '520px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.06)' }}>
            <Image
              src={leftImageUrl}
              alt={sectionTitle}
              fill
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 100%)',
                padding: '40px 35px',
                color: '#ffffff'
              }}
            >
              {overlayTitle && (
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px', color: '#ffffff', letterSpacing: '-0.3px' }}>
                  {overlayTitle}
                </h3>
              )}
              {overlayDesc && (
                <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5', margin: 0 }}>
                  {overlayDesc}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Title + Short Teal Line + Clean Values Grid */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              {sectionTitle}
            </h2>
            <div style={{ width: '45px', height: '4px', background: '#00829d', borderRadius: '2px', marginBottom: '45px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px 30px' }}>
              {valuesList.map((item: any, idx: number) => {
                const icon = item.icon?.url
                  ? <Image src={getStrapiMedia(item.icon.url)} alt={item.title} width={28} height={28} style={{ objectFit: 'contain' }} />
                  : getValueIcon(idx, item.title || item.name);

                return (
                  <div key={item.id || idx}>
                    <div style={{ marginBottom: '16px' }}>
                      {icon}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111111', marginBottom: '10px' }}>
                      {item.title || item.name}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                      {item.description || item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
