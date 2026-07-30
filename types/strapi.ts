export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      caption?: string;
      width?: number;
      height?: number;
    };
  } | null;
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GlobalSettings {
  logo?: StrapiImage;
  siteName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
}

export interface StrapiBlock {
  __component: string;
  id: number;
  [key: string]: any;
}

export interface NewsArticle {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    publishDate?: string;
    coverImage?: StrapiImage;
  };
}

export interface BusinessItem {
  id: number;
  attributes: {
    name: string;
    slug: string;
    slogan?: string;
    description?: string;
    coverImage?: StrapiImage;
    infographicImage?: StrapiImage;
    gallery?: { data: StrapiImage['data'][] };
    contactPhone?: string;
    contactWebsite?: string;
    contactAddress?: string;
    category?: 'consumer' | 'distribution';
  };
}
