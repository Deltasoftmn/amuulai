import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCatalog from '@/components/ProductCatalog';
import { getBrandBySlug, getBrands, getProducts, getNavMenu, getFooterMenu, getFooterData, getSettingData, getStrapiMedia } from '@/lib/api';

interface BrandDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { slug } = await params;

  const [rawBrand, brandsRaw, productsRaw, navMenu, footerMenu, footerData, settingData] = await Promise.all([
    getBrandBySlug(slug),
    getBrands(),
    getProducts(slug),
    getNavMenu(),
    getFooterMenu(),
    getFooterData(),
    getSettingData(),
  ]);

  const brand = rawBrand || {
    title: slug.toUpperCase(),
    slug: slug,
  };

  const featuredLogos = Array.isArray(brand.featuredLogos)
    ? brand.featuredLogos.map((l: any) => getStrapiMedia(l.url)).filter(Boolean)
    : [];

  const brandsData = (brandsRaw || []).map((b: any) => {
    const rawLogo = b.logo?.url || b.featuredLogos?.[0]?.url || b.image?.url || null;
    return {
      id: b.id,
      title: b.title || b.name || 'Brand',
      slug: b.slug || '',
      logoUrl: rawLogo ? getStrapiMedia(rawLogo) : null,
    };
  });

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
          {/* Breadcrumbs */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-[#00829d] transition-colors">
              Нүүр
            </Link>
            <span>/</span>
            <Link href="/brands" className="hover:text-[#00829d] transition-colors">
              Брэндүүд
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{brand.title || brand.name}</span>
          </div>

          {/* Brand Header Card */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div>
                <span className="bg-[#00829d]/10 text-[#00829d] px-4 py-1.5 rounded-full text-xs font-bold inline-block mb-3 uppercase tracking-wider">
                  Амуулай Брэнд
                </span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
                  {brand.title || brand.name}
                </h1>
                {brand.description && (
                  <p className="text-gray-600 max-w-2xl text-base leading-relaxed">
                    {brand.description}
                  </p>
                )}
              </div>

              {/* Sub-brand logos grid */}
              {featuredLogos.length > 0 && (
                <div className="flex flex-wrap gap-4 items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-100 max-w-md">
                  {featuredLogos.map((logoSrc: string, idx: number) => (
                    <div key={idx} className="relative w-24 h-14 bg-white rounded-xl p-2 flex items-center justify-center border border-slate-200/60 shadow-xs">
                      <Image
                        src={logoSrc}
                        alt={`${brand.title} logo ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Brand Products */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {brand.title} брэндийн бүтээгдэхүүнүүд
            </h2>
            <ProductCatalog 
              initialBrands={brandsData} 
              initialProducts={productsData} 
              selectedBrandSlug={slug}
              hideHeaderTitle={true}
            />
          </div>
        </div>
      </main>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
