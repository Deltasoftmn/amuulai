'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  navItems?: Array<{
    id?: string | number;
    title: string;
    url: string;
    children?: any[];
  }>;
  logoUrl?: string;
  transparentOnTop?: boolean;
}

const defaultNav = [
  { title: "Бидний тухай", url: "/about-us" },
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
  { title: "Мэдээ мэдээлэл", url: "/news" },
  { title: "Холбоо барих", url: "/#contact" },
];

export default function Header({ navItems, logoUrl, transparentOnTop }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const items = navItems && navItems.length > 0 ? navItems : defaultNav;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Screen resize listener for mobile state & closing menu on desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Header is always solid on mobile; transparent only on desktop homepage top
  const isTransparent = !isMobile && (isHomePage || transparentOnTop) && !scrolled;

  const toggleSubmenu = (title: string) => {
    setExpandedItem(prev => prev === title ? null : title);
  };

  return (
    <>
      <header 
        className={`header ${scrolled || !isHomePage ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isTransparent ? 'transparent' : 'rgb(0, 130, 157)',
          backgroundImage: isTransparent ? 'none' : "url('/pattern2.png')",
          backgroundBlendMode: isTransparent ? 'normal' : 'overlay',
          borderBottom: isTransparent ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isTransparent ? 'none' : '0 8px 32px rgba(0, 130, 157, 0.25)',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="header-main flex items-center justify-between px-6 py-4 max-w-[1320px] mx-auto">
          {/* Logo */}
          <Link href="/" className="logo shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src={logoUrl || "/logo_white.png"}
              alt="Amuulai Group Logo"
              width={180}
              height={48}
              className="logo-img max-h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav max-lg:hidden">
            {items.map((item: any, idx: number) => (
              <div key={idx} className={`nav-item ${item.children && item.children.length > 0 ? 'mega-nav-item' : ''}`}>
                <Link href={item.url || item.href || '#'} className="nav-link text-white hover:text-cyan-200 font-bold transition-colors">
                  {item.title || item.label}
                  {item.children && item.children.length > 0 && (
                    <svg className="nav-chevron w-4 h-4 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="dropdown mega mega-grid bg-white rounded-2xl p-4 shadow-2xl border border-slate-100">
                    {item.children.map((child: any, cIdx: number) => (
                      <Link 
                        key={cIdx} 
                        href={child.url || child.href || '#'} 
                        className="dropdown-link flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-800 font-semibold"
                      >
                        {child.iconImg && (
                          <img 
                            src={child.iconImg} 
                            alt={child.title || child.label} 
                            style={{ maxWidth: '50px', maxHeight: '40px', objectFit: 'contain' }} 
                          />
                        )}
                        <span>{child.title || child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle lg:hidden relative z-50 p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-all focus:outline-none items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 top-[70px] z-40 bg-[#004f60] text-white flex flex-col justify-between overflow-y-auto p-6 transition-all duration-300 lg:hidden"
          style={{
            backgroundImage: "url('/pattern2.png')",
            backgroundBlendMode: 'overlay',
            boxShadow: 'inset 0 20px 30px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className="flex flex-col gap-2">

            {items.map((item: any, idx: number) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItem === item.title;

              return (
                <div key={idx} className="border-b border-white/10 py-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.url || item.href || '#'}
                      onClick={() => !hasChildren && setMobileMenuOpen(false)}
                      className="text-lg font-bold text-white hover:text-cyan-200 transition-colors py-2 flex-grow"
                    >
                      {item.title || item.label}
                    </Link>

                    {hasChildren && (
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className="p-2 text-cyan-200 hover:text-white transition-colors focus:outline-none"
                      >
                        <svg 
                          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Submenu items */}
                  {hasChildren && isExpanded && (
                    <div className="flex flex-col gap-2 pt-2 pb-3 pl-4">
                      {item.children.map((child: any, cIdx: number) => (
                        <Link
                          key={cIdx}
                          href={child.url || child.href || '#'}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/10"
                        >
                          {child.iconImg && (
                            <img 
                              src={child.iconImg} 
                              alt={child.title || child.label} 
                              className="max-h-7 max-w-[40px] object-contain shrink-0" 
                            />
                          )}
                          <span>{child.title || child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Drawer Footer Contacts */}
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-col gap-4 text-sm font-medium">
            <span className="text-xs text-cyan-200 font-extrabold uppercase tracking-widest">
              Холбоо барих
            </span>
            <a 
              href="tel:+97675339966" 
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/15"
            >
              <span className="text-lg">📞</span>
              <span>+976 7533-9966</span>
            </a>
            <a 
              href="mailto:info@amuulai.mn" 
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/15"
            >
              <span className="text-lg">✉️</span>
              <span>info@amuulai.mn</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
