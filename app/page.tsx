"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";



type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  megaType?: 'grid' | 'wrap';
  children?: { label: string; href: string; iconSvg?: React.ReactNode; iconImg?: string }[];
};
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

const navItems: NavItem[] = [
  {
    label: "Бидний тухай",
    href: "#about",
  },
  { 
    label: "Бидний бизнесүүд", 
    href: "#",
    megaType: 'grid',
    children: [
      { label: "Mild Cosmetics", href: "/mild-cosmetics", iconImg: "/mild.png" },
      { label: "Genki Drugstore", href: "/#genki", iconImg: "/genki.png" },
      { label: "OEO", href: "/#oeo", iconImg: "/oo.png" },
      { label: "Тон (Ton)", href: "/#ton", iconImg: "/Ton.png" },
      { label: "Ikigai", href: "/#ikigai", iconImg: "/ikigai.png" },
    ]
  },
  {
    label: "Брэндүүд",
    href: "#products",
    megaType: 'wrap',
    children: brands.map(brand => ({ label: brand, href: "/#products" }))
  },
    {
    label: "Хамтын ажиллагаа",
    href: "#partners",
  },
  {
    label: "Мэдээ мэдээлэл",
    href: "#news",
  },
  {
    label: "Ажиллах орчин",
    href: "#",
  },
  { label: "Холбоо барих", href: "#contact" },
];

