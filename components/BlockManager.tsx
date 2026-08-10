import React from 'react';
import ImpactStatsBlock from './blocks/ImpactStatsBlock';
import BusinessTabsBlock from './blocks/BusinessTabsBlock';
import FeaturedBrandsBlock from './blocks/FeaturedBrandsBlock';
import FeaturedNewsBlock from './blocks/FeaturedNewsBlock';
import WhyAmuulaiBlock from './blocks/WhyAmuulaiBlock';
import OurValuesBlock from './blocks/OurValuesBlock';
import WhoAreWeBlock from './blocks/WhoAreWeBlock';
import TimelineBlock from './blocks/TimelineBlock';
import VisionMissionBlock from './blocks/VisionMissionBlock';
import TeamSectionBlock from './blocks/TeamSectionBlock';
import PartnershipSection from './blocks/PartnershipSection';
import ReelsSection from './blocks/ReelsSection';

import HeroVideo from './HeroVideo';

import CategoryShowcaseBlock from './blocks/CategoryShowcaseBlock';
import ProductCatalog from './ProductCatalog';

interface BlockManagerProps {
  blocks: Array<{
    __component: string;
    id: number;
    [key: string]: any;
  }>;
}

export default function BlockManager({ blocks }: BlockManagerProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.__component}-${block.id || index}`;
        const componentName = (block.__component || '').toLowerCase();

        if (componentName.includes('partnership')) {
          return <PartnershipSection key={key} data={block} />;
        }

        if (componentName.includes('reel')) {
          return <ReelsSection key={key} data={block} />;
        }

        switch (block.__component) {
          case 'components.products-section':
          case 'components.product-catalog-block':
          case 'blocks.product-catalog':
          case 'sections.products-catalog':
            return <ProductCatalog key={key} initialBrands={block.brands} initialProducts={block.products} categoryTitle={block.categoryName || 'Хүнс'} />;

          case 'components.product-category-block':
          case 'blocks.product-category-block':
          case 'components.category-showcase-section':
          case 'components.business-category-block':
          case 'sections.category-showcase':
          case 'blocks.category-showcase':
            return <CategoryShowcaseBlock key={key} data={block} index={index} />;
          case 'components.slider':
          case 'sections.slider':
            return <HeroVideo key={key} data={block} />;

          case 'shared.impact-section':
          case 'sections.impact-stats':
          case 'sections.stats':
            return <ImpactStatsBlock key={key} data={block} />;

          case 'components.who-are-we-section':
          case 'sections.who-are-we':
          case 'blocks.who-are-we':
          case 'components.who-are-we':
            return <WhoAreWeBlock key={key} data={block} />;

          case 'components.timeline-section':
          case 'components.timeline':
          case 'sections.timeline':
          case 'blocks.timeline':
          case 'shared.timeline':
            return <TimelineBlock key={key} data={block} />;

          case 'components.vision-mission-section':
          case 'sections.vision-mission':
          case 'blocks.vision-mission':
          case 'components.vision-mission':
            return <VisionMissionBlock key={key} data={block} />;

          case 'components.tabs-section':
          case 'sections.business-tabs':
          case 'sections.businesses':
            return <BusinessTabsBlock key={key} data={block} />;

          case 'components.brands-section':
          case 'sections.featured-brands':
          case 'sections.brands':
            return <FeaturedBrandsBlock key={key} data={block} />;

          case 'components.featured-news-section':
          case 'sections.featured-news':
          case 'sections.news':
            return <FeaturedNewsBlock key={key} data={block} />;

          case 'components.why-choose-us-section':
          case 'sections.why-choose-us':
          case 'sections.why-amuulai':
            return <WhyAmuulaiBlock key={key} data={block} />;

          case 'components.our-values-section':
          case 'sections.our-values':
            return <OurValuesBlock key={key} data={block} />;

          case 'components.team-section':
          case 'sections.team-section':
          case 'blocks.team-section':
          case 'components.team':
          case 'sections.team':
          case 'blocks.team':
            return <TeamSectionBlock key={key} data={block} />;

          case 'components.partnership-section':
          case 'sections.partnership-section':
          case 'blocks.partnership-section':
          case 'components.partnership':
          case 'sections.partnership':
          case 'blocks.partnership':
            return <PartnershipSection key={key} data={block} />;

          default:
            console.warn(`Unrecognized Strapi block component: ${block.__component}`);
            return null;
        }
      })}
    </>
  );
}
