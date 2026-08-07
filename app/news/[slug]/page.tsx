import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNavMenu, getFooterMenu, getFooterData, getSettingData, getArticleBySlug, getStrapiMedia, parseStrapiText } from '@/lib/api';

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
    content: `<h2>Амуулай Группийн шинэ томилгоо</h2>
<p>Амуулай Групп компани нь хэрэглэгчдэдээ хүнс, гоо сайхан, өргөн хэрэглээний шилдэг бүтээгдэхүүнүүдийг нийлүүлэх үйл ажиллагаагаа өргөжүүлэн тэлсээр байна.</p>
<h3>Стратегийн өсөлт ба туршлага</h3>
<p>Энэхүү стратегийн өсөлтийн хүрээнд кей аккаунт хариуцсан захирлаар <strong>Н.Оюун-Эрдэнэ</strong> томилогдон ажлаа эхлүүллээ. Тэрээр FMCG салбарт олон жилийн туршлагатай бөгөөд Амуулай Группийн томоохон харилцагчидтай хийх хамтын ажиллагааг шинэ түвшинд гаргахаар зорин ажиллаж байна.</p>
<ul>
  <li>Томоохон сүлжээ харилцагчидтай хийх хамтын ажиллагааг өргөжүүлэх</li>
  <li>Бүтээгдэхүүний борлуулалт, нийлүүлэлтийн сүлжээг оновчтой болгох</li>
  <li>Хэрэглэгчдийн сэтгэл ханамжийг дээшлүүлэх шинэ шийдлүүд нэвтрүүлэх</li>
</ul>
<blockquote>Хэрэглэгчдэд чанартай, баталгаатай бүтээгдэхүүнийг хүргэх нь бидний эрхэм зорилго юм.</blockquote>`,
  },
  '2026-world-cup-overview': {
    title: '2026 ХӨЛБӨМБӨГ ДАШТ ЮУ ЮУ БОЛООД ӨНГӨРӨВ?',
    publishDate: '2026-07-21',
    dateDisplay: '2026, 7 сарын 21',
    category: 'МЭДЭЭ МЭДЭЭЛЭЛ',
    coverImage: '/images/why_amuulai_main.png',
    content: `<h2>2026 Хөлбөмбөгийн ДАШТ-ий онцлох тойм</h2>
<p>Дэлхийн хөлбөмбөгийн хамгийн том баяр цэнгэл болох 2026 оны Хөлбөмбөгийн ДАШТ амжилттай болж өнгөрлөө. АНУ, Канад, Мексик улсуудад хамтран зохион байгуулагдсан энэхүү тэмцээнд дэлхийн шилдэг багууд өрсөлдсөн юм.</p>
<h3>Маркетинг ба хамтын ажиллагаа</h3>
<p>Тэмцээний үеэр бизнесийн болон маркетингийн салбарын онцлох арга хэмжээнүүд зохион байгуулагдсан бөгөөд дэлхийн брендүүдийн ивээн тэтгэлэг, хамтын ажиллагааны шинэ загварууд онцгой байлаа.</p>
<ul>
  <li>3 улсыг дамгнасан хамгийн том зохион байгуулалт</li>
  <li>Шинэ технологи, дижитал дамжуулалтын дэвшил</li>
</ul>`,
  },
  'nano-brands-victoria-malaga': {
    title: 'NANO BRANDS: VICTORIA MALAGA',
    publishDate: '2026-07-20',
    dateDisplay: '2026, 7 сарын 20',
    category: 'БРЭНД МЭДЭЭ',
    coverImage: '/images/mild_shelf_1783644620504.png',
    content: `<h2>NANO BRANDS: Victoria Malaga цуглуулга</h2>
<p>Испанийн алдартай <strong>Victoria</strong> брэндийн цуглуулга Монголын зах зээлд албан ёсоор борлуулагдаж байна. 100 гаруй жилийн түүхтэй энэхүү брэнд нь чанар болон загварын төгс хослолыг хэрэглэгчдэд нийлүүлдэг.</p>
<h3>Онцлог ба давуу талууд</h3>
<p>Манай салбар дэлгүүрүүдээс та Victoria брэндийн бүх төрлийн гутал, өдөр тутмын загваруудыг худалдан авах боломжтой.</p>`,
  },
  'nano-brands-bic': {
    title: 'NANO BRANDS: BIC',
    publishDate: '2026-06-30',
    dateDisplay: '2026, 6 сарын 30',
    category: 'БРЭНД МЭДЭЭ',
    coverImage: '/images/mild_checkout_1783644612305.png',
    content: `<h2>NANO BRANDS: BIC брэндийн шинэ нийлүүлэлт</h2>
<p><strong>BIC</strong> брэнд нь бичгийн хэрэгсэл болон өргөн хэрэглээний бүтээгдэхүүний зах зээлд дэлхийн №1 чанарыг санал болгодог. Амуулай Групп BIC брэндийн албан ёсны дистрибьюторын хувиар нийлүүлж байна.</p>
<h3>Бүтээгдэхүүний нэр төрөл</h3>
<ul>
  <li>BIC бичгийн хэрэгсэл ба балнууд</li>
  <li>BIC сахлын хутга ба ахуйн хэрэглээний асаагуурууд</li>
</ul>
<blockquote>Дэлхийн стандарт чанарыг Монгол гэр бүл бүрд хүргэнэ.</blockquote>`,
  },
  'amuulai-brands-bic': {
    title: 'AMUULAI BRANDS: BIC',
    publishDate: '2026-07-29',
    dateDisplay: '2026, 7 сарын 29',
    category: 'БРЭНД МЭДЭЭ',
    coverImage: '/images/corporate_team.png',
    content: `<h2>AMUULAI BRANDS: BIC албан ёсны дистрибьютор</h2>
<p>Amuulai Group компани BIC брэндийн бүтээгдэхүүнүүдийг Монголын зах зээлд албан ёсны эрхтэйгээр нийлүүлж байна.</p>
<p>Чанар, эдэлгээ сайтай бичгийн хэрэгсэл, асаагуур, сахлын хутга зэрэг өргөн хэрэглээний шилдэг бүтээгдэхүүнүүдийг хэрэглэгчдэдээ шууд хүргэж байна.</p>`,
  },
  'store-renovation': {
    title: 'АМУУЛАЙ ГРУППИЙН САЛБАР ДЭЛГҮҮРИЙН ШИНЭЧЛЭЛТ',
    publishDate: '2026-07-28',
    dateDisplay: '2026, 7 сарын 28',
    category: 'ҮЙЛ АЖИЛЛАГАА',
    coverImage: '/images/mild_store_front.png',
    content: `<h2>Салбар дэлгүүрийн иж бүрэн шинэчлэлт</h2>
<p>Манай салбар дэлгүүрүүд орчин үеийн тав тухтай орчин бүрдүүлэн хэрэглэгчиддээ үйлчилж байна.</p>
<p>Хэрэглэгчдийн хэрэгцээнд нийцүүлэн дотоод зохион байгуулалт, тавиур болон худалдан авалтын орчныг иж бүрэн шинэчлэн тохижууллаа.</p>`,
  },
  'csr-projects': {
    title: 'НИЙГМИЙН ХАРИУЦЛАГЫН ХҮРЭЭНД ХЭРЭГЖҮҮЛЖ БУЙ ТӨСЛҮҮД',
    publishDate: '2026-07-25',
    dateDisplay: '2026, 7 сарын 25',
    category: 'ҮЙЛ АЖИЛЛАГАА',
    coverImage: '/images/corporate_team.png',
    content: `<h2>Нийгмийн хариуцлагын төслүүд</h2>
<p>Ажилтнууд болон нийгмийн хөгжилд чиглэсэн цогц төслүүдийг үе шаттайгаар хэрэгжүүлж байна.</p>
<p>Амуулай Групп компани нь нийгмийн сайн сайхны төлөө тогтвортой хөгжлийн бодлогыг баримтлан ажилладаг бөгөөд байгаль орчин, боловсрол, эрүүл мэндийн салбарыг дэмжин ажиллаж байна.</p>`,
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

function formatSlugToTitle(slug: string): string {
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  if (fallbackArticleDetails[cleanSlug]?.title) {
    return fallbackArticleDetails[cleanSlug].title;
  }
  for (const key of Object.keys(fallbackArticleDetails)) {
    if (key.replace(/-/g, '') === cleanSlug.replace(/-/g, '')) {
      return fallbackArticleDetails[key].title;
    }
  }
  return cleanSlug.split(/[-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatCkeditorContent(content: any): string {
  if (!content) return '';
  if (typeof content !== 'string') {
    content = parseStrapiText(content);
  }
  const str = String(content).trim();
  if (!str) return '';

  if (/<[a-z][\s\S]*>/i.test(str)) {
    return str;
  }

  const lines = str.split('\n');
  let html = '';
  let inList = false;

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }

    if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${line.slice(4).trim()}</h3>`;
    } else if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${line.slice(3).trim()}</h2>`;
    } else if (line.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${line.slice(2).trim()}</h2>`;
    } else if (line.startsWith('> ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<blockquote>${line.slice(2).trim()}</blockquote>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      const itemText = line.slice(2).trim()
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<li>${itemText}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      const pText = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<p>${pText}</p>`;
    }
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
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

  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  const fallbackObj = fallbackArticleDetails[cleanSlug] || fallbackArticleDetails[cleanSlug.replace(/-/g, '')] || null;

  let article: any = null;
  if (fetchedArticle) {
    const attrs = fetchedArticle.attributes || fetchedArticle;
    const coverUrl = attrs.coverImage?.url || attrs.coverImage?.data?.attributes?.url;
    const rawContent = attrs.content || attrs.body || attrs.description || attrs.details || attrs.text || attrs.article_content || attrs.excerpt || fallbackObj?.content || '';

    article = {
      title: attrs.title || attrs.Title || attrs.name || attrs.heading || fallbackObj?.title || formatSlugToTitle(slug),
      publishDate: attrs.publishDate || attrs.publishedAt || attrs.createdAt,
      dateDisplay: formatDate(attrs.publishDate || attrs.publishedAt || attrs.createdAt),
      category: attrs.category || fallbackObj?.category || 'ОНЦЛОХ МЭДЭЭ',
      coverImage: coverUrl ? getStrapiMedia(coverUrl) : (fallbackObj?.coverImage || '/images/corporate_team.png'),
      content: formatCkeditorContent(rawContent),
    };
  } else {
    article = fallbackObj || {
      title: formatSlugToTitle(slug),
      publishDate: '2026-07-25',
      dateDisplay: '2026, 7 сарын 25',
      category: 'МЭДЭЭ МЭДЭЭЛЭЛ',
      coverImage: '/images/corporate_team.png',
      content: formatCkeditorContent(`<h2>${formatSlugToTitle(slug)}</h2>\n<p>Амуулай Группийн үйл ажиллагааны онцлох мэдээлэл болон дэлгэрэнгүй агуулга.</p>`),
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

          {/* Article Body Content with CKEditor Styling */}
          <div 
            className="article-body-content ck-content-render prose prose-teal max-w-none"
            style={{ 
              fontSize: '17px', 
              lineHeight: '1.85', 
              color: '#334155', 
              backgroundColor: '#ffffff',
              padding: '40px',
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              marginBottom: '60px'
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Inline CKEditor Styles */}
          <style dangerouslySetInnerHTML={{ __html: `
            .article-body-content h2 {
              font-size: 24px !important;
              font-weight: 800 !important;
              color: #0f172a !important;
              margin-top: 28px !important;
              margin-bottom: 14px !important;
              line-height: 1.3 !important;
            }
            .article-body-content h3 {
              font-size: 20px !important;
              font-weight: 700 !important;
              color: #1e293b !important;
              margin-top: 22px !important;
              margin-bottom: 10px !important;
            }
            .article-body-content p {
              margin-bottom: 18px !important;
              font-size: 17px !important;
              line-height: 1.85 !important;
              color: #334155 !important;
            }
            .article-body-content ul, .article-body-content ol {
              margin-bottom: 20px !important;
              padding-left: 24px !important;
            }
            .article-body-content li {
              margin-bottom: 8px !important;
              font-size: 16px !important;
              color: #334155 !important;
            }
            .article-body-content blockquote {
              border-left: 4px solid #00829d !important;
              background-color: #f0fdfa !important;
              padding: 16px 20px !important;
              margin: 24px 0 !important;
              border-radius: 0 8px 8px 0 !important;
              font-style: italic !important;
              color: #0f766e !important;
            }
            .article-body-content strong {
              color: #0f172a !important;
              font-weight: 700 !important;
            }
          ` }} />

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
