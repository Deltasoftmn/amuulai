'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/lib/api';
import { CheckCircle, Briefcase, UserPlus, Users, Globe, Megaphone, Wallet, Monitor, Clock } from 'lucide-react';

interface FeatureItem {
  id?: number | string;
  text?: string;
  title?: string;
  label?: string;
  icon?: any;
}

interface CardItem {
  id?: number | string;
  mainIcon?: any;
  icon?: any;
  title?: string;
  description?: string;
  desc?: string;
  features?: FeatureItem[];
  items?: FeatureItem[];
  buttonText?: string;
  buttonUrl?: string;
  linkText?: string;
  linkUrl?: string;
}

interface PartnershipSectionProps {
  data?: {
    title?: string;
    description?: string;
    cards?: CardItem[];
    items?: CardItem[];
    list?: CardItem[];
    [key: string]: any;
  };
}

// Fallback cards matching design screenshot
const defaultCards: CardItem[] = [
  {
    id: 1,
    title: 'Бизнесийн хамтрал',
    description: "Partner with Mongolia's leading multi-category retailer. We're looking for innovative brands and suppliers who share our commitment to quality and sustainability.",
    buttonText: 'Start partnership',
    buttonUrl: '#',
    features: [
      { id: 101, text: 'Access to 9000+ customers' },
      { id: 102, text: 'Nationwide distribution network' },
      { id: 103, text: 'Marketing & brand support' },
    ],
  },
  {
    id: 2,
    title: 'Ажилд орох',
    description: "Become part of a dynamic team that's shaping the future of retail in Mongolia. We offer competitive benefits and endless opportunities for growth.",
    buttonText: 'View open positions',
    buttonUrl: '#',
    features: [
      { id: 201, text: 'Competitive salary & benefits' },
      { id: 202, text: 'Professional development programs' },
      { id: 203, text: 'Flexible work arrangements' },
    ],
  },
];

function getMediaUrl(media: any): string | null {
  if (!media) return null;
  if (typeof media === 'string') return getStrapiMedia(media);
  const url = media.url || media.data?.attributes?.url || media.attributes?.url;
  return url ? getStrapiMedia(url) : null;
}

// Helper for default main icon if none from Strapi
function renderMainIcon(cardIndex: number, mainIconUrl: string | null, title?: string) {
  if (mainIconUrl) {
    return (
      <Image
        src={mainIconUrl}
        alt={title || 'Icon'}
        width={24}
        height={24}
        className="object-contain w-6 h-6"
      />
    );
  }
  if (cardIndex === 0) {
    return <Briefcase className="w-6 h-6 text-[#111827] stroke-[2]" />;
  }
  return <UserPlus className="w-6 h-6 text-[#111827] stroke-[2]" />;
}

// Helper for feature icon (custom media or lucide-react icon with fallback to CheckCircle)
function renderFeatureIcon(featureText: string, iconUrl: string | null, index: number, cardIndex: number) {
  if (iconUrl) {
    return (
      <Image
        src={iconUrl}
        alt=""
        width={18}
        height={18}
        className="object-contain w-[18px] h-[18px] shrink-0"
      />
    );
  }

  const textLower = featureText.toLowerCase();

  if (textLower.includes('customer') || textLower.includes('access')) {
    return <Users className="w-4.5 h-4.5 text-[#00829d] shrink-0 stroke-[2]" />;
  }
  if (textLower.includes('distribution') || textLower.includes('nationwide') || textLower.includes('network')) {
    return <Globe className="w-4.5 h-4.5 text-[#00829d] shrink-0 stroke-[2]" />;
  }
  if (textLower.includes('marketing') || textLower.includes('brand')) {
    return <Megaphone className="w-4.5 h-4.5 text-[#00829d] shrink-0 stroke-[2]" />;
  }
  if (textLower.includes('salary') || textLower.includes('benefit')) {
    return <Wallet className="w-4.5 h-4.5 text-[#00829d] shrink-0 stroke-[2]" />;
  }
  if (textLower.includes('program') || textLower.includes('development') || textLower.includes('professional')) {
    return <Monitor className="w-4.5 h-4.5 text-[#00829d] shrink-0 stroke-[2]" />;
  }
  if (textLower.includes('flexible') || textLower.includes('work') || textLower.includes('arrangement')) {
    return <Clock className="w-4.5 h-4.5 text-[#00829d] shrink-0 stroke-[2]" />;
  }

  return <CheckCircle className="w-4.5 h-4.5 text-[#00829d] shrink-0 stroke-[2]" />;
}

