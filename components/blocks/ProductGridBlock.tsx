'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/api';

interface ProductGridBlockProps {
  data?: any;
}

const defaultBrands = [
  { id: 'all', name: 'Бүгд', logo: null },
  { id: 'adicto', name: 'Adicto', logo: '/images/vilo_logo.png' },
  { id: 'crax', name: 'Crax', logo: '/images/smart_logo.png' },
  { id: 'popkek', name: 'Popkek', logo: '/images/tide_logo.png' },
  { id: 'wanted', name: 'Wanted', logo: '/images/ariel_logo.png' },
  { id: 'luppo', name: 'Luppo', logo: '/images/safeguard_logo.png' },
  { id: 'biscolata', name: 'Biscolata', logo: '/images/fairy_logo.png' },
];

const defaultProducts = [
  {
    id: 1,
    brandId: 'adicto',
    brandName: 'Adicto',
    title: 'Adicto Browni 180gr x 12 pcs',
    description: 'Adicto mini browni какаотой кэкс',
    image: '/images/mild_shelf_1783644620504.png',
  },
  {
    id: 2,
    brandId: 'adicto',
    brandName: 'Adicto',
    title: 'Adicto Browni Cappuccino 180gr x 12pcs',
    description: 'Adicto mini browni капучинотой кэкс',
    image: '/images/mild_checkout_1783644612305.png',
  },
  {
    id: 3,
    brandId: 'adicto',
    brandName: 'Adicto',
    title: 'Adicto Browni G.Cocoa 36gr x 24pcs',
    description: 'Adicto шоколадны кремтэй кэкс',
    image: '/images/corporate_team.png',
  },
  {
    id: 4,
    brandId: 'adicto',
    brandName: 'Adicto',
    title: 'Adicto Dare Dark Wafer 50gr x 24pcs',
    description: 'Adicto хар шоколадтай өрмөнцөр',
    image: '/images/why_amuulai_main.png',
  },
  {
    id: 5,
    brandId: 'adicto',
    brandName: 'Adicto',
    title: 'Adicto Dare Milk Wafer 50gr x 24pcs',
    description: 'Adicto сүүтэй шоколадтай өрмөнцөр',
    image: '/images/hero3.png',
  },
  {
    id: 6,
    brandId: 'adicto',
    brandName: 'Adicto',
    title: 'Adicto Dark Wafer 50gr x 24pcs',
    description: 'Adicto хар шоколадтай өрмөнцөр',
    image: '/images/hero2.png',
  },
  {
    id: 7,
    brandId: 'adicto',
    brandName: 'Adicto',
    title: 'Adicto Intense 144gr new x 12 pcs',
    description: 'Adicto шоколадтай жигнэмэг',
    image: '/images/hero1.png',
  },
  {
    id: 8,
    brandId: 'adicto',
    brandName: 'Adicto',
    title: 'Adicto Milk Wafer 50gr x 24pcs',
    description: 'Adicto сүүтэй шоколадтай',
    image: '/images/mild_store_front_1783644603936.png',
  },
  {
    id: 9,
    brandId: 'crax',
    brandName: 'Crax',
    title: 'Crax Boost Cheese&Onion 50g x 20pcs',
    description: 'Crax бяслагтай шагшуурга',
    image: '/images/mild_shelf_1783644620504.png',
  },
  {
    id: 10,
    brandId: 'crax',
    brandName: 'Crax',
    title: 'Crax Boost Hot&Spicy 50g x 20pcs',
    description: 'Crax халуун чилитэй шагшуурга',
    image: '/images/corporate_team.png',
  },
  {
    id: 11,
    brandId: 'crax',
    brandName: 'Crax',
    title: 'Crax Cheese 45g x 21 pcs',
    description: 'Crax бяслагтай шагшуурга',
    image: '/images/hero3.png',
  },
  {
    id: 12,
    brandId: 'crax',
    brandName: 'Crax',
    title: 'Crax Herbs 45g x 21pcs',
    description: 'Crax ногоотой шагшуурга',
    image: '/images/why_amuulai_main.png',
  },
];

