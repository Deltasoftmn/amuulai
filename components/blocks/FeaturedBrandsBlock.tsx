'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/lib/api';

interface FeaturedBrandsBlockProps {
  data?: any;
}

export default function FeaturedBrandsBlock({ data }: FeaturedBrandsBlockProps) {
  const [brandsData, setBrandsData] = React.useState<any[]>(Array.isArray(data?.brands) ? data.brands : []);

  React.useEffect(() => {
    // If block data from page doesn't have brands or featuredLogos populated, fetch directly from Strapi getBrands()
    const needsFetch = !Array.isArray(data?.brands) || data.brands.length === 0 || data.brands.every((b: any) => !b.featuredLogos || b.featuredLogos.length === 0);
    if (needsFetch) {
      import('@/lib/api').then(({ getBrands }) => {
        getBrands().then((resBrands: any[]) => {
          if (Array.isArray(resBrands) && resBrands.length > 0) {
            setBrandsData(resBrands);
          }
        });
      });
    }
  }, [data?.brands]);

  const badgeText = data?.badgeText || 'Брэндүүд';
  const brandList = brandsData.length > 0 ? brandsData : (Array.isArray(data?.brands) ? data.brands : []);

  if (brandList.length === 0) {
    return null;
  }

  return (
    <section className="section" id="products" style={{ padding: '80px 0', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
      <div className="container">
        <div className="section-header fade-in-up" style={{ textAlign: "center", marginBottom: "50px" }}>
          <div className="section-badge" style={{ background: 'rgba(0, 130, 157, 0.1)', color: '#00829d', padding: '6px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
            {badgeText}
          </div>
          {data?.title && data.title !== badgeText && (
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
              {data.title}
            </h2>
          )}
          {data?.buttonUrl && (
            <div style={{ marginTop: '12px' }}>
              <Link 
                href={data.buttonUrl.startsWith('/') ? data.buttonUrl : `/${data.buttonUrl}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#00829d',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 130, 157, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                className="hover:scale-105 hover:bg-[#006e85]"
              >
                {data.buttonText || 'Дэлгэрэнгүй танилцах'} &rarr;
              </Link>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {brandList.map((brand: any, i: number) => {
            // Extract logo URLs from Strapi (featuredLogos, subLogos, or logos)
            const rawLogos = brand.featuredLogos || brand.subLogos || brand.logos;
            let strapiLogos: string[] = [];

            if (Array.isArray(rawLogos) && rawLogos.length > 0) {
              strapiLogos = rawLogos
                .map((item: any) => {
                  const url = typeof item === 'string' ? item : (item?.url || item?.attributes?.url);
                  return url ? getStrapiMedia(url) : '';
                })
                .filter(Boolean);
            }

            // Strictly visible logos from Strapi (no fake image fallbacks)
            const visibleLogos = strapiLogos.slice(0, 6);

            // Calculate remaining count (+X logos/brands)
            const remainingCount = strapiLogos.length > 6 ? (strapiLogos.length - 6) : 0;
            const extraCount = remainingCount > 0 ? remainingCount : (brand.extra > 0 ? brand.extra : 0);

            // Dynamic grid layout (2 or 3 columns depending on count)
            const gridCols = visibleLogos.length <= 2 || visibleLogos.length === 4 ? 2 : 3;

            return (
              <div
                key={brand.id || i}
                className="premium-brand-card fade-in-up"
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  padding: '30px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #00829d, #00c6e0)' }} />

                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#111', marginBottom: '20px', textAlign: 'center', letterSpacing: '0.5px' }}>
                  {brand.title || brand.name || 'BRAND'}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: '15px', flexGrow: 1 }}>
                  {visibleLogos.map((logoSrc: string, subId: number) => {
                    return (
                      <div
                        key={subId}
                        style={{
                          background: '#f8fafc',
                          borderRadius: '12px',
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '80px',
                          border: '1px solid #f1f5f9',
                          transition: 'background 0.3s',
                        }}
                      >
                        <Image
                          src={logoSrc}
                          alt={`${brand.title || 'Brand'} logo ${subId + 1}`}
                          width={100}
                          height={60}
                          style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', mixBlendMode: 'darken', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
                          className="hover:scale-[1.2]"
                          onError={(e: any) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: extraCount > 0 ? 'space-between' : 'flex-end', alignItems: 'center', marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                  {extraCount > 0 && (
                    <span style={{ background: '#f1f5f9', color: '#00829d', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                      +{extraCount} брэнд
                    </span>
                  )}
                  {(() => {
                    const rawUrl = brand.buttonUrl || brand.url || brand.link || data?.buttonUrl;
                    const cardUrl = rawUrl 
                      ? (rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`) 
                      : '/brand';
                    const cardText = brand.buttonText || 'Дэлгэрэнгүй';
                    return (
                      <Link href={cardUrl} style={{ color: '#00829d', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {cardText} <span style={{ fontSize: '16px' }}>&rarr;</span>
                      </Link>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
