'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStrapiMedia, getCategories, getProducts, getBrands, sortByOrder } from '@/lib/api';

interface ProductCatalogProps {
  initialBrands?: any[];
  initialProducts?: any[];
  categoryTitle?: string;
  hideHeaderTitle?: boolean;
  selectedBrandSlug?: string;
  selectedCategorySlug?: string;
}

const DEFAULT_CATEGORIES = [
  { id: 'all', title: 'Бүх', slug: 'all' },
  { id: 'skin-care', title: 'Арьс арчилгаа', slug: 'skin-care' },
  { id: 'body-care', title: 'Бие арчилгаа', slug: 'body-care' },
  { id: 'hair-care', title: 'Үс арчилгаа', slug: 'hair-care' },
  { id: 'oral-care', title: 'Амны хөндийн арчилгаа', slug: 'oral-care' },
  { id: 'food', title: 'Хүнс', slug: 'food' },
  { id: 'household', title: 'Ахуйн бараа', slug: 'household' },
];

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

// EXPANDABLE PRODUCT CARD ITEM COMPONENT
function ProductCardItem({ product }: { product: any }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const descriptionText = product.subtitle || product.description || '';

  return (
    <div className="flex flex-col bg-white p-3.5 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 h-full justify-between items-start">
      <div className="w-full">
        {/* Product Image Container */}
        <div className="relative w-full h-[210px] bg-slate-50 flex items-center justify-center mb-3 border border-slate-100 group-hover:border-emerald-300 transition-all duration-500 overflow-hidden rounded-xl">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
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
        <h3 className="text-xs font-bold text-gray-900 leading-snug m-2!">
          {product.title}
        </h3>
      </div>

      {/* Expandable Description Toggle */}
      {descriptionText ? (
        <div className="w-full pt-2 border-t border-slate-100 mt-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors p-2! cursor-pointer"
          >
            <span>Тайлбар</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded Description Text */}
          {isExpanded && (
            <div className="m-2! text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 animate-fade-in break-words">
              {descriptionText}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function ProductCatalog({ 
  initialBrands = [], 
  initialProducts = [],
  categoryTitle = 'Бүтээгдэхүүн',
  hideHeaderTitle = false,
  selectedBrandSlug: initialSelectedBrandSlug = 'all',
  selectedCategorySlug: initialSelectedCategorySlug = 'all',
}: ProductCatalogProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([{ id: 'all', title: 'Бүх', slug: 'all' }]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialSelectedCategorySlug);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>(initialSelectedBrandSlug);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Read URL params on client side load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const brandParam = params.get('brand');
      if (catParam) setSelectedCategorySlug(catParam);
      if (brandParam) setSelectedBrandSlug(brandParam);
    }
  }, []);

  // Fetch Categories from /api/categories
  useEffect(() => {
    async function fetchCategoriesData() {
      try {
        const res = await getCategories();
        if (Array.isArray(res) && res.length > 0) {
          const parsed = res.map((c: any) => {
            const attrs = c.attributes || c;
            return {
              id: c.id || attrs.slug,
              title: attrs.title || attrs.name || 'Category',
              slug: attrs.slug || (attrs.title || attrs.name || '').toLowerCase(),
            };
          });
          setCategories([{ id: 'all', title: 'Бүх', slug: 'all' }, ...parsed]);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        setCategories(DEFAULT_CATEGORIES);
      }
    }
    fetchCategoriesData();
  }, []);

  // Fetch Brands from /api/brands
  useEffect(() => {
    const processBrands = (rawList: any[]) => {
      const sortedList = sortByOrder(rawList || []);
      const parsedBrands = sortedList.map((b: any) => {
        const attrs = b.attributes || b;
        const rawLogoObj = attrs.logo || attrs.featuredLogos?.[0] || attrs.image || attrs.coverImage;
        const rawLogo = typeof rawLogoObj === 'string' ? rawLogoObj : (rawLogoObj?.url || rawLogoObj?.data?.attributes?.url);
        const bSlug = attrs.slug || (attrs.title || attrs.name || '').toLowerCase();
        
        return {
          id: b.id || bSlug,
          title: attrs.title || attrs.name || 'Brand',
          slug: bSlug,
          logoUrl: rawLogo ? getStrapiMedia(rawLogo) : null,
          order: b.order ?? attrs.order,
        };
      });
      setBrands(parsedBrands);
    };

    if (Array.isArray(initialBrands) && initialBrands.length > 0) {
      processBrands(initialBrands);
    } else {
      getBrands().then((resBrands: any[]) => {
        if (Array.isArray(resBrands) && resBrands.length > 0) {
          processBrands(resBrands);
        }
      });
    }
  }, [initialBrands]);

  // Dynamic Products Fetcher
  const loadProducts = useCallback(async (catSlug: string, bSlug: string) => {
    setLoading(true);
    try {
      const rawProducts = await getProducts(bSlug, catSlug);

      if (Array.isArray(rawProducts) && rawProducts.length > 0) {
        const parsed = rawProducts.map((p: any, i: number) => {
          const attrs = p.attributes || p;
          const rawImgUrl = findImageInObject(p);
          const bObj = attrs.brand?.data?.attributes || attrs.brand || {};
          const cObj = attrs.category?.data?.attributes || attrs.category || {};

          return {
            id: p.id || i,
            brandSlug: bObj.slug || (bObj.title || bObj.name || '').toLowerCase(),
            brandName: bObj.title || bObj.name || '',
            categorySlug: cObj.slug || (cObj.title || cObj.name || '').toLowerCase(),
            title: attrs.title || attrs.name || `Product ${i + 1}`,
            subtitle: attrs.subtitle || attrs.description || attrs.excerpt || '',
            image: rawImgUrl ? getStrapiMedia(rawImgUrl) : null,
          };
        });
        setProducts(parsed);
      } else {
        if (Array.isArray(initialProducts) && initialProducts.length > 0) {
          const parsedInitial = initialProducts.map((p: any, i: number) => {
            const attrs = p.attributes || p;
            const rawImgUrl = findImageInObject(p);
            const bObj = attrs.brand?.data?.attributes || attrs.brand || {};
            const cObj = attrs.category?.data?.attributes || attrs.category || {};
            return {
              id: p.id || i,
              brandSlug: p.brandSlug || bObj.slug || (bObj.title || bObj.name || '').toLowerCase(),
              brandName: p.brandName || bObj.title || bObj.name || '',
              categorySlug: p.categorySlug || cObj.slug || (cObj.title || cObj.name || '').toLowerCase(),
              title: attrs.title || attrs.name || `Product ${i + 1}`,
              subtitle: attrs.subtitle || attrs.description || attrs.excerpt || '',
              image: rawImgUrl ? getStrapiMedia(rawImgUrl) : null,
            };
          });

          const filtered = parsedInitial.filter((p: any) => {
            if (catSlug !== 'all' && p.categorySlug && p.categorySlug !== catSlug) return false;
            if (bSlug !== 'all' && p.brandSlug && p.brandSlug !== bSlug) return false;
            return true;
          });
          setProducts(filtered);
        } else {
          setProducts([]);
        }
      }
    } catch (err) {
      console.error('Error loading filtered products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [initialProducts]);

  useEffect(() => {
    loadProducts(selectedCategorySlug, selectedBrandSlug);
  }, [selectedCategorySlug, selectedBrandSlug, loadProducts]);

  const handleCategorySelect = (catSlug: string) => {
    setSelectedCategorySlug(catSlug);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (catSlug === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', catSlug);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleBrandSelect = (bSlug: string) => {
    const nextBrand = selectedBrandSlug === bSlug ? 'all' : bSlug;
    setSelectedBrandSlug(nextBrand);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextBrand === 'all') url.searchParams.delete('brand');
      else url.searchParams.set('brand', nextBrand);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] pt-8 md:pt-12 pb-24 animate-fade-in-up">
      <div 
        className="container mx-auto px-4 sm:px-6 py-6 max-w-[1240px]" 
        style={{ maxWidth: '1240px', margin: '0 auto' }}
      >
        
        {/* HEADER SECTION */}
        {!hideHeaderTitle && (
          <>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="hover:text-gray-900 transition-colors">Брэнд</span>
              <span>&gt;</span>
              <span className="font-semibold text-gray-900">{categoryTitle}</span>
            </nav>

            <div className="flex items-center gap-4 mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                БҮТЭЭГДЭХҮҮН
              </h1>
            </div>
          </>
        )}

        {/* CATEGORY NAVIGATION TABS */}
        <div className="w-full mb-8! mt-8!">
          <div className="flex items-center gap-3! overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((cat: any) => {
              const isSelected = selectedCategorySlug === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`p-[6px]! rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.03]'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* BRAND LOGOS GRID */}
        {brands.length > 0 && (
          <div className="w-full mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider m-4!">
                Брэндээр шүүх
              </h2>
              {selectedBrandSlug !== 'all' && (
                <button
                  onClick={() => handleBrandSelect('all')}
                  className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  ✕ Бүх брэнд
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {brands.map((brand: any) => {
                const isSelected = selectedBrandSlug === brand.slug;
                return (
                  <button
                    key={brand.id || brand.slug}
                    onClick={() => handleBrandSelect(brand.slug)}
                    className={`p-4 rounded-2xl border bg-white flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer h-24 ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md bg-emerald-50/20'
                        : 'border-slate-200/90 hover:border-emerald-300 hover:shadow-sm'
                    }`}
                  >
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.title} className="max-h-10 max-w-[100px] object-contain" />
                    ) : (
                      <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {brand.title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PRODUCTS GRID HEADER & RESULTS COUNT */}
        <div className="flex items-center justify-between mt-8! mb-8! px-1">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Бүтээгдэхүүнүүд ({products.length})
          </h3>
          {(selectedCategorySlug !== 'all' || selectedBrandSlug !== 'all') && (
            <button
              onClick={() => {
                handleCategorySelect('all');
                setSelectedBrandSlug('all');
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              ✕ Шүүлтүүр цэвэрлэх
            </button>
          )}
        </div>

        {/* PRODUCTS GRID WITH EXPANDABLE DESCRIPTION ACCORDION */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-start">
            {products.map((product: any) => (
              <ProductCardItem key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 text-xl font-bold">
              i
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Сонгосон шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй
            </h3>
            <button
              onClick={() => {
                handleCategorySelect('all');
                setSelectedBrandSlug('all');
              }}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors mt-3 shadow-sm"
            >
              Бүх бүтээгдэхүүнийг харах
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