function AnimatedCounter({ 
  value, 
  duration = 2000, 
  decimals = 0, 
  prefix = "", 
  suffix = "" 
}: { 
  value: number; 
  duration?: number; 
  decimals?: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
      observer.disconnect();
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentVal = easedProgress * value;
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [hasStarted, value, duration]);

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    const rounded = num.toFixed(decimals);
    const parts = rounded.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  return (
    <span ref={elementRef}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<'consumer' | 'distribution'>('consumer');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleMute = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Browsers block autoplay if mute=0. Force play on first user interaction:
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*'
      );
      const command = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsMuted(!isMuted);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
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

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-main">
          <a href="#" className="logo">
            <Image
              src={scrolled ? "/logo_white.png" : "/logo_white.png"}
              alt="Amuulai Group"
              width={180}
              height={48}
              className="logo-img"
            />
          </a>
          <nav className="nav">
            {navItems.map((item) => (
              <div key={item.label} className={`nav-item ${item.megaType ? 'mega-nav-item' : ''}`}>
                <a
                  href={item.href}
                  className={`nav-link ${item.active ? "active" : ""}`}
                >
                  {item.label}
                  {item.children && (
                    <svg
                      className="nav-chevron"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </a>
                {item.children && (
                  <div className={`dropdown ${item.megaType ? `mega mega-${item.megaType}` : ''}`}>
                    {item.children.map((child) => (
                      <a key={child.label} href={child.href} className="dropdown-link">
                        {child.iconImg && <img src={child.iconImg} alt={child.label} style={{ maxWidth: '100%', maxHeight: '45px', objectFit: 'contain', transition: 'transform 0.3s' }} />}
                        {child.iconSvg && child.iconSvg}
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <button className="mobile-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* ===== HERO VIDEO ===== */}
      <section className="hero" id="home">
        <div className="hero-video-wrapper">
          <iframe
            ref={iframeRef}
            src="https://www.youtube.com/embed/ZVm9bXzfddw?autoplay=1&mute=1&loop=1&playlist=sl7PgEPB3O4&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1"
            title="Amuulai Group"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="hero-video-iframe"
          />
          <div className="hero-slide-overlay" />
        </div>
        <button 
          onClick={toggleMute} 
          className="mute-btn"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
        {/* <div className="hero-content">
          <div className="hero-tagline">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Бүхнээс Түрүүнд
          </div>
          <h1 className="hero-title">
            Бид байнга өөрчлөгдөж буй бизнесийн орчинд{" "}
            <span className="highlight">БҮХНЭЭС ТҮРҮҮНД</span> өөрчлөгдөнө
          </h1>
          <p className="hero-description">
            Бид технологи, мэдлэг, инноациар бүхнээс түрүүнд байх болно.
          </p>
          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">
              Бидний тухай
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#products" className="btn btn-outline">
              Бүтээгдэхүүн үзэх
            </a>
          </div>
        </div> */}
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="stats-bar" style={{ paddingTop: '80px', marginTop: '0' }}>
        <div className="stats-inner">
          <div className="section-header fade-in-up" style={{ textAlign: "center", marginBottom: "40px" }}>
            <div className="section-badge" style={{ background: 'rgba(0, 130, 157, 0.1)', color: '#00829d', padding: '6px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }}>
              Бидний нөлөө
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={24} suffix="+" />
              </div>
              <div className="stat-label">жил Туршлага</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={62} suffix="+" />
              </div>
              <div className="stat-label">Салбар дэлгүүр</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={21} />
              </div>
              <div className="stat-label">аймагт хүрсэн үйлчилгээ</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={50} suffix="+" />
              </div>
              <div className="stat-label">Олон улсын брэнд</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={7400} suffix="+" />
              </div>
              <div className="stat-label">Бүтээгдэхүүн</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={450000} suffix="+" />
              </div>
              <div className="stat-label">Хэрэглэгч</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUBSIDIARY GRID SECTION ===== */}
      <section
        className="section"
        id="about"
        style={{
          background: "linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url('/pattern2.png') repeat",
          backgroundSize: "auto"
        }}
      >
        <div className="container">
          <div className="section-header fade-in-up" style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 className="section-title" style={{ fontSize: "32px", color: "#00829d", fontWeight: "700", position: "relative", display: "inline-block", paddingBottom: "15px", textTransform: 'uppercase' }}>
              Амуулай групп
              <span style={{ content: "''", position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80px", height: "3px", background: "#0099b8" }}></span>
            </h2>
          </div>

          <div className="fade-in-up" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('consumer')}
              style={{
                padding: '12px 30px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: activeTab === 'consumer' ? '#00829d' : '#f0f4f8',
                color: activeTab === 'consumer' ? '#fff' : '#555',
                boxShadow: activeTab === 'consumer' ? '0 4px 15px rgba(0, 130, 157, 0.3)' : 'none'
              }}
            >
              Consumer Businesses
            </button>
            <button 
              onClick={() => setActiveTab('distribution')}
              style={{
                padding: '12px 30px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: activeTab === 'distribution' ? '#00829d' : '#f0f4f8',
                color: activeTab === 'distribution' ? '#fff' : '#555',
                boxShadow: activeTab === 'distribution' ? '0 4px 15px rgba(0, 130, 157, 0.3)' : 'none'
              }}
            >
              Distribution & Services
            </button>
          </div>

          {activeTab === 'consumer' && (
            <div className="subsidiaries-grid" style={{ opacity: 1, transform: 'none' }}>
              {/* Mild Cosmetics */}
              <div className="branch-card">
                <div className="branch-card-header" style={{ background: "linear-gradient(rgba(253, 242, 244, 0.88), rgba(253, 242, 244, 0.88)), url('/images/pattern_grid_1_0.png') center/cover no-repeat" }}>
                  <Image src="/mild.png" alt="Mild Cosmetics" width={150} height={60} style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }} />
                </div>
                <div className="branch-card-body">
                  <h3 className="branch-card-title">Mild Cosmetics</h3>
                  <p className="branch-card-desc">Японы гоо сайхан, арьс арчилгааны сүлжээ дэлгүүр</p>
                  <a href="/mild-cosmetics" className="branch-card-link">more <span className="arrow">→</span></a>
                </div>
              </div>

              {/* Genki Drugstore */}
              <div className="branch-card">
                <div className="branch-card-header" style={{ background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_0_2.png') center/cover no-repeat" }}>
                  <Image src="/genki.png" alt="Genki Drugstore" width={160} height={60} style={{ objectFit: "contain", maxHeight: "55px", maxWidth: "85%" }} />
                </div>
                <div className="branch-card-body">
                  <h3 className="branch-card-title">Genki Drugstore</h3>
                  <p className="branch-card-desc">Япон гэр ахуй, хүнс, эрүүл мэндийн бүтээгдэхүүний сүлжээ</p>
                  <a href="#about" className="branch-card-link">more <span className="arrow">→</span></a>
                </div>
              </div>

              {/* OEO */}
              <div className="branch-card">
                <div className="branch-card-header" style={{ background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_1_2.png') center/cover no-repeat" }}>
                  <Image src="/oo.png" alt="OEO" width={140} height={60} style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }} />
                </div>
                <div className="branch-card-body">
                  <h3 className="branch-card-title">OEO</h3>
                  <p className="branch-card-desc">Гар урлал, бүтээлч хоббиг дэмжигч төрөлжсөн дэлгүүр</p>
                  <a href="#about" className="branch-card-link">more <span className="arrow">→</span></a>
                </div>
              </div>

              {/* TON618 */}
              <div className="branch-card">
                <div className="branch-card-header" style={{ background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_1_1.png') center/cover no-repeat" }}>
                  <Image src="/Ton.png" alt="TON618" width={150} height={60} style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }} />
                </div>
                <div className="branch-card-body">
                  <h3 className="branch-card-title">TON618</h3>
                  <p className="branch-card-desc">Эрэгтэй хэрэглэгчдэд зориулсан концепц дэлгүүр</p>
                  <a href="#about" className="branch-card-link">more <span className="arrow">→</span></a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="subsidiaries-grid" style={{ opacity: 1, transform: 'none' }}>
              {/* AMUULAI Distribution */}
              <div className="branch-card">
                <div className="branch-card-header" style={{ background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_0_0.png') center/cover no-repeat" }}>
                  <Image src="/logo.png" alt="AMUULAI Distribution" width={150} height={60} style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }} />
                </div>
                <div className="branch-card-body">
                  <h3 className="branch-card-title">AMUULAI Distribution</h3>
                  <p className="branch-card-desc">Импорт, түгээлт, нийлүүлэлтийн нэгдсэн үйл ажиллагаа</p>
                  <a href="#about" className="branch-card-link">more <span className="arrow">→</span></a>
                </div>
              </div>

              {/* COZLAB */}
              <div className="branch-card">
                <div className="branch-card-header" style={{ background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_0_1.png') center/cover no-repeat" }}>
                  <Image src="/coz.png" alt="COZLAB" width={150} height={60} style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }} />
                </div>
                <div className="branch-card-body">
                  <h3 className="branch-card-title">COZLAB</h3>
                  <p className="branch-card-desc">Гоо сайхны туршлага, үйлчилгээ, инновацын төв</p>
                  <a href="#about" className="branch-card-link">more <span className="arrow">→</span></a>
                </div>
              </div>

              {/* IKIGAI */}
              <div className="branch-card">
                <div className="branch-card-header" style={{ background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_0_0.png') center/cover no-repeat" }}>
                  <Image src="/ikigai.png" alt="IKIGAI" width={140} height={60} style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }} />
                </div>
                <div className="branch-card-body">
                  <h3 className="branch-card-title">IKIGAI</h3>
                  <p className="branch-card-desc">Сургалт, хүний хөгжил, байгууллагын хөгжлийн төв</p>
                  <a href="#about" className="branch-card-link">more <span className="arrow">→</span></a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== PREMIUM FEATURED BRANDS GRID ===== */}
      <section className="section" style={{ padding: '80px 0', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
        <div className="container">
          <div className="section-header fade-in-up" style={{ textAlign: "center", marginBottom: "50px" }}>
            <div className="section-badge" style={{ background: 'rgba(0, 130, 157, 0.1)', color: '#00829d', padding: '6px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>Брэндүүд</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            {[
              { id: 0, title: "KOSE COSMEPORT", extra: 9 },
              { id: 1, title: "KRACIE", extra: 4 },
              { id: 2, title: "SUNSTAR", extra: 0 },
              { id: 3, title: "MEISHOKU", extra: 6 },
              { id: 4, title: "BCL", extra: 5 },
              { id: 5, title: "FEATURED BRAND", extra: 20 }
            ].map((brand, i) => (
              <div key={brand.id} className="premium-brand-card fade-in-up" style={{ 
                background: '#fff',
                borderRadius: '24px',
                padding: '30px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0,0,0,0.03)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: `${i * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 130, 157, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.04)';
              }}
              >
                {/* Decorative top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #00829d, #00c6e0)' }}></div>
                
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#111', marginBottom: '20px', textAlign: 'center', letterSpacing: '0.5px' }}>
                  {brand.title}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', flexGrow: 1 }}>
                  {[0, 1, 2, 3].map((subId) => (
                    <div key={subId} style={{ 
                      background: '#f8fafc', 
                      borderRadius: '12px', 
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '80px',
                      border: '1px solid #f1f5f9',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                    >
                      <Image 
                        src={`/images/brands/brand_${brand.id}_${subId}.png`} 
                        alt="Brand Logo" 
                        width={100} 
                        height={60} 
                        style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', mixBlendMode: 'darken' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                  {brand.extra > 0 ? (
                    <span style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                      +{brand.extra} brands
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <a href="#" style={{ color: '#00829d', fontSize: '14px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    View details <span style={{ fontSize: '16px' }}>&rarr;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <a href="#" style={{ 
              display: 'inline-block',
              background: '#111', 
              color: '#fff', 
              padding: '15px 40px', 
              borderRadius: '30px', 
              fontSize: '16px', 
              fontWeight: '700', 
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#00829d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#111'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Дэлгэрэнгүй танилцах
            </a>
          </div>
        </div>
      </section>

      {/* ===== WHY AMUULAI GROUP SECTION ===== */}
      <section className="section why-amuulai-section" style={{ padding: '100px 0', background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header fade-in-up" style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-badge" style={{ background: 'rgba(0, 130, 157, 0.1)', color: '#00829d', padding: '6px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
              Таатай орчин
            </div>
            <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '800', color: '#111', marginBottom: '20px' }}>
              Яагаад Амуулай групп гэж?
            </h2>
            <p style={{ maxWidth: '700px', margin: '0 auto', color: '#64748b', fontSize: '18px', lineHeight: '1.6' }}>
              Бид ажилтнуудынхаа тав тухтай, бүтээлчээр ажиллах орчныг бүрдүүлэхийн зэрэгцээ тэдний хувь хүний болон мэргэжлийн өсөлт хөгжилтийг байнга дэмжихийг зорьдог.
            </p>
          </div>

          {/* Main Large Image */}
          <div className="fade-in-up" style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: '50px' }}>
            <Image 
              src="/images/why_amuulai_main.png" 
              alt="Amuulai Group Corporate Environment" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </div>

          {/* Advantages Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {[
              {
                id: 'growth',
                icon: '/images/icon_growth.png',
                title: 'Өсөлт хөгжил',
                desc: 'Мэргэжлийн өндөр түвшинд тасралтгүй суралцаж, карьераа өсгөх бодит боломжууд.'
              },
              {
                id: 'teamwork',
                icon: '/images/icon_teamwork.png',
                title: 'Хамтын ажиллагаа',
                desc: 'Нээлттэй, эрч хүчтэй залуу баг хамт олонтойгоор нэг зорилгын төлөө нэгдэн ажиллах.'
              },
              {
                id: 'environment',
                icon: '/images/icon_environment.png',
                title: 'Таатай орчин',
                desc: 'Орчин үеийн шийдэл бүхий, стрессгүй, бүтээлч байдлыг дэмжсэн тохилог оффис.'
              },
              {
                id: 'benefits',
                icon: '/images/icon_benefits.png',
                title: 'Урамшуулал',
                desc: 'Ажилтны эрүүл мэнд болон нийгмийн баталгааг хангасан уян хатан урамшууллын систем.'
              }
            ].map((adv, i) => (
              <div key={adv.id} className="fade-in-up" style={{ 
                background: '#fff', 
                borderRadius: '20px', 
                padding: '30px', 
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                animationDelay: `${i * 0.15}s`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 130, 157, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
              }}
              >
                <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', position: 'relative' }}>
                  <Image src={adv.icon} alt={adv.title} fill style={{ objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '12px' }}>{adv.title}</h3>
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.5' }}>{adv.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== OUR VALUES SECTION ===== */}
      <section className="section" id="values" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'row', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Left side: Beautiful image */}
            <div className="fade-in-up" style={{ flex: '1 1 400px', position: 'relative', minHeight: '550px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
              <Image 
                src="/images/corporate_team.png" 
                alt="Our Values" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,130,157,0.4), transparent)' }}></div>
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: '#fff' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Бидний тухай</h3>
                <p style={{ fontSize: '16px', opacity: 0.9 }}>Урт хугацааны хамтын ажиллагаа, ил тод байдал.</p>
              </div>
            </div>

            {/* Right side: Values grid */}
            <div style={{ flex: '1 1 500px' }}>
              <div className="fade-in-up" style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "32px", color: "#111", fontWeight: "800", position: "relative", display: "inline-block", paddingBottom: "15px", textTransform: 'uppercase' }}>
                  БИДНИЙ ҮНЭ ЦЭНЭ
                  <span style={{ content: "''", position: "absolute", bottom: 0, left: 0, width: "60px", height: "4px", background: "#00829d", borderRadius: '2px' }}></span>
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px 30px' }}>
                
                {[
                  {
                    title: "Итгэлцэл",
                    desc: "Урт хугацааны хамтын ажиллагаа болон ил тод харилцаа.",
                    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6M20 10.4c-.5.4-1.2.6-1.8.6h-1c-.9 0-1.7-.5-2.2-1.2l-.7-1.1c-.5-.7-1.3-1.2-2.2-1.2H8c-.8 0-1.6.3-2.1.8l-1.3 1.3c-1.3 1.3-1.6 3.2-.8 4.8.8 1.5 2.4 2.5 4.1 2.5h.3c.6 0 1.2-.2 1.7-.6l2-1.6M14 6l1.3-1.3c1.3-1.3 3.2-1.6 4.8-.8 1.5.8 2.5 2.4 2.5 4.1v.3c0 .6-.2 1.2-.6 1.7l-1.6 2c-.4.5-1 .7-1.6.7h-1c-.9 0-1.7.5-2.2 1.2l-.7 1.1c-.5.7-1.3 1.2-2.2 1.2H8" /></svg>
                  },
                  {
                    title: "Чанар",
                    desc: "Албан ёсны чанартай бүтээгдэхүүн үйлчилгээ.",
                    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  },
                  {
                    title: "Инноваци",
                    desc: "Шинэ санаа, шинэ шийдлийг үргэлж эрэлхийлнэ.",
                    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                  },
                  {
                    title: "Хэрэглэгч төвтэй",
                    desc: "Хэрэглэгчийн хэрэгцээг нэгдүгээрт тавина.",
                    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                  },
                  {
                    title: "Хариуцлага",
                    desc: "Нийгэм, түншүүд болон байгаль орчны өмнө хариуцлагатай.",
                    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                  },
                  {
                    title: "Хөгжил",
                    desc: "Хүмүүс, брэнд, бизнесийн тогтвортой хөгжлийг дэмжинэ.",
                    icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 3.82-13.01 1 1 0 0 1 1.63 0A22 22 0 0 1 20 14a1 1 0 0 1-1.63 0" /><path d="m9 15 3 3a22 22 0 0 0 13.01-3.82 1 1 0 0 0 0-1.63A22 22 0 0 0 10 4a1 1 0 0 0 0 1.63" /></svg>
                  }
                ].map((val, idx) => (
                  <div key={idx} className="fade-in-up" style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    animationDelay: `${idx * 0.1}s`,
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget.querySelector('.val-icon') as HTMLElement).style.color = '#00829d';
                    (e.currentTarget.querySelector('.val-title') as HTMLElement).style.color = '#00829d';
                    (e.currentTarget.querySelector('.val-icon') as HTMLElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget.querySelector('.val-icon') as HTMLElement).style.color = '#777';
                    (e.currentTarget.querySelector('.val-title') as HTMLElement).style.color = '#111';
                    (e.currentTarget.querySelector('.val-icon') as HTMLElement).style.transform = 'translateY(0)';
                  }}
                  >
                    <div className="val-icon" style={{ color: '#777', transition: 'all 0.3s ease', marginBottom: '15px', display: 'inline-block' }}>
                      {val.icon}
                    </div>
                    <h4 className="val-title" style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '10px', transition: 'color 0.3s ease' }}>
                      {val.title}
                    </h4>
                    <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== NEWS SECTION ===== */}
      <section className="section section-bg" id="news">
        <div className="container">
          <div className="section-header fade-in-up">
            <div className="section-badge">Үйл ажиллагааны мэдээлэл</div>
            <h2 className="section-title">Мэдээ мэдээлэл</h2>
          </div>
          <div className="news-grid">
            <div className="news-card fade-in-up">
              <div className="news-card-image">
                <Image
                  src="/images/hero2.png"
                  alt="AMUULAI BRANDS: BIC"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="news-card-date">2026.06.30</div>
              </div>
              <div className="news-card-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h4>AMUULAI BRANDS: BIC</h4>
                <p>
                  Amuulai Group компани BIC брэндийн бүтээгдэхүүнүүдийг
                  Монголын зах зээлд нийлүүлж эхэллээ.
                </p>
                <a href="#" className="news-card-link" style={{ marginTop: 'auto' }}>
                  Дэлгэрэнгүй
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="news-card fade-in-up">
              <div className="news-card-image">
                <Image
                  src="/images/hero3.png"
                  alt="Монголын зах зээлд нэвтрүүллээ"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="news-card-date">2026.06.29</div>
              </div>
              <div className="news-card-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h4>МОНГОЛЫН ЗАХ ЗЭЭЛД АЛБАН ЁСООР НЭВТРҮҮЛЛЭЭ</h4>
                <p>
                  Шинэ брэндийн бүтээгдэхүүнүүдийг Монголын зах зээлд албан
                  ёсоор нэвтрүүлэх ёслолын арга хэмжээ амжилттай болж өндөрлөлөө.
                </p>
                <a href="#" className="news-card-link" style={{ marginTop: 'auto' }}>
                  Дэлгэрэнгүй
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="news-card fade-in-up">
              <div className="news-card-image">
                <Image
                  src="/images/hero1.png"
                  alt="Бүхнээс Түрүүнд"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="news-card-date">2026.06.25</div>
              </div>
              <div className="news-card-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h4>Бүхнээс Түрүүнд — Инноацийн шинэ эрин</h4>
                <p>
                  Amuulai Group компани технологийн шинэ шийдлүүдийг нэвтрүүлж,
                  харилцагчдадаа илүү ойртох боломжийг бүрдүүлж байна.
                </p>
                <a href="#" className="news-card-link" style={{ marginTop: 'auto' }}>
                  Дэлгэрэнгүй
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="section" id="contact-info" style={{ padding: '80px 0', background: "linear-gradient(rgba(248, 250, 252, 0.8), rgba(248, 250, 252, 0.95)), url('/pattern.png') repeat", backgroundSize: '160px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px', alignItems: 'center' }}>
            
            {/* Left: Contact Info */}
            <div className="fade-in-up">
              <h2 style={{ fontSize: "32px", color: "#111", fontWeight: "800", position: "relative", display: "inline-block", paddingBottom: "15px", marginBottom: "20px", textTransform: 'uppercase' }}>
                ХОЛБОО БАРИХ
                <span style={{ content: "''", position: "absolute", bottom: 0, left: 0, width: "60px", height: "4px", background: "#00829d", borderRadius: '2px' }}></span>
              </h2>
              <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', marginBottom: '40px', maxWidth: '400px' }}>
                Бидэнтэй холбогдох эсвэл хамтын ажиллагааны талаар мэдээлэл авахыг хүсвэл...
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {/* Location */}
                <a href="https://www.google.com/maps/place/Park+Garden+Plaza/@47.8984689,106.9101792,17z/data=!3m1!4b1!4m6!3m5!1s0x5d9693004a31b373:0x61c1d6c70851ab6c!8m2!3d47.8984653!4d106.9127541!16s%2Fg%2F11y2hpyn4y?entry=ttu" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '15px', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '5px' }}>Хаяг</h4>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>Монгол улс, Улаанбаатар хот, Хан-Уул дүүрэг,<br/>18-р хороо, Park Garden Complex, 13 давхар</p>
                  </div>
                </a>

                {/* Phone */}
                <a href="tel:+97675339966" style={{ display: 'flex', gap: '15px', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '5px' }}>Утас</h4>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>+976 7533-9966</p>
                  </div>
                </a>

                {/* Email */}
                <a href="mailto:info@amuulai.mn" style={{ display: 'flex', gap: '15px', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '5px' }}>И-мэйл</h4>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>info@amuulai.mn</p>
                  </div>
                </a>

                {/* Social */}
                <a href="https://www.facebook.com/profile.php?id=100089466846922" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '15px', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b5998', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '5px' }}>Сошиал</h4>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>Facebook хуудас</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Map Embed */}
            <div className="fade-in-up" style={{ height: '100%', minHeight: '400px', borderRadius: '0 120px 0 120px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', position: 'relative' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.3315923186835!2d106.91017917616147!3d47.89846887121966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9693004a31b373%3A0x61c1d6c70851ab6c!2sPark%20Garden%20Plaza!5e0!3m2!1sen!2smn!4v1711234567890!5m2!1sen!2smn" 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="contact" style={{ backgroundColor: "#4f6a79", textAlign: "center", padding: "60px 0", color: "#ffffff", backgroundImage: "url('/pattern2.png')", backgroundBlendMode: "overlay" }}>
        <div className="container">
          <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center" }}>
            <Image src="/logo_white.png" alt="Amuulai Group" width={180} height={48} style={{ objectFit: "contain" }} />
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px", marginBottom: "30px", fontSize: "14px", textTransform: "uppercase", fontWeight: "600" }}>
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                style={{ color: "#ffffff", textDecoration: "none", opacity: 0.8, transition: "opacity 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div style={{ height: "1px", backgroundColor: "rgba(255, 255, 255, 0.1)", maxWidth: "600px", margin: "0 auto 30px" }}></div>

          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
            © 2026 Амуулай Групп
          </p>
        </div>
      </footer>
    </>
  );
}
