'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/api';

interface ProductCatalogProps {
  initialBrands?: any[];
  initialProducts?: any[];
  categoryTitle?: string;
  hideHeaderTitle?: boolean;
}

function findImageInObject(obj: any): string | null {
  if (!obj) return null;
  if (typeof obj === 'string') {
    if (obj.includes('/uploads/') || obj.endsWith('.jpg') || obj.endsWith('.png') || obj.endsWith('.webp') || obj.endsWith('.jpeg')) {
      return obj;
    }
    return null;
  }
  if (typeof obj !== 'object') return null;

  if (typeof obj.url === 'string') return obj.url;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findImageInObject(item);
      if (found) return found;
    }
    return null;
  }

  const priorityKeys = ['image', 'featuredImage', 'coverImage', 'formats', 'large', 'medium', 'small', 'thumbnail', 'data', 'attributes'];
  for (const key of priorityKeys) {
    if (obj[key]) {
      const found = findImageInObject(obj[key]);
      if (found) return found;
    }
  }

  for (const key of Object.keys(obj)) {
    if (obj[key] && typeof obj[key] === 'object') {
      const found = findImageInObject(obj[key]);
      if (found) return found;
    }
  }

  return null;
}

export default function ProductCatalog({ 
  initialBrands = [], 
  initialProducts = [],
  categoryTitle = 'Хүнс',
  hideHeaderTitle = false
}: ProductCatalogProps) {
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>('all');
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Parse Strapi Brands (Strictly from Strapi API)
  useEffect(() => {
    if (Array.isArray(initialBrands) && initialBrands.length > 0) {
      const parsedBrands = initialBrands.map((b: any) => {
        const logo = findImageInObject(b);
        return {
          id: b.id || b.slug,
          title: b.title || b.name || 'Brand',
          slug: b.slug || b.title?.toLowerCase() || 'brand',
          logoUrl: logo ? getStrapiMedia(logo) : null,
        };
      });
      setBrands([{ id: 'all', title: 'Бүгд', slug: 'all', logoUrl: null }, ...parsedBrands]);
    } else {
      setBrands([{ id: 'all', title: 'Бүгд', slug: 'all', logoUrl: null }]);
    }
  }, [initialBrands]);

  // Parse Strapi Products (Strictly from Strapi API)
  useEffect(() => {
    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      const parsedProducts = initialProducts.map((p: any, i: number) => {
        const attrs = p.attributes || p;
        const rawImgUrl = findImageInObject(p);
        const bSlug = attrs.brand?.slug || attrs.brand?.name?.toLowerCase() || attrs.brand?.data?.attributes?.slug || '';
        
        return {
          id: p.id || i,
          brandSlug: bSlug,
          brandName: attrs.brand?.title || attrs.brand?.name || attrs.brand?.data?.attributes?.title || '',
          title: attrs.title || attrs.name || `Product ${i + 1}`,
          subtitle: attrs.subtitle || attrs.description || attrs.excerpt || '',
          image: rawImgUrl ? getStrapiMedia(rawImgUrl) : null,
        };
      });
      setProducts(parsedProducts);
    } else {
      setProducts([]);
    }
  }, [initialProducts]);

  // Filter products by selected brand slug
  const filteredProducts = selectedBrandSlug === 'all'
    ? products
    : products.filter((p: any) => 
        p.brandSlug?.toLowerCase() === selectedBrandSlug.toLowerCase() ||
        p.brandName?.toLowerCase().includes(selectedBrandSlug.toLowerCase())
      );

  return (
    <div className="w-full bg-white pt-16 md:pt-20 pb-16 animate-fade-in-up">
      <div 
        className="container mx-auto px-6 py-6 max-w-[1240px]" 
        style={{ padding: '24px', maxWidth: '1240px', margin: '0 auto' }}
      >
        
        {/* HEADER SECTION (Optional when Hero Banner is active) */}
        {!hideHeaderTitle && (
          <>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span className="hover:text-gray-900 transition-colors">Брэнд</span>
              <span>&gt;</span>
              <span className="font-semibold text-gray-900">{categoryTitle}</span>
            </nav>

            <div className="flex items-center gap-4 mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Бүтээгдэхүүн
              </h1>
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex-shrink-0" />
            </div>
          </>
        )}

        {/* PREMIUM BRAND FILTER BAR */}
        {brands.length > 1 && (
          <div className="w-full pt-8 pb-6 mb-12 border-b border-slate-200/80">
            <div className="flex items-center gap-5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {brands.map((brand: any) => {
                const isSelected = selectedBrandSlug === brand.slug;
                const isAll = brand.slug === 'all';

                if (isAll) {
                  return (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrandSlug('all')}
                      className={`px-7 py-3 rounded-full text-sm font-bold transition-all duration-300 flex-shrink-0 cursor-pointer hover:scale-[1.12] ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {brand.title}
                    </button>
                  );
                }

                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrandSlug(brand.slug)}
                    className={`flex items-center justify-center px-6 py-3 min-h-[52px] min-w-[110px] rounded-2xl transition-all duration-300 flex-shrink-0 cursor-pointer hover:scale-[1.2] ${
                      isSelected
                        ? 'bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/15 scale-105'
                        : 'bg-slate-50/90 border border-slate-200/60 hover:bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {brand.logoUrl ? (
                      <img 
                        src={brand.logoUrl} 
                        alt={brand.title} 
                        className="max-h-9 max-w-[95px] object-contain transition-transform duration-300"
                      />
                    ) : (
                      <span className={`text-sm tracking-wide ${isSelected ? 'font-extrabold text-emerald-600' : 'font-bold text-slate-700'}`}>
                        {brand.title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PRODUCTS GRID (RESPONSIVE 2 -> 4 -> 6 COLUMNS) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredProducts.map((product: any) => (
              <div 
                key={product.id}
                className="group flex flex-col cursor-pointer animate-zoom-in"
              >
                {/* Product Image Container */}
                <div className="relative w-full h-[200px] bg-slate-50 rounded-2xl flex items-center justify-center p-4 mb-3 border border-slate-100 group-hover:border-emerald-200 group-hover:shadow-md transition-all duration-300 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-[170px] max-w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
                      IMG
                    </div>
                  )}
                </div>

                {/* Product Title */}
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2 min-h-[38px] group-hover:text-emerald-600 transition-colors">
                  {product.title}
                </h3>

                {/* Product Subtitle / Description */}
                {product.subtitle && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {product.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE WHEN NO PRODUCTS RETURNED FROM STRAPI */
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 text-xl font-bold">
              i
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Бүтээгдэхүүн алга байна
            </h3>
          </div>
        )}

      </div>
    </div>
  );
}
