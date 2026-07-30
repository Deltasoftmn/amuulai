'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  navItems?: Array<{
    id?: string | number;
    title: string;
    url: string;
    children?: any[];
  }>;
  logoUrl?: string;
}

const defaultNav = [
  { title: "Бидний тухай", url: "/#about" },
  { 
    title: "Бидний бизнесүүд", 
    url: "/#businesses",
    children: [
      { title: "Mild Cosmetics", url: "/businesses/mild-cosmetics", iconImg: "/mild.png" },
      { title: "Genki Drugstore", url: "/businesses/genki-drugstore", iconImg: "/genki.png" },
      { title: "OEO", url: "/businesses/oeo", iconImg: "/oo.png" },
      { title: "Тон (Ton)", url: "/businesses/ton", iconImg: "/Ton.png" },
      { title: "Ikigai", url: "/businesses/ikigai", iconImg: "/ikigai.png" },
    ]
  },
  { title: "Брэндүүд", url: "/#products" },
  { title: "Хамтын ажиллагаа", url: "/#partners" },
  { title: "Мэдээ мэдээлэл", url: "/#news" },
  { title: "Холбоо барих", url: "/#contact" },
];

export default function Header({ navItems, logoUrl }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const items = navItems && navItems.length > 0 ? navItems : defaultNav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-main">
        <a href="/" className="logo">
          <Image
            src={logoUrl || "/logo_white.png"}
            alt="Amuulai Group Logo"
            width={180}
            height={48}
            className="logo-img"
          />
        </a>
        <nav className="nav">
          {items.map((item: any, idx: number) => (
            <div key={idx} className={`nav-item ${item.children && item.children.length > 0 ? 'mega-nav-item' : ''}`}>
              <Link href={item.url || item.href || '#'} className="nav-link">
                {item.title || item.label}
                {item.children && item.children.length > 0 && (
                  <svg className="nav-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
              {item.children && item.children.length > 0 && (
                <div className="dropdown mega mega-grid">
                  {item.children.map((child: any, cIdx: number) => (
                    <Link key={cIdx} href={child.url || child.href || '#'} className="dropdown-link">
                      {child.iconImg && <img src={child.iconImg} alt={child.title || child.label} style={{ maxWidth: '100%', maxHeight: '45px', objectFit: 'contain', transition: 'transform 0.3s' }} />}
                      {child.title || child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <button className="mobile-toggle" aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
