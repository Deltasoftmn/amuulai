'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStrapiMedia } from '@/lib/api';

interface ProductCatalogProps {
  initialBrands?: any[];
  initialProducts?: any[];
  categoryTitle?: string;
  hideHeaderTitle?: boolean;
  selectedBrandSlug?: string;
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
  hideHeaderTitle = false,
  selectedBrandSlug: initialSelectedBrandSlug = 'all'
}: ProductCatalogProps) {
  const router = useRouter();
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>(initialSelectedBrandSlug);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Parse Strapi Brands (Strictly from Strapi API)
  useEffect(() => {
    const processBrands = (rawList: any[]) => {
      const parsedBrands = rawList.map((b: any) => {
        const rawLogoObj = b.logoUrl || b.logo || b.featuredLogos?.[0] || b.image || b.coverImage;
        const rawLogo = typeof rawLogoObj === 'string' ? rawLogoObj : (rawLogoObj?.url || rawLogoObj?.data?.attributes?.url);
        return {
          id: b.id || b.slug,
          title: b.title || b.name || 'Brand',
          slug: b.slug || b.title?.toLowerCase() || 'brand',
          logoUrl: rawLogo ? getStrapiMedia(rawLogo) : null,
        };
      });
      setBrands([{ id: 'all', title: 'Бүгд', slug: 'all', logoUrl: null }, ...parsedBrands]);
    };

    if (Array.isArray(initialBrands) && initialBrands.length > 0 && initialBrands.some((b: any) => b.logoUrl || b.logo || b.featuredLogos)) {
      processBrands(initialBrands);
    } else {
      import('@/lib/api').then(({ getBrands }) => {
        getBrands().then((resBrands: any[]) => {
          if (Array.isArray(resBrands) && resBrands.length > 0) {
            processBrands(resBrands);
          } else if (Array.isArray(initialBrands) && initialBrands.length > 0) {
            processBrands(initialBrands);
          }
        });
      });
    }
  }, [initialBrands]);

  // Parse Strapi Products (Strictly from Strapi API)
  useEffect(() => {
    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      const parsedProducts = initialProducts.map((p: any, i: number) => {
        const attrs = p.attributes || p;
        const rawImgUrl = findImageInObject(p);
        const bObj = attrs.brand?.data?.attributes || attrs.brand || {};
        const bSlug = p.brandSlug || bObj.slug || bObj.name?.toLowerCase() || bObj.title?.toLowerCase() || '';
        const bName = p.brandName || bObj.title || bObj.name || '';
        const bId = p.brandId || p.brand?.id || bObj.id;
        
        return {
          id: p.id || i,
          brandSlug: bSlug,
          brandName: bName,
          brandId: bId,
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

  // Dynamically ensure products are populated from Strapi if empty
  useEffect(() => {
    if (products.length === 0) {
      import('@/lib/api').then(({ getProducts }) => {
        getProducts().then((freshRaw: any[]) => {
          if (Array.isArray(freshRaw) && freshRaw.length > 0) {
            const parsed = freshRaw.map((p: any, i: number) => {
              const attrs = p.attributes || p;
              const rawImgUrl = findImageInObject(p);
              const bObj = attrs.brand?.data?.attributes || attrs.brand || {};
              return {
                id: p.id || i,
                brandSlug: bObj.slug || bObj.name?.toLowerCase() || bObj.title?.toLowerCase() || '',
                brandName: bObj.title || bObj.name || '',
                brandId: bObj.id,
                title: attrs.title || attrs.name || `Product ${i + 1}`,
                subtitle: attrs.subtitle || attrs.description || attrs.excerpt || '',
                image: rawImgUrl ? getStrapiMedia(rawImgUrl) : null,
              };
            });
            setProducts(parsed);
          }
        });
      });
    }
  }, [products.length]);

  // Filter products by selected brand/category slug
  const filteredProducts = selectedBrandSlug === 'all'
    ? products
    : products.filter((p: any) => {
        if (!p) return false;
        const target = selectedBrandSlug.toLowerCase();
        const pSlug = (p.brandSlug || '').toLowerCase();
        const pName = (p.brandName || '').toLowerCase();
        const pId = p.brandId ? String(p.brandId) : '';

        return (
          pSlug === target ||
          (pSlug && target.includes(pSlug)) ||
          (pName && (pName === target || pName.includes(target) || target.includes(pName))) ||
          pId === target
        );
      });

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

        {/* FLAT BRAND FILTER BAR (TEXT ONLY, NO HEAVY ROUNDED/BACKGROUND BOXES, NO SCROLLBAR) */}
        {brands.length > 1 && (
          <div className="w-full border-b border-slate-200" style={{ marginBottom: '75px', paddingBottom: '0px' }}>
            <div 
              className="flex items-center gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {brands.map((brand: any) => {
                const isSelected = selectedBrandSlug === brand.slug;

                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrandSlug(brand.slug)}
                    className={`px-5 py-2.5 font-bold text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer flex-shrink-0 border-b-2 -mb-[17px] ${
                      isSelected
                        ? 'border-emerald-600 text-emerald-600 font-extrabold'
                        : 'border-transparent text-slate-600 hover:text-emerald-600 hover:border-slate-300'
                    }`}
                  >
                    {brand.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PRODUCTS GRID WITH LIFT-ON-HOVER & IMAGE SCALING */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6" style={{ marginTop: '10px' }}>
            {filteredProducts.map((product: any) => (
              <div 
                key={product.id}
                className="group flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-2"
              >
                {/* Product Image Container */}
                <div className="relative w-full h-[210px] bg-slate-50/80 rounded-2xl flex items-center justify-center p-4 mb-3 border border-slate-100/90 group-hover:border-emerald-300 group-hover:shadow-lg group-hover:shadow-emerald-500/10 group-hover:bg-white transition-all duration-500 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-[175px] max-w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-400">
                      <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">no picture</span>
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
