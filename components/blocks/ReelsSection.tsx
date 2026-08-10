'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { getStrapiMedia } from '@/lib/api';

export interface ReelItem {
  id?: number | string;
  title?: string;
  caption?: string;
  videoUrl?: string;
  url?: string;
  link?: string;
  thumbnail?: any;
  image?: any;
  cover?: any;
}

export interface ReelsSectionProps {
  data?: {
    title?: string;
    description?: string;
    sectionTitle?: string;
    reels?: ReelItem[];
    items?: ReelItem[];
    list?: ReelItem[];
    [key: string]: any;
  };
}

// Fallback background image if user created a reel in Strapi without uploading a thumbnail image
const FALLBACK_THUMBNAILS = [
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
];

function getMediaUrl(media: any): string | null {
  if (!media) return null;
  if (typeof media === 'string') {
    if (media.startsWith('http://') || media.startsWith('https://')) {
      return media;
    }
    return getStrapiMedia(media);
  }
  const url = media.url || media.data?.attributes?.url || media.attributes?.url;
  return url ? getStrapiMedia(url) : null;
}

export default function ReelsSection({ data }: ReelsSectionProps) {
  const blockData = data?.attributes || data || {};
  const title = blockData?.title || blockData?.sectionTitle || '';
  const description = blockData?.description || blockData?.desc || '';

  const rawReels = blockData?.reels || blockData?.items || blockData?.list || blockData?.data;
  const reelsList = Array.isArray(rawReels)
    ? rawReels
    : (Array.isArray(rawReels?.data) ? rawReels.data : []);

  const visibleReels = reelsList.slice(0, 4);

  if (!data || visibleReels.length === 0) {
    return null;
  }

  return (
    <section className="section reels-section" id="reels" style={{ padding: '80px 0', background: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header Area */}
        {(title || description) && (
          <div className="section-header fade-in-up" style={{ textAlign: 'center', marginBottom: '44px' }}>
            {title && (
              <h2 className="section-title" style={{ fontSize: '32px', fontWeight: '800', color: '#111111', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                {title}
              </h2>
            )}
            {description && (
              <p style={{ maxWidth: '720px', margin: '0 auto', color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Responsive Grid of Vertical Video Cards (Max 4 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {visibleReels.map((reel: any, index: number) => {
            const reelObj = reel?.attributes || reel || {};

            const strapiThumb = getMediaUrl(reelObj.thumbnail || reelObj.image || reelObj.cover);
            const thumbnailUrl = strapiThumb || FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length];
            const videoUrl = reelObj.videoUrl || reelObj.url || reelObj.link || '#';
            const reelTitle = reelObj.title || reelObj.caption || reelObj.name || '';

            return (
              <a
                key={reel.id || index}
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={reelTitle || `Reel ${index + 1}`}
                className="group relative block w-full aspect-[9/16] rounded-3xl overflow-hidden bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/30 text-left"
              >
                {/* Background Thumbnail Image */}
                {thumbnailUrl && (
                  <Image
                    src={thumbnailUrl}
                    alt={reelTitle || `Reel ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    unoptimized={thumbnailUrl.startsWith('http')}
                  />
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />

                {/* Center Glass-morphism Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white/45 transition-all duration-300 shadow-xl">
                    <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                  </div>
                </div>

                {/* Caption / Title at bottom if present */}
                {reelTitle && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                    <p className="text-white font-medium text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-md">
                      {reelTitle}
                    </p>
                  </div>
                )}
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
