import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNavMenu, getFooterMenu, getFooterData, getSettingData, getArticleBySlug, getNewsArticles, getStrapiMedia } from '@/lib/api';

interface NewsDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

const fallbackArticleDetails: Record<string, any> = {
  'key-account-director-oyun-erdene': {
    title: 'КЕЙ АККАУНТ ХАРИУЦСАН ЗАХИРЛААР ТОМИЛОГДСОН Н.ОЮУН-ЭРДЭНЭ',
    publishDate: '2026-07-25',
    dateDisplay: '2026, 7 сарын 25',
    category: 'ОНЦЛОХ МЭДЭЭ',
    coverImage: '/images/corporate_team.png',
    content: `Амуулай Групп компани нь хэрэглэгчдэдээ хүнс, гоо сайхан, өргөн хэрэглээний шилдэг бүтээгдэхүүнүүдийг нийлүүлэх үйл ажиллагаагаа өргөжүүлэн тэлсээр байна.

Энэхүү стратегийн өсөлтийн хүрээнд кей аккаунт хариуцсан захирлаар Н.Оюун-Эрдэнэ томилогдон ажлаа эхлүүллээ. Тэрээр FMCG салбарт олон жилийн туршлагатай бөгөөд Амуулай Группийн томоохон харилцагчидтай хийх хамтын ажиллагааг шинэ түвшинд гаргахаар зорин ажиллаж байна.`,
  },
  '2026-world-cup-overview': {
    title: '2026 ХӨЛБӨМБӨГ ДАШТ ЮУ ЮУ БОЛООД ӨНГӨРӨВ?',
    publishDate: '2026-07-21',
    dateDisplay: '2026, 7 сарын 21',
    category: 'МЭДЭЭ МЭДЭЭЛЭЛ',
    coverImage: '/images/why_amuulai_main.png',
    content: `Дэлхийн хөлбөмбөгийн хамгийн том баяр цэнгэл болох 2026 оны Хөлбөмбөгийн ДАШТ амжилттай болж өнгөрлөө. АНУ, Канад, Мексик улсуудад хамтран зохион байгуулагдсан энэхүү тэмцээнд дэлхийн шилдэг багууд өрсөлдсөн юм.

Тэмцээний үеэр бизнесийн болон маркетингийн салбарын онцлох арга хэмжээнүүд зохион байгуулагдсан бөгөөд дэлхийн брендүүдийн ивээн тэтгэлэг, хамтын ажиллагааны шинэ загварууд онцгой байлаа.`,
  },
  'nano-brands-victoria-malaga': {
    title: 'NANO BRANDS: VICTORIA MALAGA',
    publishDate: '2026-07-20',
    dateDisplay: '2026, 7 сарын 20',
    category: 'БРЭНД МЭДЭЭ',
    coverImage: '/images/mild_shelf_1783644620504.png',
    content: `Испанийн алдартай Victoria брэндийн цуглуулга Монголын зах зээлд албан ёсоор борлуулагдаж байна. 100 гаруй жилийн түүхтэй энэхүү брэнд нь чанар болон загварын төгс хослолыг хэрэглэгчдэд нийлүүлдэг.`,
  },
  'nano-brands-bic': {
    title: 'NANO BRANDS: BIC',
    publishDate: '2026-06-30',
    dateDisplay: '2026, 6 сарын 30',
    category: 'БРЭНД МЭДЭЭ',
    coverImage: '/images/mild_checkout_1783644612305.png',
    content: `BIC брэнд нь бичгийн хэрэгсэл болон өргөн хэрэглээний бүтээгдэхүүний зах зээлд дэлхийн №1 чанарыг санал болгодог. Амуулай Групп BIC брэндийн албан ёсны дистрибьюторын хувиар нийлүүлж байна.`,
  },
};

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

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params;
  const navItems = await getNavMenu();
  const footerItems = await getFooterMenu();
  const footerData = await getFooterData();
  const settingData = await getSettingData();
  const fetchedArticle = await getArticleBySlug(slug);

  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  // Parse Strapi article attributes if present
  let article: any = null;
  if (fetchedArticle) {
    const attrs = fetchedArticle.attributes || fetchedArticle;
    const coverUrl = attrs.coverImage?.url || attrs.coverImage?.data?.attributes?.url;
    
    // Convert Strapi rich text content array to text string if needed
    let contentText = attrs.content || '';
    if (Array.isArray(contentText)) {
      contentText = contentText.map((block: any) => block.children?.map((c: any) => c.text).join('')).join('\n\n');
    }

    article = {
      title: attrs.title || slug.toUpperCase().replace(/-/g, ' '),
      publishDate: attrs.publishDate || attrs.publishedAt || attrs.createdAt,
      dateDisplay: formatDate(attrs.publishDate || attrs.publishedAt || attrs.createdAt),
      category: 'ОНЦЛОХ МЭДЭЭ',
      coverImage: coverUrl ? getStrapiMedia(coverUrl) : '/images/corporate_team.png',
      content: contentText || attrs.excerpt || 'Тус мэдээллийн дэлгэрэнгүй агуулга тун удахгүй шинэчлэгдэнэ.',
    };
  } else {
    article = fallbackArticleDetails[slug] || {
      title: slug.toUpperCase().replace(/-/g, ' '),
      publishDate: '2026-07-25',
      dateDisplay: '2026, 7 сарын 25',
      category: 'МЭДЭЭ МЭДЭЭЛЭЛ',
      coverImage: '/images/corporate_team.png',
      content: 'Амуулай Группийн үйл ажиллагааны онцлох мэдээлэл.',
    };
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header navItems={navItems} logoUrl={logoUrl} />

      <main 
        style={{ 
          paddingTop: '120px', 
          paddingBottom: '100px', 
          background: "linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.98)), url('/pattern2.png') repeat",
          backgroundSize: '180px',
          minHeight: '80vh' 
        }}
      >
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888888', marginBottom: '25px' }}>
            <Link href="/" style={{ color: '#555555', textDecoration: 'none' }} className="hover:underline">
              Нүүр
            </Link>
            <span>&gt;</span>
            <Link href="/news" style={{ color: '#555555', textDecoration: 'none' }} className="hover:underline">
              Мэдээлэл
            </Link>
            <span>&gt;</span>
            <span style={{ color: '#888888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
              {article.title}
            </span>
          </div>

          {/* Category Tag & Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <span 
              style={{ 
                fontSize: '13px', 
                fontWeight: '700', 
                color: '#00829d', 
                letterSpacing: '1px', 
                textTransform: 'uppercase' 
              }}
            >
              {article.category || 'МЭДЭЭ МЭДЭЭЛЭЛ'}
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '13px', color: '#888888' }}>
              {article.dateDisplay || formatDate(article.publishDate)}
            </span>
          </div>

          {/* Main Title */}
          <h1 
            style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#111111', 
              lineHeight: '1.25', 
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
              marginBottom: '35px'
            }}
          >
            {article.title}
          </h1>

          {/* Cover Image */}
          {article.coverImage && (
            <div style={{ position: 'relative', width: '100%', height: '440px', borderRadius: '8px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          {/* Article Body Content */}
          <div 
            style={{ 
              fontSize: '17px', 
              lineHeight: '1.85', 
              color: '#334155', 
              whiteSpace: 'pre-line',
              backgroundColor: '#ffffff',
              padding: '40px',
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              marginBottom: '60px'
            }}
          >
            {article.content}
          </div>

          {/* Back to News Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link 
              href="/news"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #111111', 
                padding: '12px 30px', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#111111', 
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-slate-900 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Бүх мэдээлэл рүү буцах</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
