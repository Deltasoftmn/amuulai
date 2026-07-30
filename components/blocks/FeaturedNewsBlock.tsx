'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/lib/api';

interface FeaturedNewsBlockProps {
  data?: any;
  articles?: any[];
}

const defaultNews = [
  {
    id: 1,
    title: 'AMUULAI BRANDS: BIC',
    slug: 'amuulai-brands-bic',
    date: '2026-07-29',
    excerpt: 'Amuulai Group компани BIC брэндийн бүтээгдэхүүнүүдийг Монголын зах зээлд нийлүүлж байна.',
    image: '/images/corporate_team.png'
  },
  {
    id: 2,
    title: 'Амуулай Группийн салбар дэлгүүрийн шинэчлэлт',
    slug: 'store-renovation',
    date: '2026-07-28',
    excerpt: 'Манай салбар дэлгүүрүүд орчин үеийн тав тухтай орчин бүрдүүлэн хэрэглэгчиддээ үйлчилж байна.',
    image: '/images/mild_store_front.png'
  },
  {
    id: 3,
    title: 'Нийгмийн хариуцлагын хүрээнд хэрэгжүүлж буй төслүүд',
    slug: 'csr-projects',
    date: '2026-07-25',
    excerpt: 'Ажилтнууд болон нийгмийн хөгжилд чиглэсэн цогц төслүүдийг үе шаттайгаар хэрэгжүүлж байна.',
    image: '/images/corporate_team.png'
  }
];

export default function FeaturedNewsBlock({ data, articles }: FeaturedNewsBlockProps) {
  const badgeText = data?.badgeText || 'Мэдээ мэдээлэл';
  const title = data?.title || 'Сүүлийн үеийн мэдээ мэдээлэл';

  const rawArticles = (Array.isArray(data?.articles) && data.articles.length > 0)
    ? data.articles
    : (Array.isArray(articles) && articles.length > 0 ? articles : defaultNews);

  const newsList = rawArticles.map((item: any) => {
    const rawImg = item.image || item.coverImage?.url || item.coverImage?.data?.attributes?.url;
    return {
      id: item.id || item.documentId,
      title: item.title || '',
      slug: item.slug || 'article',
      date: item.publishDate || item.date || item.publishedAt?.slice(0, 10) || '',
      excerpt: item.excerpt || item.description || '',
      image: rawImg ? getStrapiMedia(rawImg) : '/images/corporate_team.png'
    };
  });

  return (
    <section className="section" id="news" style={{ padding: '100px 0', background: '#fff' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        
        <div className="section-header fade-in-up" style={{ textAlign: "center", marginBottom: "50px" }}>
          <div className="section-badge" style={{ background: 'rgba(0, 130, 157, 0.1)', color: '#00829d', padding: '6px 18px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
            {badgeText}
          </div>
          <h2 className="section-title" style={{ fontSize: '32px', fontWeight: '800', color: '#111' }}>{title}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {newsList.slice(0, 3).map((item: any, i: number) => (
            <div
              key={item.id || i}
              className="fade-in-up"
              style={{
                background: '#fff',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ position: 'relative', height: '220px', width: '100%', background: '#f8fafc' }}>
                <Image
                  src={item.image}
                  alt={item.title || 'News'}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#00829d', marginBottom: '10px' }}>
                  {item.date}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111', marginBottom: '12px', lineHeight: '1.4' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1 }}>
                  {item.excerpt}
                </p>
                <Link
                  href={`/news/${item.slug}`}
                  style={{ color: '#00829d', fontWeight: '800', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}
                >
                  Дэлгэрэнгүй <span style={{ fontSize: '16px' }}>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
