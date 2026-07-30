'use client';

import React, { useState, useRef } from 'react';

interface HeroVideoProps {
  data?: any;
  videoUrl?: string;
}

function getYouTubeEmbedSrc(rawUrl?: string): string {
  const defaultId = 'ZVm9bXzfddw';
  const defaultSrc = `https://www.youtube.com/embed/${defaultId}?autoplay=1&mute=1&loop=1&playlist=${defaultId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1`;

  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return defaultSrc;
  }

  const trimmed = rawUrl.trim();

  // If already a full embed URL from YouTube
  if (trimmed.includes('youtube.com/embed/')) {
    let src = trimmed;
    if (!src.includes('enablejsapi=1')) {
      src += (src.includes('?') ? '&' : '?') + 'enablejsapi=1';
    }
    if (!src.includes('autoplay=1')) src += '&autoplay=1';
    if (!src.includes('mute=1')) src += '&mute=1';
    return src;
  }

  // Extract 11-char video ID from watch link, youtu.be, or raw ID
  let videoId = defaultId;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    videoId = trimmed;
  } else {
    const match = trimmed.match(/(?:v=|v\/|vi\/|youtu\.be\/|embed\/|\?v=|\&v=)([^"&?\/\s]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1`;
}

export default function HeroVideo({ data, videoUrl }: HeroVideoProps) {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const rawUrl = data?.URL || data?.url || videoUrl;
  const embedSrc = getYouTubeEmbedSrc(rawUrl);

  const toggleMute = () => {
    if (iframeRef.current) {
      const command = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="hero" id="home" style={{ position: 'relative', width: '100%', height: '85vh', minHeight: '550px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
      <div className="hero-video-wrapper" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
        <iframe
          ref={iframeRef}
          src={embedSrc}
          title="Amuulai Group Hero Video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="hero-video-iframe"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100vw',
            height: '56.25vw',
            minHeight: '100%',
            minWidth: '177.78vh',
            transform: 'translate(-50%, -50%)',
            border: 0,
            pointerEvents: 'none'
          }}
        />
        <div 
          className="hero-slide-overlay" 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(135deg, rgba(0, 42, 84, 0.6) 0%, rgba(0, 61, 122, 0.4) 50%, rgba(0, 160, 227, 0.25) 100%)',
            pointerEvents: 'none'
          }} 
        />
      </div>

      {/* Mute / Unmute Toggle Button */}
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
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
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
    </section>
  );
}