export default function PartnershipSection({ data }: PartnershipSectionProps) {
  const blockData = data?.attributes || data || {};

  const title = blockData?.title || blockData?.sectionTitle || 'Хамтын ажиллагаа';
  const description = blockData?.description || blockData?.desc || '';

  const rawCards = blockData?.cards || blockData?.items || blockData?.list;
  const cardsList = Array.isArray(rawCards) && rawCards.length > 0 ? rawCards : defaultCards;

  return (
    <section className="section partnership-section bg-white w-full py-[72px] relative overflow-hidden" id="partnership">
      <div className="container max-w-[1240px] mx-auto px-5 sm:px-6 flex flex-col items-center justify-center gap-12">
        
        {/* Header Area - Centered */}
        {(title || description) && (
          <div className="section-header text-center flex flex-col items-center justify-center gap-3.5 max-w-[720px] mx-auto fade-in-up">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[15px] sm:text-base text-[#6b7280] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Cards Grid - Centered in middle of page */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-[1140px] mx-auto w-full justify-center items-stretch">
          {cardsList.map((card: any, cardIdx: number) => {
            const cardObj = card?.attributes || card || {};
            const defaultCard = defaultCards[cardIdx] || defaultCards[0];
            const mainIconUrl = getMediaUrl(cardObj.mainIcon || cardObj.icon);

            const cardTitle = cardObj.title || defaultCard.title;
            const cardDesc = cardObj.description || cardObj.desc || defaultCard.description;
            const buttonText = cardObj.buttonText || cardObj.linkText || defaultCard.buttonText;
            const buttonUrl = cardObj.buttonUrl || cardObj.linkUrl || defaultCard.buttonUrl || '#';

            // Extract features array directly from Strapi
            const rawFeatures = cardObj.features || cardObj.items || cardObj.featureList || cardObj.list || cardObj.data;
            const featuresArray = Array.isArray(rawFeatures)
              ? rawFeatures
              : (Array.isArray(rawFeatures?.data) ? rawFeatures.data : []);
            
            const features = featuresArray.length > 0 ? featuresArray : (defaultCard.features || []);

            const isExternal = buttonUrl.startsWith('http://') || buttonUrl.startsWith('https://');

            return (
              <div
                key={card.id || cardIdx}
                className="relative flex flex-col items-start justify-between gap-6 bg-transparent p-0 border-0 shadow-none flex-1 h-full w-full"
              >
                <div className="w-full flex flex-col items-start justify-start gap-6">
                  {/* Top rounded square icon with exact Framer/Figma token styling */}
                  <div
                    className="relative flex flex-row items-center justify-center gap-2 overflow-visible bg-[#f5f5f5] rounded-[24px] p-6! text-[#111827] shrink-0 self-start"
                    style={{ width: 'max-content', height: 'max-content' }}
                  >
                    {renderMainIcon(cardIdx, mainIconUrl, cardTitle)}
                  </div>

                  {/* Title & Description Wrapper */}
                  <div className="w-full text-left">
                    {/* Title */}
                    <h3 className="text-xl sm:text-[22px] font-bold text-[#111827] mb-2.5 tracking-tight">
                      {cardTitle}
                    </h3>

                    {/* Description */}
                    {cardDesc && (
                      <p className="text-[#6b7280] text-[14px] sm:text-[15px] leading-relaxed pt-4!">
                        {cardDesc}
                      </p>
                    )}
                  </div>

                  {/* Features List Block */}
                  {features.length > 0 && (
                    <ul className="w-full flex flex-col items-start justify-center gap-3.5 pt-1 text-left">
                      {features.map((feat: any, featIdx: number) => {
                        const featObj = feat?.attributes || feat || {};
                        const featIconUrl = getMediaUrl(featObj.icon || featObj.image || featObj.media);
                        const featText = typeof feat === 'string'
                          ? feat
                          : (featObj.text || featObj.title || featObj.name || featObj.label || '');

                        return (
                          <li
                            key={feat.id || featIdx}
                            className="flex items-center gap-3.5 text-[14px] font-medium text-[#374151]"
                          >
                            {renderFeatureIcon(featText, featIconUrl, featIdx, cardIdx)}
                            <span className="leading-snug">{featText}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Button at bottom - Full Width */}
                {buttonText && (
                  <div className="w-full pt-4 mt-auto">
                    {isExternal ? (
                      <a
                        href={buttonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-3.5 px-6 rounded-2xl bg-[#00829d] hover:bg-[#006b82] text-white font-bold text-center text-[15px] transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                        {buttonText}
                      </a>
                    ) : (
                      <Link
                        href={buttonUrl}
                        className="flex items-center justify-center w-full py-3.5 px-6 rounded-2xl bg-[#00829d] hover:bg-[#006b82] text-white font-bold text-center text-[15px] transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                        {buttonText}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
