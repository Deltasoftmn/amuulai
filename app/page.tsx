"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";



type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "HOME", href: "#", active: true },
  {
    label: "ABOUT US",
    href: "#about",
  },
  { label: "SUSTAINABILITY", href: "#" },
  {
    label: "PRODUCTS",
    href: "#products",
  },
  {
    label: "NEWS",
    href: "#news",
  },
  {
    label: "HUMAN RESOURCES",
    href: "#",
  },
  { label: "CONTACT US", href: "#contact" },
];

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
              <div key={item.label} className="nav-item">
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
                  <div className="dropdown">
                    {item.children.map((child) => (
                      <a key={child.label} href={child.href} className="dropdown-link">
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
            src="https://www.youtube.com/embed/ZVm9bXzfddw?autoplay=1&mute=1&loop=1&playlist=sl7PgEPB3O4&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1"
            title="Amuulai Group"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="hero-video-iframe"
          />
          <div className="hero-slide-overlay" />
        </div>
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
      <section className="stats-bar">
        <div className="stats-inner">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={49} />
              </div>
              <div className="stat-label">Number of retail branches</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={92.3} decimals={1} suffix="%" />
              </div>
              <div className="stat-label">2021-2024 sales growth</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v16M15 4v16M4 9h16M4 15h16" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={2520} />
              </div>
              <div className="stat-label">M2</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={43250} />
              </div>
              <div className="stat-label">Online shop registered users</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={390000} />
              </div>
              <div className="stat-label">Number of consumers</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="stat-number">
                <AnimatedCounter value={100} prefix="TOP " />
              </div>
              <div className="stat-label">VAT and REFUND</div>
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
          <div className="section-header fade-in-up" style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 className="section-title" style={{ fontSize: "32px", color: "#00829d", fontWeight: "700", position: "relative", display: "inline-block", paddingBottom: "15px" }}>
              Our Branch Companies
              <span style={{ content: "''", position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80px", height: "3px", background: "#0099b8" }}></span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: "700px", margin: "20px auto 0 auto", color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>
              A diversified portfolio of industry leaders, each committed to the group's core values
              of stability, prestige, and sustainable development.
            </p>
          </div>

          <div className="subsidiaries-grid fade-in-up">
            {/* Card 1: Amuulai Finance */}
            <div className="branch-card">
              <div
                className="branch-card-header"
                style={{
                  background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_0_0.png') center/cover no-repeat"
                }}
              >
                <Image
                  src="/ikigai.png"
                  alt="Ikigai Logo"
                  width={140}
                  height={60}
                  style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }}
                />
              </div>
              <div className="branch-card-body">
                <h3 className="branch-card-title">IKIGAI training and development center</h3>
                <p className="branch-card-desc">
                  We will support those who like to find and develop their IKIGAI so that everyone can live a happy life 
                </p>
                <a href="#about" className="branch-card-link">
                  more <span className="arrow">→</span>
                </a>
              </div>
            </div>

            {/* Card 2: Heritage Industrial */}
            <div className="branch-card">
              <div
                className="branch-card-header"
                style={{
                  background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_0_1.png') center/cover no-repeat"
                }}
              >
                <Image
                  src="/coz.png"
                  alt="Coz Logo"
                  width={150}
                  height={60}
                  style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }}
                />
              </div>
              <div className="branch-card-body">
                <h3 className="branch-card-title">Cosmetcs, Oriented, Zone and Laboratory</h3>
                <p className="branch-card-desc">
                  COZLAB is an exclusive skincare experience designed by combining science, innovation, and fun. We go beyond skincare
                </p>
                <a href="#about" className="branch-card-link">
                  more <span className="arrow">→</span>
                </a>
              </div>
            </div>

            {/* Card 3: Nomadic Agritech */}
            <div className="branch-card">
              <div
                className="branch-card-header"
                style={{
                  background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_0_2.png') center/cover no-repeat"
                }}
              >
                <Image
                  src="/genki.png"
                  alt="Genki Logo"
                  width={160}
                  height={60}
                  style={{ objectFit: "contain", maxHeight: "55px", maxWidth: "85%" }}
                />
              </div>
              <div className="branch-card-body">
                <h3 className="branch-card-title">Japanese drugstore</h3>
                <p className="branch-card-desc">
                  From our number of visits to Japan, we were inspired by the unique offerings of Japanese drugstores.
                </p>
                <a href="#about" className="branch-card-link">
                  more <span className="arrow">→</span>
                </a>
              </div>
            </div>

            {/* Card 4: Steppe Real Estate */}
            <div className="branch-card">
              <div
                className="branch-card-header"
                style={{
                  background: "linear-gradient(rgba(253, 242, 244, 0.88), rgba(253, 242, 244, 0.88)), url('/images/pattern_grid_1_0.png') center/cover no-repeat"
                }}
              >
                <Image
                  src="/mild.png"
                  alt="Mild Cosmetics"
                  width={150}
                  height={60}
                  style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }}
                />
              </div>
              <div className="branch-card-body">
                <h3 className="branch-card-title">Shining from outside / inside</h3>
                <p className="branch-card-desc">
                  Since our establishment, about 5,000 types of health, household, and maternity and child products for skin care, hair care, make-up, oral care, and men's cosmetics to meet the beauty, health, and household ...
                </p>
                <a href="#about" className="branch-card-link">
                  more <span className="arrow">→</span>
                </a>
              </div>
            </div>

            {/* Card 5: Eternal Blue Energy */}
            <div className="branch-card">
              <div
                className="branch-card-header"
                style={{
                  background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_1_1.png') center/cover no-repeat"
                }}
              >
                <Image
                  src="/Ton.png"
                  alt="Ton Logo"
                  width={150}
                  height={60}
                  style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }}
                />
              </div>
              <div className="branch-card-body">
                <h3 className="branch-card-title">Men's concept store</h3>
                <p className="branch-card-desc">
                  We are proud to introduce "TON 618," our new concept store at Khunnu Mall, tailorad specifically for men. 
                </p>
                <a href="#about" className="branch-card-link">
                  more <span className="arrow">→</span>
                </a>
              </div>
            </div>

            {/* Card 6: Amuulai Logistics */}
            <div className="branch-card">
              <div
                className="branch-card-header"
                style={{
                  background: "linear-gradient(rgba(240, 244, 248, 0.88), rgba(240, 244, 248, 0.88)), url('/images/pattern_grid_1_2.png') center/cover no-repeat"
                }}
              >
                <Image
                  src="/oo.png"
                  alt="Oo Logo"
                  width={140}
                  height={60}
                  style={{ objectFit: "contain", maxHeight: "65px", maxWidth: "80%" }}
                />
              </div>
              <div className="branch-card-body">
                <h3 className="branch-card-title">Handcrafts</h3>
                <p className="branch-card-desc">
                  Oeo Handicrafts LLC was founded in 2018 with the aim of developing doing it yourself at the national level. 
                </p>
                <a href="#about" className="branch-card-link">
                  more <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS SECTION ===== */}
      <section className="section section-bg" id="products">
        <div className="container">
          <div className="section-header fade-in-up">
            <div className="section-badge">Бүтээгдэхүүн</div>
            <h2 className="section-title">Манай бүтээгдэхүүнүүд</h2>
            <p className="section-subtitle">
              Дэлхийн шилдэг 50 гаруй брэндүүдийн 3500 гаруй
              бүтээгдэхүүнүүдийг Монгол орныхоо өнцөг булан бүрт хүргэж байна
            </p>
          </div>
          <div className="products-grid">
            <div className="product-card fade-in-up">
              <div className="product-card-image">
                <Image
                  src="/images/food.png"
                  alt="Хүнсний бүтээгдэхүүн"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="product-card-overlay" />
                <div className="product-card-arrow">→</div>
              </div>
              <div className="product-card-content">
                <h3>Хүнсний бүтээгдэхүүн</h3>
                <p>
                  Lay&apos;s, Cheetos, Mentos, Chupa Chups, Borjomi, Ritter
                  Sport, Magnum зэрэг
                </p>
              </div>
            </div>
            <div className="product-card fade-in-up">
              <div className="product-card-image">
                <Image
                  src="/images/household.png"
                  alt="Гэр ахуйн бүтээгдэхүүн"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="product-card-overlay" />
                <div className="product-card-arrow">→</div>
              </div>
              <div className="product-card-content">
                <h3>Гэр ахуйн бүтээгдэхүүн</h3>
                <p>
                  Dove, Vanish, Airwick, Cilit Bang, Durex, Merries, Tiret зэрэг
                </p>
              </div>
            </div>
            <div className="product-card fade-in-up">
              <div className="product-card-image">
                <Image
                  src="/images/cosmetics.png"
                  alt="Косметик бүтээгдэхүүн"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="product-card-overlay" />
                <div className="product-card-arrow">→</div>
              </div>
              <div className="product-card-content">
                <h3>Косметик бүтээгдэхүүн</h3>
                <p>
                  Nivea, Garnier, Dove, Axe, Rexona, St.Ives, Veet зэрэг
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BRANDS SECTION ===== */}
      <section className="section" id="brands">
        <div className="container">
          <div className="section-header fade-in-up">
            <div className="section-badge">Харилцагчид</div>
            <h2 className="section-title">Манай харилцагч брэндүүд</h2>
            <p className="section-subtitle">
              Дэлхийд тэргүүлэгч 25 гаруй компаниудын Монгол дахь онцгой эрхт
              дистрибъютер
            </p>
          </div>
        </div>
        <div className="brands-overflow">
          <div className="brands-track">
            {[...brands, ...brands].map((brand, index) => (
              <div key={index} className="brand-item">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWS SECTION ===== */}
      <section className="section section-bg" id="news">
        <div className="container">
          <div className="section-header fade-in-up">
            <div className="section-badge">Мэдээлэл</div>
            <h2 className="section-title">Сүүлийн мэдээ мэдээлэл</h2>
            <p className="section-subtitle">
              Amuulai Group компанийн хамгийн сүүлийн үеийн мэдээ мэдээлэл
            </p>
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
              <div className="news-card-body">
                <h4>AMUULAI BRANDS: BIC</h4>
                <p>
                  Amuulai Group компани BIC брэндийн бүтээгдэхүүнүүдийг
                  Монголын зах зээлд нийлүүлж эхэллээ.
                </p>
                <a href="#" className="news-card-link">
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
              <div className="news-card-body">
                <h4>МОНГОЛЫН ЗАХ ЗЭЭЛД АЛБАН ЁСООР НЭВТРҮҮЛЛЭЭ</h4>
                <p>
                  Шинэ брэндийн бүтээгдэхүүнүүдийг Монголын зах зээлд албан
                  ёсоор нэвтрүүлэх ёслолын арга хэмжээ амжилттай болж өндөрлөлөө.
                </p>
                <a href="#" className="news-card-link">
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
              <div className="news-card-body">
                <h4>Бүхнээс Түрүүнд — Инноацийн шинэ эрин</h4>
                <p>
                  Amuulai Group компани технологийн шинэ шийдлүүдийг нэвтрүүлж,
                  дистрибьюшн үйл ажиллагааг шинэ шатанд гаргалаа.
                </p>
                <a href="#" className="news-card-link">
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

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>MENU</h4>
              <ul>
                <li>
                  <a href="#">ABOUT US</a>
                </li>
                <li>
                  <a href="#">SUSTAINABILITY</a>
                </li>
                <li>
                  <a href="#">PRODUCTS</a>
                </li>
                <li>
                  <a href="#">NEWS</a>
                </li>
                <li>
                  <a href="#">HUMAN RESOURCES</a>
                </li>
                <li>
                  <a href="#">CONTACT US</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Us</h4>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">📍</div>
                <div className="footer-contact-text">
                  <strong>Address</strong>
                 Amuulai LLC
                 Park Garden Plaza-13 Floor,
                 18 khoroo, Khan-Uul Discrict,
                 Ulaanbaatar Mongolia
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">📞</div>
                <div className="footer-contact-text">
                  <strong>Утас</strong>
                  +976 -8611-8040
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">✉️</div>
                <div className="footer-contact-text">
                  <strong>E-Mail</strong>
                  ariunzaya@amuulai.mn
                </div>
              </div>
            </div>

            <div className="footer-col">
              <h4>Newsletter</h4>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.7,
                  marginBottom: "16px",
                }}
              >
                Манай сүүлийн үеийн мэдээ мэдээллийг авахын тулд бүртгүүлнэ үү.
              </p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Имэйл хаягаа оруулна уу"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Илгээх</button>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <span>© 2026 Amuulai Group ХХК. Бүх эрх хуулиар хамгаалагдсан.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