export default function ProductGridBlock({ data }: ProductGridBlockProps) {
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');

  const categoryName = data?.categoryName || data?.category || 'Хүнс';
  const sectionTitle = data?.title || 'Бүтээгдэхүүн';

  // Parse Strapi brands if present
  const rawBrands = data?.brands || data?.featuredLogos || [];
  const brandsList = Array.isArray(rawBrands) && rawBrands.length > 0
    ? [
        { id: 'all', name: 'Бүгд', logo: null },
        ...rawBrands.map((b: any, i: number) => {
          const lUrl = b.logo?.url || b.featuredLogos?.[0]?.url || b.url || b.image?.url;
          return {
            id: b.slug || b.id || `brand-${i}`,
            name: b.title || b.name || 'Brand',
            logo: lUrl ? getStrapiMedia(lUrl) : null,
          };
        })
      ]
    : defaultBrands;

  // Parse Strapi products if present
  const rawProducts = data?.products || data?.items || [];
  const productsList = Array.isArray(rawProducts) && rawProducts.length > 0
    ? rawProducts.map((p: any, i: number) => {
        const imgUrl = p.image?.url || p.coverImage?.url || p.photo?.url || p.featuredImage?.url;
        const bSlug = p.brand?.slug || p.brand?.name?.toLowerCase() || 'adicto';
        return {
          id: p.id || i,
          brandId: bSlug,
          brandName: p.brand?.title || p.brand?.name || 'Brand',
          title: p.title || p.name || `Product ${i + 1}`,
          description: p.description || p.subtitle || p.excerpt || '',
          image: imgUrl ? getStrapiMedia(imgUrl) : '/images/corporate_team.png',
        };
      })
    : defaultProducts;

  // Filter products by selected brand
  const filteredProducts = selectedBrandId === 'all'
    ? productsList
    : productsList.filter((p: any) => 
        p.brandId?.toLowerCase() === selectedBrandId.toLowerCase() ||
        p.brandName?.toLowerCase().includes(selectedBrandId.toLowerCase())
      );

  return (
    <section className="section animate-fade-in-up" style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888888', marginBottom: '15px' }}>
          <span>Брэнд</span>
          <span>&gt;</span>
          <span style={{ color: '#111827', fontWeight: '500' }}>{categoryName}</span>
        </div>

        {/* Header & Circle Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
            {sectionTitle}
          </h2>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1.5px solid #10b981' }} />
        </div>

        {/* BRAND FILTER ROW WITH 20% ZOOM HOVER EFFECT */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px', 
            flexWrap: 'wrap',
            paddingBottom: '25px', 
            marginBottom: '40px',
            borderBottom: '1px solid #f1f5f9' 
          }}
        >
          {brandsList.map((brand: any) => {
            const isSelected = selectedBrandId === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => setSelectedBrandId(brand.id)}
                style={{
                  background: isSelected ? '#f8fafc' : 'transparent',
                  border: isSelected ? '2px solid #10b981' : '1px solid transparent',
                  borderRadius: '12px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none',
                }}
                className="hover:scale-[1.2]"
              >
                {brand.logo ? (
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    style={{ maxHeight: '32px', maxWidth: '75px', objectFit: 'contain' }} 
                  />
                ) : (
                  <span 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: isSelected ? '800' : '600', 
                      color: isSelected ? '#10b981' : '#4b5563' 
                    }}
                  >
                    {brand.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 6-COLUMN PRODUCTS GRID */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
            gap: '30px' 
          }}
        >
          {filteredProducts.map((product: any) => (
            <div 
              key={product.id}
              className="group cursor-pointer animate-zoom-in"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* Product Package Image Box */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '210px', 
                  borderRadius: '16px', 
                  backgroundColor: '#ffffff', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  marginBottom: '14px',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain', padding: '12px' }}
                  className="transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              {/* Product Title */}
              <h3 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: '#111827', 
                  lineHeight: '1.35', 
                  marginBottom: '4px',
                  minHeight: '38px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {product.title}
              </h3>

              {/* Product Description */}
              {product.description && (
                <p 
                  style={{ 
                    fontSize: '13px', 
                    color: '#6b7280', 
                    lineHeight: '1.4', 
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {product.description}
                </p>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
