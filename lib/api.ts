process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.deltasoft.website';
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${STRAPI_BASE_URL}${url}`;
}

export function parseStrapiText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return value.map(b => parseStrapiText(b)).filter(Boolean).join('\n');
  }
  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (Array.isArray(value.children)) {
      return value.children.map((c: any) => parseStrapiText(c)).join('');
    }
  }
  return '';
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
      cache: 'no-store',
      ...options,
    };

    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.warn(`Strapi API Fetch Warning [${response.status}]: ${requestUrl}`);
      // Fallback: If query with specific populate failed with 400, retry with wildcard populate
      if (response.status === 400 && Object.keys(urlParamsObject).length > 0) {
        const fallbackParams: Record<string, any> = {};
        if (urlParamsObject['filters[slug][$eq]']) {
          fallbackParams['filters[slug][$eq]'] = urlParamsObject['filters[slug][$eq]'];
        }
        fallbackParams['populate[blocks][populate]'] = '*';
        fallbackParams['populate'] = '*';

        const fallbackQs = new URLSearchParams(fallbackParams).toString().replace(/%5B/g, '[').replace(/%5D/g, ']');
        const fallbackUrl = `${STRAPI_API_URL}${path}${fallbackQs ? `?${fallbackQs}` : ''}`;
        const fallbackRes = await fetch(fallbackUrl, mergedOptions);
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
      }
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
    'populate[blocks][on][shared.impact-section][populate]': '*',
    'populate[blocks][on][components.tabs-section][populate]': '*',
    'populate[blocks][on][components.brands-section][populate]': '*',
    'populate[blocks][on][components.our-values-section][populate]': '*',
    'populate[blocks][on][components.why-choose-us-section][populate]': '*',
    'populate[blocks][on][components.featured-news-section][populate]': '*',
    'populate[blocks][on][components.partnership-section][populate][cards][populate]': '*',
    'populate[blocks][on][components.reels-section][populate][reels][populate]': '*',
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
  const res = await fetchStrapiAPI<any>('/brands', { populate: '*' });
  return res?.data || [];
}

export async function getBrandBySlug(slug: string) {
  const res = await fetchStrapiAPI<any>('/brands', {
    'filters[slug][$eq]': slug,
    populate: '*',
  });
  if (res?.data && res.data.length > 0) {
    return res.data[0];
  }
  return null;
}

export async function getCategories() {
  try {
    const res = await fetchStrapiAPI<any>('/categories', { populate: '*' });
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    const resProdCat = await fetchStrapiAPI<any>('/product-categories', { populate: '*' });
    if (resProdCat?.data && Array.isArray(resProdCat.data) && resProdCat.data.length > 0) {
      return resProdCat.data;
    }

    // Dynamic Extraction Fallback from Strapi Page Blocks & Products
    const categoriesMap = new Map<string, { id: string; title: string; slug: string }>();
    
    // Check Home blocks for Category names
    const homeBlocks = await getHomePageData();
    if (Array.isArray(homeBlocks)) {
      homeBlocks.forEach((block: any) => {
        const catName = block.categoryName || block.title;
        if (catName && (block.__component?.includes('category') || block.__component?.includes('product'))) {
          const slug = catName.toLowerCase().replace(/\s+/g, '-');
          categoriesMap.set(slug, { id: slug, title: catName, slug });
        }
      });
    }

    if (categoriesMap.size > 0) {
      return Array.from(categoriesMap.values());
    }

    return [];
  } catch (err) {
    return [];
  }
}

export async function getProducts(brandSlug?: string, categorySlug?: string) {
  try {
    const params: any = {
      'populate[0]': 'brand',
      'populate[1]': 'image',
      'populate[2]': 'category',
    };
    if (brandSlug && brandSlug !== 'all') {
      params['filters[brand][slug][$eq]'] = brandSlug;
    }
    if (categorySlug && categorySlug !== 'all') {
      params['filters[category][slug][$eq]'] = categorySlug;
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
    const params = {
      'filters[slug][$eq]': slug,
      'populate[blocks][populate]': '*',
      'populate[FeaturedImage]': 'true',
    };

    let res = await fetchStrapiAPI<any>('/pages', params);
    if (res?.data && res.data.length > 0) {
      return res.data[0];
    }

    // Alias fallbacks for common routes (e.g. 'brands' <-> 'brand', 'about' <-> 'about-us')
    if (slug === 'brands' || slug === 'brand') {
      const altSlug = slug === 'brands' ? 'brand' : 'brands';
      res = await fetchStrapiAPI<any>('/pages', { ...params, 'filters[slug][$eq]': altSlug });
      if (res?.data && res.data.length > 0) {
        return res.data[0];
      }
    }

    if (slug === 'about' || slug === 'who-are-we' || slug === 'bidnii-tuhai') {
      res = await fetchStrapiAPI<any>('/pages', { ...params, 'filters[slug][$eq]': 'about-us' });
      if (res?.data && res.data.length > 0) {
        return res.data[0];
      }
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
