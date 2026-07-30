import React from 'react';
import ImpactStatsBlock from './blocks/ImpactStatsBlock';
import BusinessTabsBlock from './blocks/BusinessTabsBlock';
import FeaturedBrandsBlock from './blocks/FeaturedBrandsBlock';
import FeaturedNewsBlock from './blocks/FeaturedNewsBlock';
import WhyAmuulaiBlock from './blocks/WhyAmuulaiBlock';
import OurValuesBlock from './blocks/OurValuesBlock';

import HeroVideo from './HeroVideo';

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

        switch (block.__component) {
          case 'components.slider':
          case 'sections.slider':
            return <HeroVideo key={key} data={block} />;

          case 'shared.impact-section':
          case 'sections.impact-stats':
          case 'sections.stats':
            return <ImpactStatsBlock key={key} data={block} />;

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

          default:
            console.warn(`Unrecognized Strapi block component: ${block.__component}`);
            return null;
        }
      })}
    </>
  );
}
