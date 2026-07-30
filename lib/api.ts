process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://amuulai.deltasoft.website';
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${STRAPI_BASE_URL}${url}`;
}

export async function fetchStrapiAPI<T>(
  path: string,
  urlParamsObject: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T | null> {
  try {
    const queryString = new URLSearchParams(urlParamsObject).toString().replace(/%5B/g, '[').replace(/%5D/g, ']');
    const requestUrl = `${STRAPI_API_URL}${path}${queryString ? `?${queryString}` : ''}`;

    const mergedOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30 },
      ...options,
    };

    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.warn(`Strapi API Fetch Warning [${response.status}]: ${requestUrl}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Strapi API Error fetching ${path}:`, error);
    return null;
  }
}

export async function getGlobalSettings() {
  const res = await fetchStrapiAPI<any>('/global', { populate: '*' });
  return res?.data?.attributes || res?.data || null;
}

export async function getHomePageData() {
  const res = await fetchStrapiAPI<any>('/home', {
    'populate[blocks][on][components.slider][populate]': '*',
    'populate[blocks][on][shared.impact-section][populate][Statistics][populate]': '*',
    'populate[blocks][on][components.why-choose-us-section][populate][features][populate]': '*',
    'populate[blocks][on][components.why-choose-us-section][populate][coverImage][populate]': '*',
    'populate[blocks][on][components.our-values-section][populate][leftImage][populate]': '*',
    'populate[blocks][on][components.our-values-section][populate][values][populate]': '*',
    'populate[blocks][on][components.brands-section][populate][brands][populate]': '*',
    'populate[blocks][on][components.tabs-section][populate][tabs][populate][brands][populate]': '*',
    'populate[blocks][on][components.featured-news-section][populate]': '*',
  });
  return res?.data?.blocks || res?.data?.attributes?.blocks || null;
}

export async function getNewsArticles(limit = 100) {
  const res = await fetchStrapiAPI<any>('/articles', {
    'sort[0]': 'publishedAt:desc',
    'pagination[limit]': limit,
    populate: '*',
  });
  return res?.data || [];
}

export async function getArticleBySlug(slug: string) {
  const res = await fetchStrapiAPI<any>('/articles', {
    'filters[slug][$eq]': slug,
    populate: '*',
  });
  if (res?.data && res.data.length > 0) {
    return res.data[0];
  }
  const resId = await fetchStrapiAPI<any>(`/articles/${slug}`, { populate: '*' });
  return resId?.data || null;
}

export async function getTreeMenus() {
  const res = await fetchStrapiAPI<any>('/tree-menus/menu', { populate: '*' });
  return res?.data || [];
}

export async function getNavMenu() {
  const menus = await getTreeMenus();
  const navMenu = menus.find((m: any) => m.slug === 'menu' || m.title === 'navmenu');
  return navMenu?.items || [];
}

export async function getFooterMenu() {
  const menus = await getTreeMenus();
  const footerMenu = menus.find((m: any) => m.slug === 'footer-menu' || m.title === 'footer');
  return footerMenu?.items || [];
}

export async function getBrands() {
  const res = await fetchStrapiAPI<any>('/brands', { populate: 'featuredLogos' });
  return res?.data || [];
}

export async function getProducts(brandSlug?: string) {
  try {
    const params: any = {
      populate: '*',
      'populate[image][populate]': '*',
      'populate[brand][populate]': '*',
    };
    if (brandSlug && brandSlug !== 'all') {
      params['filters[brand][slug][$eq]'] = brandSlug;
    }
    const res = await fetchStrapiAPI<any>('/products', params);
    return res?.data || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

export async function getBusinessBySlug(slug: string) {
  const res = await fetchStrapiAPI<any>('/businesses', {
    'filters[slug][$eq]': slug,
    populate: '*',
  });
  return res?.data?.[0] || null;
}

export async function getPageBySlug(slug: string) {
  try {
    const res = await fetchStrapiAPI<any>('/pages', {
      'filters[slug][$eq]': slug,
      'populate[blocks][on][components.product-category-block][populate][brands][populate]': '*',
      'populate[blocks][on][components.product-category-block][populate][featuredImage][populate]': '*',
      'populate[blocks][on][components.slider][populate]': '*',
      'populate[blocks][on][shared.impact-section][populate][Statistics][populate]': '*',
      'populate[blocks][on][components.why-choose-us-section][populate][features][populate]': '*',
      'populate[blocks][on][components.why-choose-us-section][populate][coverImage][populate]': '*',
      'populate[blocks][on][components.our-values-section][populate][leftImage][populate]': '*',
      'populate[blocks][on][components.our-values-section][populate][values][populate]': '*',
      'populate[blocks][on][components.brands-section][populate][brands][populate]': '*',
      'populate[blocks][on][components.tabs-section][populate][tabs][populate]': '*',
      'populate[blocks][on][components.featured-news-section][populate]': '*',
      'populate[FeaturedImage][populate]': '*',
    });
    if (res?.data && res.data.length > 0) {
      return res.data[0];
    }
  } catch (err) {
    console.error('Error fetching page by slug:', err);
  }
  return null;
}

export async function getFooterData() {
  const res = await fetchStrapiAPI<any>('/footer', {
    'populate[contacts][populate]': '*',
  });
  return res?.data?.attributes || res?.data || null;
}

export async function getSettingData() {
  const res = await fetchStrapiAPI<any>('/setting', {
    populate: '*',
  });
  return res?.data?.attributes || res?.data || null;
}
