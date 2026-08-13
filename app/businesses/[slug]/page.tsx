import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BusinessGallerySlider from '@/components/BusinessGallerySlider';
import { 
  getBusinessBySlug, 
  getNavMenu, 
  getFooterMenu, 
  getFooterData, 
  getSettingData, 
  getStrapiMedia, 
  parseStrapiText 
} from '@/lib/api';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const fetchedBusiness = await getBusinessBySlug(slug);
  const navItems = await getNavMenu();
  const footerItems = await getFooterMenu();
  const footerData = await getFooterData();
  const settingData = await getSettingData();

  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  const attrs = fetchedBusiness?.attributes || fetchedBusiness || null;

  // If Strapi returns no data for this business, render clean empty state
  if (!attrs) {
    const formattedSlugTitle = decodeURIComponent(slug)
      .replace(/-/g, ' ')
      .toUpperCase();

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header navItems={navItems} logoUrl={logoUrl} />

        <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
          <div className="max-w-[1240px] mx-auto px-6 text-center">
            
            {/* Breadcrumb Navigation */}
            <div className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
              <Link href="/" className="hover:text-[#00829d] transition-colors">
                Нүүр
              </Link>
              <span>/</span>
              <Link href="/#businesses" className="hover:text-[#00829d] transition-colors">
                Бизнесүүд
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-bold">{formattedSlugTitle}</span>
            </div>

            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>

              <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
                {formattedSlugTitle}
              </h1>

              <p className="text-gray-500 text-base leading-relaxed mb-8">
                Strapi систем дээр энэ бизнесийн мэдээлэл хараахан оруулаагүй эсвэл хаалттай байна.
              </p>

              <Link
                href="/#businesses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00829d] hover:bg-[#006b82] text-white font-bold text-sm transition-all"
              >
                <span>Бүх бизнесүүд рүү буцах</span>
                <span>&rarr;</span>
              </Link>
            </div>

          </div>
        </main>

        <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
      </div>
    );
  }

  // Business Name from Strapi
  const rawNameStr = parseStrapiText(attrs.name || attrs.title || attrs.Name || attrs.Title);
  const name = rawNameStr.replace(/<[^>]*>?/gm, '').trim() || slug.toUpperCase().replace(/-/g, ' ');

  // Slogan from Strapi
  const rawSloganStr = parseStrapiText(attrs.slogan || attrs.subtitle || attrs.tagline || attrs.desc_short);
  const slogan = rawSloganStr.replace(/<[^>]*>?/gm, '').trim() || '';

  // Description from Strapi
  const rawDescription = attrs.description || attrs.content || attrs.body || attrs.details || attrs.about || '';
  const description = parseStrapiText(rawDescription) || (typeof rawDescription === 'string' ? rawDescription : '');

  // Cover Image from Strapi
  const rawCover = attrs.coverImage || attrs.cover || attrs.image || attrs.banner || attrs.logo;
  const rawCoverUrl = typeof rawCover === 'string' ? rawCover : (rawCover?.url || rawCover?.data?.attributes?.url);
  const coverUrl = rawCoverUrl ? getStrapiMedia(rawCoverUrl) : null;

  // Infographic Image from Strapi
  const rawInfo = attrs.infographicImage || attrs.infographic || attrs.chartImage;
  const rawInfoUrl = typeof rawInfo === 'string' ? rawInfo : (rawInfo?.url || rawInfo?.data?.attributes?.url);
  const infographicUrl = rawInfoUrl ? getStrapiMedia(rawInfoUrl) : null;

  // Gallery from Strapi
  const rawGallery = attrs.gallery || attrs.images || attrs.photos || [];
  const galleryList: string[] = Array.isArray(rawGallery)
    ? rawGallery.map((item: any) => {
        const u = typeof item === 'string' ? item : (item?.url || item?.data?.attributes?.url || item?.attributes?.url);
        return u ? getStrapiMedia(u) : '';
      }).filter(Boolean)
    : (Array.isArray(rawGallery?.data) 
        ? rawGallery.data.map((item: any) => getStrapiMedia(item?.attributes?.url || item?.url)).filter(Boolean) 
        : []);

  // Badge from Strapi
  const rawBadgeStr = parseStrapiText(attrs.badge);
  const badge = rawBadgeStr.replace(/<[^>]*>?/gm, '').trim() || 'АМУУЛАЙ БИЗНЕС';

  // Contacts extracted from Strapi Business entry `contact` component (as configured in Strapi schema)
  const contactComponent = attrs.contact || (Array.isArray(attrs.contacts) ? attrs.contacts[0] : null) || {};

  const phone = contactComponent.phone || contactComponent.contactPhone || attrs.contactPhone || attrs.phone || '';
  const website = contactComponent.websiteUrl || contactComponent.website || contactComponent.contactWebsite || attrs.contactWebsite || attrs.website || '';
  const address = contactComponent.address || contactComponent.contactAddress || attrs.contactAddress || attrs.address || '';
  const email = contactComponent.email || contactComponent.contactEmail || attrs.contactEmail || attrs.email || '';

  const hasContacts = Boolean(phone || website || address || email);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header navItems={navItems} logoUrl={logoUrl} />

      <main className="flex-grow pt-28 pb-16 lg:pb-24">
        <div className="max-w-[1320px] mx-auto px-6">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-[#00829d] transition-colors">
              Нүүр
            </Link>
            <span>/</span>
            <Link href="/#businesses" className="hover:text-[#00829d] transition-colors">
              Бизнесүүд
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{name}</span>
          </div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column (7 Spans) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div>
                <span className="bg-[#00829d]/10 text-[#00829d] px-4 py-1.5 rounded-full text-xs font-bold inline-block mb-3 border border-[#00829d]/20 uppercase tracking-wider">
                  {badge}
                </span>
                <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {name}
                </h1>
                {slogan && (
                  <p className="text-xl font-semibold text-[#00829d] italic leading-relaxed">
                    "{slogan}"
                  </p>
                )}
              </div>

              {/* Rich Text Description */}
              {description && (
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              {/* Infographic Image at Bottom */}
              {infographicUrl && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Инфографик & Үзүүлэлт</h3>
                  <div className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden bg-slate-100">
                    <Image
                      src={infographicUrl}
                      alt={`${name} Infographic`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (5 Spans) */}
            <div className="lg:col-span-5 flex flex-col gap-8 sticky top-28">
              
              {/* Large Cover Image */}
              {coverUrl && (
                <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-md bg-slate-100 border border-gray-100">
                  <Image
                    src={coverUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Gallery Slider with Auto-Slide */}
              {galleryList.length > 0 && (
                <BusinessGallerySlider images={galleryList} name={name} />
              )}

              {/* Brand Styled Box with Contact Info */}
              {hasContacts && (
                <div 
                  className="text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, rgb(0, 130, 157) 0%, #006b82 60%, #005c70 100%)',
                    boxShadow: '0 16px 36px rgba(0, 130, 157, 0.25)'
                  }}
                >
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <h3 className="text-xl font-extrabold mb-6 text-white border-b border-white/20 pb-4 flex items-center justify-between relative z-10">
                    <span>Холбоо барих</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse"></span>
                  </h3>
                  <div className="flex flex-col gap-4 text-sm text-slate-100 relative z-10 font-medium">
                    {phone && (
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-200 font-bold shrink-0">Утас:</span>
                        <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                          {phone}
                        </a>
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-200 font-bold shrink-0">Э-мэйл:</span>
                        <a href={`mailto:${email}`} className="hover:text-white transition-colors underline break-all">
                          {email}
                        </a>
                      </div>
                    )}
                    {website && (
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-200 font-bold shrink-0">Вэбсайт:</span>
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition-colors underline break-all"
                        >
                          {website}
                        </a>
                      </div>
                    )}
                    {address && (
                      <div className="flex items-start gap-3">
                        <span className="text-cyan-200 font-bold shrink-0">Хаяг:</span>
                        <span className="leading-normal">{address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
