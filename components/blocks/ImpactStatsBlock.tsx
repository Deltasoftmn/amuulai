'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/api';

interface ImpactStatsBlockProps {
  data?: any;
}

function parseNumberAndSuffix(raw: string) {
  if (!raw) return { target: 0, prefix: '', suffix: '', hasCommas: false };
  
  const hasCommas = raw.includes(',');
  const match = raw.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
  if (match) {
    const prefix = match[1] || '';
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const target = parseInt(numStr, 10);
    return { target: isNaN(target) ? 0 : target, prefix, suffix, hasCommas };
  }

  return { target: 0, prefix: '', suffix: raw, hasCommas: false };
}

function CountUpNumber({ value, suffix: rawSuffix }: { value: string; suffix?: string }) {
  const fullRawValue = `${value}${rawSuffix || ''}`;
  const { target, prefix, suffix, hasCommas } = parseNumberAndSuffix(fullRawValue);
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = domRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || target === 0) return;

    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setCurrent(Math.floor(easeProgress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, target]);

  const formattedNum = hasCommas ? current.toLocaleString() : current.toString();

  return (
    <div ref={domRef} className="stat-number" style={{ fontSize: '32px', fontWeight: '800', color: '#00829d', marginBottom: '4px' }}>
      {prefix}{formattedNum}{suffix}
    </div>
  );
}

export default function ImpactStatsBlock({ data }: ImpactStatsBlockProps) {
  const title = data?.title || data?.sectionTitle || null;
  
  const rawStats = data?.Statistics || data?.stats || [];
  
  const fetchedStats = Array.isArray(rawStats) ? rawStats.map((item: any) => {
    const iconUrl = item.icon?.url || item.icon?.data?.attributes?.url || item.iconUrl;
    return {
      label: item.label || item.title || '',
      value: item.value || item.number || '',
      suffix: item.suffix || '',
      icon: iconUrl ? getStrapiMedia(iconUrl) : null,
    };
  }).filter((item: any) => item.label || item.value) : [];

  const defaultStats = [
    { label: 'Жил Туршлага', value: '23+', suffix: '' },
    { label: 'Салбар Дэлгүүр', value: '62+', suffix: '' },
    { label: 'Нэр Төрлийн Бүтээгдэхүүн', value: '7,400+', suffix: '' },
    { label: 'Олон Улсын Брэнд', value: '50+', suffix: '' },
    { label: 'Аймгийн Хэрэглэгчид', value: '21', suffix: '' },
  ];

  const statsList = fetchedStats.length > 0 ? fetchedStats : defaultStats;

  return (
    <section className="stats-bar" style={{ paddingTop: '10px', paddingBottom: '50px', marginTop: '0', background: 'white', position: 'relative', zIndex: 30 }}>
      <div className="stats-inner">
        {title && (
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div
              className="section-badge"
              style={{
                background: 'rgba(0, 130, 157, 0.1)',
                color: '#00829d',
                padding: '8px 20px',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '10px',
              }}
            >
              {title}
            </div>
          </div>
        )}
        <div 
          className="stats-grid"
          style={{
            gridTemplateColumns: `repeat(${Math.min(statsList.length, 6)}, 1fr)`
          }}
        >
          {statsList.map((item: any, idx: number) => (
            <div key={idx} className="stat-item" style={{ textAlign: 'center', padding: '15px' }}>
              {item.icon && (
                <div style={{ width: '44px', height: '44px', margin: '0 auto 10px', position: 'relative' }}>
                  <Image src={item.icon} alt={item.label} fill style={{ objectFit: 'contain' }} />
                </div>
              )}
              <CountUpNumber value={item.value} suffix={item.suffix} />
              <div className="stat-label" style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
