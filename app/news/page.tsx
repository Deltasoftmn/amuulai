import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNavMenu, getFooterMenu, getFooterData, getSettingData, getNewsArticles, getStrapiMedia } from '@/lib/api';

const fallbackArticles = [
  {
    id: 1,
    slug: 'key-account-director-oyun-erdene',
    title: 'КЕЙ АККАУНТ ХАРИУЦСАН ЗАХИРЛААР ТОМИЛОГДСОН Н.ОЮУН-ЭРДЭНЭ',
    publishDate: '2026-07-25',
    dateDisplay: '2026, 7 сарын 25',
    excerpt: 'Амуулай Групп компанийн кей аккаунт хариуцсан захирлаар Н.Оюун-Эрдэнэ томилогдон үйл ажиллагаагаа эхлүүллээ.',
    coverImage: '/images/corporate_team.png',
    isFeatured: true,
  },
  {
    id: 2,
    slug: '2026-world-cup-overview',
    title: '2026 ХӨЛБӨМБӨГ ДАШТ ЮУ ЮУ БОЛООД ӨНГӨРӨВ?',
    publishDate: '2026-07-21',
    dateDisplay: '2026, 7 сарын 21',
    excerpt: 'Дэлхийн хамгийн том спортын баяр цэнгэл болох 2026 оны Хөлбөмбөгийн ДАШТ-ий онцлох үйл явдлуудын тойм.',
    coverImage: '/images/why_amuulai_main.png',
  },
  {
    id: 3,
    slug: 'nano-brands-victoria-malaga',
    title: 'NANO BRANDS: VICTORIA MALAGA',
    publishDate: '2026-07-20',
    dateDisplay: '2026, 7 сарын 20',
    excerpt: 'Испанийн алдартай Victoria брэндийн шинэ цуглуулга болон онцлох бүтээгдэхүүнүүдийг танилцуулж байна.',
    coverImage: '/images/mild_shelf_1783644620504.png',
  },
  {
    id: 4,
    slug: 'nano-brands-bic',
    title: 'NANO BRANDS: BIC',
    publishDate: '2026-06-30',
    dateDisplay: '2026, 6 сарын 30',
    excerpt: 'Дэлхийн тэргүүлэгч BIC брэндийн чанартай бүтээгдэхүүнүүдийг Амуулай Групп албан ёсоор хүргэж байна.',
    coverImage: '/images/mild_checkout_1783644612305.png',
  },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return '2026, 7 сарын 21';
  try {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}, ${month} сарын ${day}`;
  } catch {
    return dateStr;
  }
}

export default async function NewsPage() {
  const navItems = await getNavMenu();
  const footerItems = await getFooterMenu();
  const footerData = await getFooterData();
  const settingData = await getSettingData();
  const fetchedArticles = await getNewsArticles(100);

  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  // Combine fetched articles with fallbacks
  let articlesList: any[] = [];
  if (Array.isArray(fetchedArticles) && fetchedArticles.length > 0) {
    articlesList = fetchedArticles.map((item: any) => {
      const attrs = item.attributes || item;
      const coverUrl = attrs.coverImage?.url || attrs.coverImage?.data?.attributes?.url;
      return {
        id: item.id || attrs.id,
        slug: attrs.slug || `news-${item.id}`,
        title: attrs.title || '',
        publishDate: attrs.publishDate || attrs.publishedAt || attrs.createdAt,
        dateDisplay: formatDate(attrs.publishDate || attrs.publishedAt || attrs.createdAt),
        excerpt: attrs.excerpt || '',
        coverImage: coverUrl ? getStrapiMedia(coverUrl) : '/images/corporate_team.png',
      };
    });
  } else {
    articlesList = fallbackArticles;
  }

  const totalCount = articlesList.length;
  const featuredArticle = articlesList[0];
  const gridArticles = articlesList.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header navItems={navItems} logoUrl={logoUrl} />

      {/* MAIN CONTENT AREA */}
      <main 
        style={{ 
          paddingTop: '120px', 
          paddingBottom: '100px', 
          background: "linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.98)), url('/pattern2.png') repeat",
          backgroundSize: '180px',
          minHeight: '80vh' 
        }}
      >
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888888', marginBottom: '15px' }}>
            <Link href="/" style={{ color: '#555555', textDecoration: 'none' }} className="hover:underline">
              Нүүр
            </Link>
            <span>&gt;</span>
            <span style={{ color: '#888888' }}>Мэдээлэл ({totalCount})</span>
          </div>

          {/* Main Title */}
          <h1 
            style={{ 
              fontSize: '46px', 
              fontWeight: '800', 
              color: '#111111', 
              letterSpacing: '-1px', 
              textTransform: 'uppercase', 
              marginBottom: '50px' 
            }}
          >
            МЭДЭЭЛЭЛ
          </h1>

          {/* FEATURED NEWS SECTION (2 Columns) */}
          {featuredArticle && (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
                gap: '40px', 
                alignItems: 'center',
                marginBottom: '70px'
              }}
            >
              {/* Left Column: Image with Red Accent Badge */}
              <div style={{ position: 'relative', width: '100%', height: '360px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                {/* Red top corner badge accent as seen in reference */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#ef4444', zIndex: 2 }} />
                <Image
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              {/* Right Column: Title and Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
                <span 
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: '#888888', 
                    letterSpacing: '1px', 
                    textTransform: 'uppercase' 
                  }}
                >
                  ОНЦЛОХ МЭДЭЭ
                </span>

                <h2 
                  style={{ 
                    fontSize: '32px', 
                    fontWeight: '800', 
                    color: '#111111', 
                    lineHeight: '1.25', 
                    letterSpacing: '-0.5px',
                    textTransform: 'uppercase',
                    margin: 0
                  }}
                >
                  {featuredArticle.title}
                </h2>

                <Link 
                  href={`/news/${featuredArticle.slug}`}
                  style={{ 
                    display: 'inline-block',
                    border: '1px solid #111111', 
                    padding: '9px 24px', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: '#111111', 
                    textDecoration: 'none',
                    textTransform: 'lowercase',
                    borderRadius: '2px',
                    marginTop: '10px',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover:bg-slate-900 hover:text-white"
                >
                  дэлгэрэнгүй
                </Link>
              </div>
            </div>
          )}

          {/* 3-COLUMN NEWS GRID */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '40px' 
            }}
          >
            {gridArticles.map((article: any) => (
              <div key={article.id || article.slug} style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Article Cover Image */}
                <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f8fafc', marginBottom: '18px' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#ef4444', zIndex: 2 }} />
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    className="hover:scale-105"
                  />
                </div>

                {/* Date */}
                <span style={{ fontSize: '13px', color: '#888888', marginBottom: '8px' }}>
                  {article.dateDisplay || formatDate(article.publishDate)}
                </span>

                {/* Title */}
                <h3 
                  style={{ 
                    fontSize: '18px', 
                    fontWeight: '800', 
                    color: '#111111', 
                    lineHeight: '1.35', 
                    textTransform: 'uppercase',
                    marginBottom: '20px',
                    minHeight: '48px'
                  }}
                >
                  {article.title}
                </h3>

                {/* Bottom Divider Line */}
                <div style={{ height: '1px', backgroundColor: '#e2e8f0', width: '100%', marginBottom: '14px' }} />

                {/* Bottom Link with Arrow ↗ */}
                <Link 
                  href={`/news/${article.slug}`}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '13px', 
                    color: '#666666', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    textTransform: 'lowercase',
                    transition: 'color 0.2s ease'
                  }}
                  className="hover:text-[#00829d]"
                >
                  <span>дэлгэрэнгүй</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </Link>

              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
