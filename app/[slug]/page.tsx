import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlockManager from '@/components/BlockManager';
import { getPageBySlug, getNavMenu, getFooterMenu, getFooterData, getSettingData, getStrapiMedia, parseStrapiText } from '@/lib/api';

interface DynamicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  const pageData = await getPageBySlug(slug);

  const navItems = await getNavMenu();
  const footerItems = await getFooterMenu();
  const footerData = await getFooterData();
  const settingData = await getSettingData();

  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  // If no page found in Strapi, return 404
  if (!pageData) {
    notFound();
  }

  const attrs = pageData?.attributes || pageData || {};

  // Extract Title from Strapi
  const title = attrs?.title || slug.toUpperCase().replace(/-/g, ' ');

  // Extract FeaturedImage directly from Strapi object
  const rawImage = attrs?.FeaturedImage?.url || attrs?.FeaturedImage?.data?.attributes?.url || attrs?.featuredImage || attrs?.coverImage;
  const imageUrl = rawImage ? getStrapiMedia(rawImage) : null;

  // Extract Content/Description from Strapi (if any)
  const contentText = parseStrapiText(attrs?.description || attrs?.content || attrs?.body || attrs?.details || attrs?.text);

  // Extract Dynamic Blocks from Strapi if present
  const blocks = pageData?.blocks || attrs?.blocks || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header navItems={navItems} logoUrl={logoUrl} transparentOnTop={!!imageUrl} />

      {/* FULL-WIDTH HERO BANNER WITH FEATURED IMAGE */}
      {imageUrl ? (
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
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          {/* Gradient Overlay for Text Readability */}
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(135deg, rgba(0, 32, 64, 0.75) 0%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.3) 100%)' 
            }} 
          />

          {/* Hero Banner Text Content */}
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'flex-end', 
              paddingBottom: '60px',
              zIndex: 10 
            }}
          >
            <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
              
              {/* Breadcrumb Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '15px' }}>
                <Link href="/" style={{ color: '#ffffff', textDecoration: 'none' }} className="hover:underline">
                  Нүүр
                </Link>
                <span>&gt;</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{title}</span>
              </div>

              {/* Title Overlaid on Hero Image Banner */}
              <h1 
                style={{ 
                  fontSize: '52px', 
                  fontWeight: '800', 
                  color: '#ffffff', 
                  letterSpacing: '-1px', 
                  textTransform: 'uppercase', 
                  lineHeight: '1.15',
                  margin: 0,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                {title}
              </h1>

            </div>
          </div>
        </section>
      ) : (
        /* Fallback Header spacing if no FeaturedImage */
        <div style={{ paddingTop: '120px' }}>
          <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#111', textTransform: 'uppercase' }}>
              {title}
            </h1>
          </div>
        </div>
      )}

      {/* MAIN PAGE BODY CONTENT */}
      <main 
        style={{ 
          paddingTop: '80px', 
          paddingBottom: '100px', 
          background: "linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.98)), url('/pattern2.png') repeat",
          backgroundSize: '180px',
          flexGrow: 1 
        }}
      >
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 24px 0' }}>
          
          {/* Content / Description Text */}
          {contentText && (
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
                marginBottom: '40px'
              }}
            >
              {contentText}
            </div>
          )}

          {/* Render Dynamic Strapi Blocks if present */}
          {Array.isArray(blocks) && blocks.length > 0 && (
            <BlockManager blocks={blocks} />
          )}

        </div>
      </main>

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
