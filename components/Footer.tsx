'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia, getFooterData, getSettingData } from '@/lib/api';

interface FooterProps {
  footerItems?: any[];
  footerData?: any;
  settingData?: any;
}

const defaultContacts = [
  {
    label: 'Хаяг',
    value: 'Монгол улс, Улаанбаатар хот, Хан-Уул дүүрэг, 18-р хороо, Park Garden Complex, 13 давхар',
    url: null,
    bg: 'rgba(239, 68, 68, 0.1)',
  },
  {
    label: 'Утас',
    value: '+976 7533-9966',
    url: 'tel:+97675339966',
    bg: 'rgba(0, 130, 157, 0.1)',
  },
  {
    label: 'И-мэйл',
    value: 'info@amuulai.mn',
    url: 'mailto:info@amuulai.mn',
    bg: 'rgba(168, 85, 247, 0.1)',
  },
  {
    label: 'Сошиал',
    value: 'Facebook хуудас',
    url: 'https://facebook.com',
    bg: 'rgba(59, 130, 246, 0.1)',
  },
];

function getContactIcon(labelStr?: string, iconObj?: any) {
  if (iconObj?.url) {
    return <Image src={getStrapiMedia(iconObj.url)} alt={labelStr || 'Contact'} width={22} height={22} style={{ objectFit: 'contain' }} />;
  }
  
  const l = (labelStr || '').toLowerCase();
  if (l.includes('хаяг') || l.includes('address') || l.includes('байршил')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (l.includes('утас') || l.includes('phone') || l.includes('call')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00829d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (l.includes('мэйл') || l.includes('mail') || l.includes('email')) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer({ footerItems, footerData, settingData }: FooterProps) {
  const year = new Date().getFullYear();
  const [clientFooterData, setClientFooterData] = React.useState<any>(null);
  const [clientSettingData, setClientSettingData] = React.useState<any>(null);

  React.useEffect(() => {
    if (!footerData) {
      getFooterData().then(data => setClientFooterData(data)).catch(() => {});
    }
    if (!settingData) {
      getSettingData().then(data => setClientSettingData(data)).catch(() => {});
    }
  }, [footerData, settingData]);

  const activeFooterData = footerData || clientFooterData;
  const activeSettingData = settingData || clientSettingData;

  const sectionTitle = activeFooterData?.title || 'ХОЛБОО БАРИХ';
  const sectionDesc = activeFooterData?.description || 'Бидэнтэй холбогдох эсвэл хамтын ажиллагааны талаар мэдээлэл авахыг хүсвэл...';
  
  let mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2675.2!2d106.9056!3d47.8967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9693004a31b373:0x61c1d6c70851ab6c!8m2!3d47.8984653!4d106.9127541!16s%2Fg%2F11y2hpyn4y?entry=ttu";
  if (activeFooterData?.mapEmbedCode) {
    const rawMap = activeFooterData.mapEmbedCode;
    if (rawMap.includes('src=')) {
      const match = rawMap.match(/src=["']([^"']+)["']/);
      if (match) mapSrc = match[1];
    } else if (rawMap.startsWith('http')) {
      mapSrc = rawMap;
    } else if (rawMap.startsWith('maps.google.com')) {
      mapSrc = `https://${rawMap}`;
    }
  }

  const rawContacts = activeFooterData?.contacts;
  let strapiContacts: any[] = [];
  if (Array.isArray(rawContacts)) {
    strapiContacts = rawContacts;
  } else if (rawContacts && typeof rawContacts === 'object') {
    strapiContacts = [rawContacts];
  }

  const contactsList = strapiContacts.length > 0 ? strapiContacts : defaultContacts;

  const logoUrl = activeSettingData?.mainLogo?.url 
    ? getStrapiMedia(activeSettingData.mainLogo.url) 
    : (activeSettingData?.whiteLogo?.url ? getStrapiMedia(activeSettingData.whiteLogo.url) : '/logo_white.png');
  const copyright = activeSettingData?.copyrightText || `© ${year} Амуулай Групп ХХК. Бүх эрх хуулиар хамгаалагдсан.`;

  return (
    <>
      <section 
        className="section contact-section" 
        id="contact" 
        style={{ 
          padding: '80px 0', 
          background: "linear-gradient(rgba(248, 250, 252, 0.8), rgba(248, 250, 252, 0.95)), url('/pattern.png') repeat",
          backgroundSize: '160px',
          position: 'relative'
        }}
      >
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '50px', alignItems: 'center' }}>
            
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                {sectionTitle}
              </h2>
              <div style={{ width: '45px', height: '3px', background: '#00829d', borderRadius: '2px', marginBottom: '20px' }} />
              
              {sectionDesc && (
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '35px', maxWidth: '480px' }}>
                  {sectionDesc}
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {contactsList.map((item: any, idx: number) => {
                  const label = item.label || 'Contact';
                  const value = item.value || '';
                  const url = item.url;
                  const iconElement = getContactIcon(label, item.icon);
                  const bg = item.bg || 'rgba(0, 130, 157, 0.1)';

                  return (
                    <div key={item.id || idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div 
                        style={{ 
                          width: '42px', 
                          height: '42px', 
                          borderRadius: '50%', 
                          background: bg, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0 
                        }}
                      >
                        {iconElement}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111111', marginBottom: '4px' }}>{label}</h4>
                        {url ? (
                          <a 
                            href={url} 
                            target={url.startsWith('http') ? '_blank' : undefined} 
                            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined} 
                            style={{ fontSize: '14px', color: url.startsWith('http') ? '#00829d' : '#64748b', textDecoration: 'none', fontWeight: url.startsWith('http') ? '600' : 'normal' }}
                          >
                            {value}
                          </a>
                        ) : (
                          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                minHeight: '400px', 
                borderRadius: '0 120px 0 120px', 
                overflow: 'hidden', 
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)', 
                position: 'relative' 
              }}
            >
              <iframe
                title="Google Maps Location"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <footer 
        style={{ 
          backgroundColor: '#4f6a79', 
          textAlign: 'center', 
          padding: '60px 0', 
          color: '#ffffff', 
          backgroundImage: "url('/pattern2.png')", 
          backgroundBlendMode: 'overlay' 
        }}
      >
        <div className="container" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ marginBottom: "25px", display: "flex", justifyContent: "center" }}>
            <a href="/" style={{ display: "inline-block" }}>
              <Image src={logoUrl} alt="Amuulai Group" width={180} height={48} style={{ objectFit: "contain" }} />
            </a>
          </div>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "25px", marginBottom: "25px", fontSize: "14px", fontWeight: "600" }}>
            {footerItems && footerItems.length > 0 ? (
              footerItems.map((item: any, idx: number) => (
                <Link key={idx} href={item.url || item.href || '#'} style={{ color: "#cbd5e1", textDecoration: "none" }}>
                  {item.title || item.label}
                </Link>
              ))
            ) : (
              <>
                <Link href="/#about" style={{ color: "#cbd5e1", textDecoration: "none" }}>Бидний тухай</Link>
                <Link href="/#businesses" style={{ color: "#cbd5e1", textDecoration: "none" }}>Бизнесүүд</Link>
                <Link href="/#products" style={{ color: "#cbd5e1", textDecoration: "none" }}>Брэндүүд</Link>
                <Link href="/#values" style={{ color: "#cbd5e1", textDecoration: "none" }}>Бидний үнэ цэнэ</Link>
                <Link href="/news" style={{ color: "#cbd5e1", textDecoration: "none" }}>Мэдээ мэдээлэл</Link>
                <Link href="/#contact" style={{ color: "#cbd5e1", textDecoration: "none" }}>Холбоо барих</Link>
              </>
            )}
          </div>

          <div style={{ height: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)", maxWidth: "600px", margin: "0 auto 25px" }}></div>

          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>
            {copyright}
          </p>
        </div>
      </footer>
    </>
  );
}
