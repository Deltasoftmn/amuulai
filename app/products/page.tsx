import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCatalog from '@/components/ProductCatalog';
import { getBrands, getProducts, getNavMenu, getFooterMenu, getFooterData, getSettingData, getStrapiMedia } from '@/lib/api';

export const revalidate = 60; // Refresh cache every 60s

export default async function ProductsPage() {
  const [brandsRaw, productsRaw, navMenu, footerMenu, footerData, settingData] = await Promise.all([
    getBrands(),
    getProducts(),
    getNavMenu(),
    getFooterMenu(),
    getFooterData(),
    getSettingData(),
  ]);

  // Pre-process brands on the server (resolve image URLs here, not on client)
  const brandsData = (brandsRaw || []).map((b: any) => {
    const logoUrl = b.logo?.url || b.featuredLogos?.[0]?.url || b.image?.url || null;
    return {
      id: b.id,
      title: b.title || b.name || 'Brand',
      slug: b.slug || '',
      logoUrl: logoUrl ? getStrapiMedia(logoUrl) : null,
    };
  });

  // Pre-process products on the server (resolve image URLs here, not on client)
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

  const navItems = navMenu.map((m: any) => ({
    label: m.title || m.label,
    url: m.url || `/${m.slug}`,
    children: m.items?.map((sub: any) => ({
      label: sub.title || sub.label,
      url: sub.url || `/${sub.slug}`,
    }))
  }));

  const footerItems = footerMenu.map((m: any) => ({
    label: m.title || m.label,
    url: m.url || `/${m.slug}`
  }));

  // Logo URL for transparent header over hero banner
  const logoUrl = settingData?.whiteLogo?.url 
    ? getStrapiMedia(settingData.whiteLogo.url) 
    : (settingData?.mainLogo?.url ? getStrapiMedia(settingData.mainLogo.url) : undefined);

  // Hero Banner image (e.g. hero1.webp)
  const heroImageUrl = '/uploads/hero1_78bd80586f.webp';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* TRANSPARENT HEADER ON TOP OF HERO BANNER */}
      <Header navItems={navItems} logoUrl={logoUrl} transparentOnTop={true} />

      {/* FULL-WIDTH 660px HERO BANNER WITH GRADIENT & OVERLAID TEXT */}
      <section 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '660px', 
          backgroundColor: '#0f172a',
          overflow: 'hidden' 
        }}
      >
        <Image
          src={heroImageUrl}
          alt="Бүтээгдэхүүн"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />

        {/* Dark Gradient Overlay matching reference design */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(135deg, rgba(0, 45, 70, 0.85) 0%, rgba(0, 30, 50, 0.6) 60%, rgba(0, 0, 0, 0.4) 100%)' 
          }} 
        />

        {/* Hero Banner Text Content (Bottom-Left Aligned) */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-end', 
            paddingBottom: '65px',
            zIndex: 10 
          }}
        >
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
            
            {/* Breadcrumb Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '16px' }}>
              <Link href="/" style={{ color: '#ffffff', textDecoration: 'none' }} className="hover:underline">
                Нүүр
              </Link>
              <span>&gt;</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: '600' }}>Бүтээгдэхүүн</span>
            </div>

            {/* Overlaid Title */}
            <h1 
              style={{ 
                fontSize: '52px', 
                fontWeight: '800', 
                color: '#ffffff', 
                letterSpacing: '-1px', 
                textTransform: 'uppercase', 
                lineHeight: '1.15',
                margin: 0,
                textShadow: '0 4px 20px rgba(0,0,0,0.35)'
              }}
            >
              БҮТЭЭГДЭХҮҮН
            </h1>

          </div>
        </div>
      </section>

      {/* PRODUCT CATALOG CONTENT (BRAND FILTER + PRODUCTS GRID) */}
      <main className="flex-grow bg-white py-20 md:py-20">
        <ProductCatalog 
          initialBrands={brandsData} 
          initialProducts={productsData} 
          categoryTitle="Хүнс"
          hideHeaderTitle={true}
        />
      </main>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
