'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia, getFooterData, getSettingData, getFooterMenu } from '@/lib/api';

interface FooterProps {
  footerItems?: any[];
  footerData?: any;
  settingData?: any;
}

export default function Footer({ footerItems, footerData, settingData }: FooterProps) {
  const year = new Date().getFullYear();
  const [clientFooterData, setClientFooterData] = React.useState<any>(null);
  const [clientSettingData, setClientSettingData] = React.useState<any>(null);
  const [clientFooterItems, setClientFooterItems] = React.useState<any[]>([]);
  const [showMapPreview, setShowMapPreview] = useState<boolean>(false);

  React.useEffect(() => {
    if (!footerData) {
      getFooterData().then(data => setClientFooterData(data)).catch(() => {});
    }
    if (!settingData) {
      getSettingData().then(data => setClientSettingData(data)).catch(() => {});
    }
    if (!footerItems || footerItems.length === 0) {
      getFooterMenu().then(items => {
        if (Array.isArray(items) && items.length > 0) {
          const parsed = items.map((m: any) => ({
            label: m.title || m.label,
            url: m.url || `/${m.slug}`,
          }));
          setClientFooterItems(parsed);
        }
      }).catch(() => {});
    }
  }, [footerData, settingData, footerItems]);

  const activeFooterData = footerData || clientFooterData;
  const activeSettingData = settingData || clientSettingData;
  const activeFooterItems = (footerItems && footerItems.length > 0) ? footerItems : clientFooterItems;

  // 1. Logo from Strapi /setting
  const logoUrl = activeSettingData?.mainLogo?.url 
    ? getStrapiMedia(activeSettingData.mainLogo.url) 
    : (activeSettingData?.whiteLogo?.url ? getStrapiMedia(activeSettingData.whiteLogo.url) : '/logo_white.png');

  // 2. Tagline/Description from Strapi /footer
  const description = activeFooterData?.description || "Partner with Mongolia's leading multi-category retailer. We're looking for innovative brands and suppliers who share our commitment to quality and sustainability.";

  // 3. Copyright text from Strapi /setting
  const copyright = activeSettingData?.copyrightText || `© ${year} Амуулай Групп ХХК. Бүх эрх хуулиар хамгаалагдсан.`;

  // 4. Contact items from Strapi /footer contacts
  const contacts: any[] = Array.isArray(activeFooterData?.contacts) ? activeFooterData.contacts : [];

  const phoneObj = contacts.find((c: any) => c.label?.toLowerCase().includes('утас') || c.label?.toLowerCase().includes('phone'));
  const phoneValue = phoneObj?.value || '+976 7533-9966';
  const phoneUrl = phoneObj?.url || `tel:${phoneValue.replace(/[^0-9+]/g, '')}`;

  const emailObj = contacts.find((c: any) => c.label?.toLowerCase().includes('шуудан') || c.label?.toLowerCase().includes('мэйл') || c.label?.toLowerCase().includes('email'));
  const emailValue = emailObj?.value || 'info@amuulai.mn';
  const emailUrl = emailObj?.url || `mailto:${emailValue}`;

  const addressObj = contacts.find((c: any) => c.label?.toLowerCase().includes('хаяг') || c.label?.toLowerCase().includes('address'));
  const addressValue = addressObj?.value || 'Монгол улс, Улаанбаатар хот, Хан-Уул дүүрэг, 18-р хороо, Park Garden Complex, 13 давхар';
  const googleMapUrl = addressObj?.url || 'https://www.google.com/maps/place/Park+Garden+Plaza/@47.8984689,106.9101792,17z';

  // 5. Social links from Strapi contacts or setting
  const socialContacts = contacts.filter((c: any) => {
    const l = (c.label || '').toLowerCase();
    return l.includes('facebook') || l.includes('instagram') || l.includes('linkedin') || l.includes('social') || l.includes('сошиал');
  });

  // 6. Map Embed Src from Strapi /footer
  let mapEmbedSrc = "https://maps.google.com/maps?q=47.8984653,106.9127541&hl=mn&z=16&output=embed";
  if (activeFooterData?.mapEmbedCode) {
    const rawMap = activeFooterData.mapEmbedCode;
    if (rawMap.includes('src=')) {
      const match = rawMap.match(/src=["']([^"']+)["']/);
      if (match) mapEmbedSrc = match[1];
    } else if (rawMap.startsWith('http')) {
      mapEmbedSrc = rawMap;
    }
  }

  return (
    <footer 
      id="contact"
      style={{ 
        backgroundColor: 'rgb(0, 130, 157)', 
        color: '#ffffff',
        padding: '120px 0 85px 0',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* SOFTENED & BLURRED PATTERN BACKGROUND OVERLAY */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/pattern2.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '260px',
          opacity: 0.14,
          filter: 'blur(3.5px)',
          mixBlendMode: 'overlay'
        }}
      />

      <div className="relative z-10 container mx-auto px-6 max-w-[1240px]" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* MAIN FOOTER TOP GRID: LEFT (LOGO & DESCRIPTION) + RIGHT (2-COLUMN GRID FOR 4 SECTIONS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-30 items-start">
          
          {/* LEFT SIDE: LOGO + TAGLINE (5 SPANS) */}
          <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-6">
            <div className="mb-5">
              <Link href="/" className="inline-block">
                <Image 
                  src={logoUrl} 
                  alt="Amuulai Group" 
                  width={220} 
                  height={58} 
                  className="object-contain max-h-16 w-auto"
                  priority 
                />
              </Link>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-[#e2e8f0] font-normal max-w-lg">
              {description}
            </p>
          </div>

          {/* RIGHT SIDE: 2-COLUMN GRID (7 SPANS) CONTAINING 4 SECTIONS */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8 sm:gap-x-12">
            
            {/* 1. ХОЛБОО БАРИХ */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-3 tracking-wider uppercase">
                {activeFooterData?.title || 'Холбоо барих'}
              </h4>
              <ul className="space-y-3 text-sm sm:text-base text-[#e2e8f0] font-normal">
                <li>
                  <a href={phoneUrl} className="hover:text-white transition-colors">
                    {phoneValue}
                  </a>
                </li>
                <li>
                  <a href={emailUrl} className="hover:text-white transition-colors break-words">
                    {emailValue}
                  </a>
                </li>
              </ul>
            </div>

            {/* 2. МАНАЙ ХАЯГ */}
            <div className="relative">
              <h4 className="text-lg font-extrabold text-white mb-3 tracking-wider uppercase">
                Манай хаяг
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-[#e2e8f0] font-normal mb-2">
                {addressValue}
              </p>
              <div 
                className="relative inline-block"
                onMouseEnter={() => setShowMapPreview(true)}
                onMouseLeave={() => setShowMapPreview(false)}
              >
                <a 
                  href={googleMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e2e8f0] hover:text-white underline transition-colors cursor-pointer py-1"
                >
                  <span>📍 Google Map</span>
                </a>

                {/* HOVER PREVIEW POPOVER CARD */}
                {showMapPreview && (
                  <div 
                    className="absolute bottom-full left-0 mb-3 z-50 w-80 h-56 bg-white rounded-2xl p-1.5 shadow-2xl border border-slate-200 animate-fade-in pointer-events-auto"
                    style={{ filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.3))' }}
                  >
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <iframe
                        title="Google Map Location Preview"
                        src={mapEmbedSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45 border-b border-r border-slate-200" />
                  </div>
                )}
              </div>
            </div>

            {/* 3. ЦЭС (MENU) */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-3 tracking-wider uppercase">
                Цэс
              </h4>
              <ul className="space-y-3 text-sm sm:text-base text-[#e2e8f0] font-normal">
                {activeFooterItems && activeFooterItems.length > 0 ? (
                  activeFooterItems.map((item: any, idx: number) => (
                    <li key={idx}>
                      <Link 
                        href={item.url || item.href || '#'} 
                        className="hover:text-white transition-colors"
                      >
                        {item.title || item.label}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link href="/" className="hover:text-white transition-colors">
                        Нүүр хуудас
                      </Link>
                    </li>
                    <li>
                      <Link href="/about-us" className="hover:text-white transition-colors">
                        Бидний тухай
                      </Link>
                    </li>
                    <li>
                      <Link href="/brand" className="hover:text-white transition-colors">
                        Брэнд, бүтээгдэхүүн
                      </Link>
                    </li>
                    <li>
                      <Link href="/careers" className="hover:text-white transition-colors">
                        Карьер
                      </Link>
                    </li>
                    <li>
                      <Link href="/news" className="hover:text-white transition-colors">
                        Мэдээ мэдээлэл
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* 4. ХОЛБООС (SOCIAL LINKS) */}
            <div>
              <h4 className="text-lg font-extrabold text-white mb-3 tracking-wider uppercase">
                Холбоос
              </h4>
              <ul className="space-y-3 text-sm sm:text-base text-[#e2e8f0] font-normal">
                {socialContacts.length > 0 ? (
                  socialContacts.map((sc: any, idx: number) => (
                    <li key={sc.id || idx}>
                      <a 
                        href={sc.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-white transition-colors"
                      >
                        {sc.label || sc.value}
                      </a>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        LinkedIn
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="w-full pt-10 mt-12 text-center">
          <p className="text-sm text-[#e2e8f0]/90 font-medium tracking-wide">
            {copyright}
          </p>
        </div>

      </div>
    </footer>
  );
}
