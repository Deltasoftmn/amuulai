import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroVideo from '@/components/HeroVideo';
import ImpactStatsBlock from '@/components/blocks/ImpactStatsBlock';
import BusinessTabsBlock from '@/components/blocks/BusinessTabsBlock';
import FeaturedBrandsBlock from '@/components/blocks/FeaturedBrandsBlock';
import WhyAmuulaiBlock from '@/components/blocks/WhyAmuulaiBlock';
import OurValuesBlock from '@/components/blocks/OurValuesBlock';
import FeaturedNewsBlock from '@/components/blocks/FeaturedNewsBlock';
import PartnershipSection from '@/components/blocks/PartnershipSection';
import ReelsSection from '@/components/blocks/ReelsSection';
import { getHomePageData, getNavMenu, getFooterMenu, getNewsArticles, getFooterData, getSettingData, getStrapiMedia } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const blocks = await getHomePageData();
  const navItems = await getNavMenu();
  const footerItems = await getFooterMenu();
  const footerData = await getFooterData();
  const settingData = await getSettingData();
  const articles = await getNewsArticles(3);

  const logoUrl = settingData?.mainLogo?.url 
    ? getStrapiMedia(settingData.mainLogo.url) 
    : (settingData?.whiteLogo?.url ? getStrapiMedia(settingData.whiteLogo.url) : undefined);

  // Find specific Strapi blocks by component name
  const sliderBlock = Array.isArray(blocks) ? blocks.find((b: any) => b.__component === 'components.slider' || b.__component === 'sections.slider') : null;
  const impactBlock = Array.isArray(blocks) ? blocks.find((b: any) => b.__component === 'shared.impact-section' || b.__component === 'sections.stats') : null;
  const tabsBlock = Array.isArray(blocks) ? blocks.find((b: any) => b.__component === 'components.tabs-section' || b.__component === 'sections.businesses') : null;
  const brandsBlock = Array.isArray(blocks) ? blocks.find((b: any) => b.__component === 'components.brands-section' || b.__component === 'sections.brands') : null;
  const whyBlock = Array.isArray(blocks) ? blocks.find((b: any) => b.__component === 'components.why-choose-us-section' || b.__component === 'sections.why-choose-us') : null;
  const valuesBlock = Array.isArray(blocks) ? blocks.find((b: any) => b.__component === 'components.our-values-section' || b.__component === 'sections.our-values') : null;
  const newsBlock = Array.isArray(blocks) ? blocks.find((b: any) => b.__component === 'components.featured-news-section' || b.__component === 'sections.news') : null;
  const partnershipBlock = Array.isArray(blocks) ? blocks.find((b: any) => (b.__component || '').toLowerCase().includes('partnership')) : null;
  const reelsBlock = Array.isArray(blocks) ? blocks.find((b: any) => (b.__component || '').toLowerCase().includes('reel')) : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header navItems={navItems} logoUrl={logoUrl} />
      <HeroVideo data={sliderBlock} />

      {/* Render all original rich sections in sequence, passing Strapi data */}
      <ImpactStatsBlock data={impactBlock} />
      <BusinessTabsBlock data={tabsBlock} />
      <FeaturedBrandsBlock data={brandsBlock} />
      <WhyAmuulaiBlock data={whyBlock} />
      <OurValuesBlock data={valuesBlock} />
      <FeaturedNewsBlock data={newsBlock} articles={articles} />
      <PartnershipSection data={partnershipBlock} />
      <ReelsSection data={reelsBlock} />

      <Footer footerItems={footerItems} footerData={footerData} settingData={settingData} />
    </div>
  );
}
