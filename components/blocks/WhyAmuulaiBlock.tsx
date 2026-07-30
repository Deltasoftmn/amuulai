import React from 'react';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/api';

interface WhyAmuulaiBlockProps {
  data?: any;
}

const fallbackIcons = [
  '/images/icon_growth.png',
  '/images/icon_teamwork.png',
  '/images/icon_environment.png',
  '/images/icon_benefits.png',
];

export default function WhyAmuulaiBlock({ data }: WhyAmuulaiBlockProps) {
  const badgeText = data?.badgeText || 'Таатай орчин';
  const title = data?.title || data?.sectionTitle || 'Яагаад Амуулай групп гэж?';
  const description = data?.description || '';
  
  const featureList = Array.isArray(data?.features) ? data.features : [];

  if (featureList.length === 0 && !data?.title) {
    return null;
  }

  const rawCoverUrl = typeof data?.coverImage === 'string' ? data.coverImage : (data?.coverImage?.url || data?.coverImage?.data?.attributes?.url);
  const coverImageUrl = rawCoverUrl ? getStrapiMedia(rawCoverUrl) : '/images/why_amuulai_main.png';

  return (
    <section className="section why-amuulai-section" style={{ padding: '100px 0', background: '#f8fafc' }}>
      <div className="container">
        <div className="section-header fade-in-up" style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className="section-badge" style={{ background: 'rgba(0, 130, 157, 0.1)', color: '#00829d', padding: '6px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
            {badgeText}
          </div>
          <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', color: '#111', marginBottom: '20px' }}>
            {title}
          </h2>
          {description && (
            <p style={{ maxWidth: '700px', margin: '0 auto', color: '#64748b', fontSize: '18px', lineHeight: '1.6' }}>
              {description}
            </p>
          )}
        </div>

        {coverImageUrl && (
          <div className="fade-in-up" style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: '50px' }}>
            <Image
              src={coverImageUrl}
              alt="Amuulai Group Corporate Environment"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {featureList.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {featureList.map((adv: any, i: number) => {
              const rawIcon = typeof adv.icon === 'string' ? adv.icon : (adv.icon?.url || adv.icon?.data?.attributes?.url || adv.iconUrl);
              const iconSrc = rawIcon ? getStrapiMedia(rawIcon) : fallbackIcons[i % fallbackIcons.length];

              return (
                <div
                  key={adv.id || i}
                  className="fade-in-up"
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '30px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                    animationDelay: `${i * 0.15}s`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', position: 'relative' }}>
                    <Image src={iconSrc} alt={adv.title || 'Feature'} fill style={{ objectFit: 'contain' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '12px' }}>{adv.title || adv.name}</h3>
                  <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.5' }}>{adv.desc || adv.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
