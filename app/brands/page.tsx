import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlockManager from '@/components/BlockManager';
import ProductCatalog from '@/components/ProductCatalog';
import { getPageBySlug, getBrands, getProducts, getNavMenu, getFooterMenu, getFooterData, getSettingData, getStrapiMedia, sortByOrder } from '@/lib/api';

export const revalidate = 60; // Refresh cache every 60s

export default async function BrandsPage() {
  const [pageData, brandsRaw, productsRaw, navMenu, footerMenu, footerData, settingData] = await Promise.all([
    getPageBySlug('brand'),
    getBrands(),
    getProducts(),
    getNavMenu(),
    getFooterMenu(),
    getFooterData(),
    getSettingData(),
  ]);

  const blocks = pageData?.blocks || pageData?.attributes?.blocks || [];

  // Pre-process brands on the server
  const sortedBrandsRaw = sortByOrder(brandsRaw || []);
  const brandsData = sortedBrandsRaw.map((b: any) => {
    const rawLogo = b.logo?.url || b.featuredLogos?.[0]?.url || b.image?.url || null;
    const sortedSubLogos = sortByOrder(b.featuredLogos || []);
    return {
      id: b.id,
      title: b.title || b.name || 'Brand',
      slug: b.slug || '',
      logoUrl: rawLogo ? getStrapiMedia(rawLogo) : null,
      subLogos: Array.isArray(sortedSubLogos)
        ? sortedSubLogos.map((l: any) => getStrapiMedia(typeof l === 'string' ? l : l.url)).filter(Boolean)
        : [],
      order: b.order,
    };
  });

  // Pre-process products on the server
  const productsData = (productsRaw || []).map((p: any, i: number) => {
    const imageUrl = p.image?.url || p.image?.formats?.medium?.url || p.image?.formats?.small?.url || null;
    return {
      id: p.id || i,
      title: p.title || p.name || `Product ${i + 1}`,
      subtitle: p.subtitle || p.description || '',
      image: imageUrl ? getStrapiMedia(imageUrl) : null,
      brandSlug: p.brand?.slug || p.brand?.name?.toLowerCase() || '',
      brandName: p.brand?.title || p.brand?.name || '',
    };
  });

  const navItems = (navMenu || []).map((m: any) => ({
    label: m.title || m.label,
    url: m.url || `/${m.slug}`,
    children: m.items?.map((sub: any) => ({
      label: sub.title || sub.label,
      url: sub.url || `/${sub.slug}`,
    }))
  }));

  const footerItems = (footerMenu || []).map((m: any) => ({
    label: m.title || m.label,
    url: m.url || `/${m.slug}`
  }));

  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header navItems={navItems} logoUrl={logoUrl} />

      <main className="flex-grow bg-slate-50 pt-28 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="bg-[#00829d]/10 text-[#00829d] px-4 py-1.5 rounded-full text-xs font-bold inline-block mb-3 uppercase tracking-wider">
              {pageData?.title || 'Бидний брэндүүд'}
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              {pageData?.title || 'Шилдэг брэнд болон бүтээгдэхүүнүүд'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Дэлхийн нэр хүндтэй брэндүүдийн албан ёсны бүтээгдэхүүнүүдтэй танилцана уу.
            </p>
          </div>

          {/* DYNAMIC STRAPI BLOCKS (ProductCategoryBlock, etc.) */}
          {Array.isArray(blocks) && blocks.length > 0 && (
            <div className="mb-16">
              <BlockManager blocks={blocks} />
            </div>
          )}

          {/* BRAND AND PRODUCT CATALOG FILTER */}
          <ProductCatalog 
            initialBrands={brandsData} 
            initialProducts={productsData} 
            hideHeaderTitle={true}
          />
        </div>
      </main>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
