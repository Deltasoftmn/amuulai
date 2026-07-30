"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function MildCosmetics() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".fade-in-up").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const brands = [
    "UNILEVER",
    "BEIERSDORF",
    "PERFETTI VAN MELLE",
    "PEPSICO",
    "FRITO LAY",
    "NUTRICIA",
    "L'OREAL",
    "TZMO",
    "PZ CUSSONS",
    "BORJOMI",
    "RITTER SPORT",
    "LINDT",
    "GARNIER",
    "BIC",
  ];

  const navItems = [
    { label: "Бидний тухай", href: "/#about" },
    {
      label: "Бидний бизнесүүд",
      href: "/#",
      megaType: 'grid',
      children: [
        { label: "Mild Cosmetics", href: "/mild-cosmetics", iconImg: "/mild.png" },
        { label: "Genki Drugstore", href: "/#genki", iconImg: "/genki.png" },
        { label: "OEO", href: "/#oeo", iconImg: "/oo.png" },
        { label: "Тон (Ton)", href: "/#ton", iconImg: "/Ton.png" },
        { label: "Ikigai", href: "/#ikigai", iconImg: "/ikigai.png" },
      ],
    },
    {
      label: "Брэндүүд",
      href: "/#products",
      megaType: 'wrap',
      children: brands.map(brand => ({ label: brand, href: "/#products" }))
    },
    { label: "Хамтын ажиллагаа", href: "/#partners" },
    { label: "Мэдээ мэдээлэл", href: "/news" },
    { label: "Ажиллах орчин", href: "/#" },
    { label: "Холбоо барих", href: "/#contact" },
  ];

  return (
    <>
      {/* HEADER */}
      <header className={`header ${scrolled ? "scrolled" : "scrolled"}`} style={{ backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : '#4f6a79' }}>
        <div className="header-main">
          <a href="/" className="logo">
            <Image
              src="/logo_white.png"
              alt="Amuulai Group"
              width={180}
              height={48}
              className="logo-img"
            />
          </a>
          <nav className="nav">
            {navItems.map((item) => (
              <div key={item.label} className={`nav-item ${item.megaType ? 'mega-nav-item' : ''}`}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                  {item.children && (
                    <svg className="nav-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.children && (
                  <div className={`dropdown ${item.megaType ? `mega mega-${item.megaType}` : ''}`}>
                    {item.children.map((child: any) => (
                      <Link key={child.label} href={child.href} className="dropdown-link">
                        {child.iconImg && <img src={child.iconImg} alt={child.label} style={{ maxWidth: '100%', maxHeight: '45px', objectFit: 'contain', transition: 'transform 0.3s' }} />}
                        {child.iconSvg && child.iconSvg}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ paddingTop: '120px', backgroundColor: '#fff', minHeight: '100vh', color: '#333' }}>
        <div className="container" style={{ padding: '60px 20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px' }}>

            {/* LEFT COLUMN */}
            <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <h3 style={{ fontStyle: 'italic', color: '#00a3ad', fontSize: '24px', marginBottom: '5px' }}>Shining from outside</h3>
                  <h2 style={{ fontSize: '48px', fontWeight: '800', color: '#00a3ad', letterSpacing: '-1px' }}>MILD <span style={{ fontWeight: '400', fontSize: '36px' }}>cosmetics</span></h2>
                </div>

                <div>
                  <h3 style={{ fontStyle: 'italic', color: '#00a3ad', fontSize: '24px', marginBottom: '5px' }}>Shining from inside</h3>
                  <h2 style={{ fontSize: '48px', fontWeight: '800', color: '#00a3ad', letterSpacing: '-1px' }}>MILD <span style={{ fontWeight: '400', fontSize: '36px' }}>beauty</span></h2>
                </div>
              </div>

              <div style={{ height: '2px', backgroundColor: '#e2e8f0', width: '100%', maxWidth: '200px' }}></div>

              <p style={{ fontSize: '16px', lineHeight: '1.9', color: '#555', textAlign: 'justify' }}>
                Since our establishment, about 5,000 types of health, household, and maternity and child products for skin care, hair care, make-up, oral care, and men's cosmetics to meet the beauty, health, and household needs of each member of the family have been supplying from more than 30 best-known companies in the international market with a history of more than 100 years in Japan, and more than 600,000 customers are being served through 30 branch stores in Ulaanbaatar, and 19 branch stores in 17 provinces, and through the mild.mn online store which 49 MILD brand chain stores were established according to the service standards by us.
              </p>

              {/* Chart Box */}
              <div style={{ border: '1px solid #cbe9e9', borderRadius: '4px', padding: '30px 20px', backgroundColor: '#f0fdfa' }}>
                <h4 style={{ color: '#00a3ad', fontSize: '16px', marginBottom: '40px', fontWeight: '600' }}>Growth of branch stores :</h4>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100px', paddingBottom: '30px', margin: '0 10px' }}>
                  {/* Line connecting points */}
                  <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                    <line x1="5%" y1="70%" x2="95%" y2="20%" stroke="#00a3ad" strokeWidth="3" />
                  </svg>
                  
                  {[
                    { year: '2005', count: 5, yOffset: 30 },
                    { year: '2013', count: 13, yOffset: 15 },
                    { year: '2016', count: 34, yOffset: 0 },
                    { year: '2019', count: 44, yOffset: -15 },
                    { year: '2025', count: 49, yOffset: -30 }
                  ].map((point, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative', top: `${point.yOffset}px` }}>
                      <span style={{ color: '#00a3ad', fontWeight: '800', fontSize: '18px', marginBottom: '10px' }}>{point.count}</span>
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff', border: '3px solid #00a3ad' }}></div>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" style={{ marginTop: '20px' }}>
                        <path d="M3 21h18M3 7v14M21 7v14M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h6M9 11h6M9 15h6"/>
                      </svg>
                      <span style={{ color: '#666', fontSize: '15px', marginTop: '8px', fontWeight: '500' }}>{point.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Top Large Image */}
              <div style={{ position: 'relative', width: '100%', height: '450px', overflow: 'hidden' }}>
                <Image src="/images/mild_store_front.png" alt="Mild Cosmetics Store" fill style={{ objectFit: 'cover' }} />
              </div>

              {/* Split Images and Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                
                <div style={{ position: 'relative', width: '100%', height: '350px', overflow: 'hidden' }}>
                  <Image src="/images/mild_shelf.png" alt="Products on Shelf" fill style={{ objectFit: 'cover' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                    <Image src="/images/mild_checkout.png" alt="Customer Service" fill style={{ objectFit: 'cover' }} />
                  </div>

                  <div style={{ backgroundColor: '#333f48', padding: '40px 30px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                      <span style={{ color: '#aaa', minWidth: '70px' }}>Telephone:</span>
                      <span style={{ fontWeight: '700' }}>+976 - 7533-9966</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                      <span style={{ color: '#aaa', minWidth: '70px' }}>Website:</span>
                      <span style={{ fontWeight: '700' }}>www.mild.mn</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px', alignItems: 'flex-start', marginTop: '10px' }}>
                      <span style={{ color: '#aaa', minWidth: '70px' }}>Address:</span>
                      <span style={{ fontWeight: '500', lineHeight: '1.6' }}>Mild Cosmetics LLC, 9st floor, Park Garden Plaza, Khan Uul district, 18 khoroo, Ulaanbaatar, Mongolia</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
