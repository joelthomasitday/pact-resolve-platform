
interface StrapiOptions {
  method?: string;
  headers?: any;
  body?: any;
  next?: any;
  cache?: RequestCache;
}

/**
 * Helper to stringify nested query objects for Strapi (v4/v5 compatible)
 */
function stringify(obj: any, prefix = ''): string {
  const pairs: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const name = prefix ? `${prefix}[${key}]` : key;
      if (value !== null && typeof value === 'object') {
        pairs.push(stringify(value, name));
      } else if (value !== undefined) {
        pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`);
      }
    }
  }
  return pairs.filter(p => p.length > 0).join('&');
}

/**
 * Helper to fetch data from Strapi
 */
export async function fetchStrapi(
  path: string,
  urlParamsObject: Record<string, any> | string = {},
  options: StrapiOptions = {}
) {
  try {
    const token = process.env.STRAPI_API_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

    // Merge default options with user options
    const mergedOptions = {
      next: { revalidate: 60 }, // Default revalidation
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...options,
    };

    // Build request URL
    let queryString = '';
    if (typeof urlParamsObject === 'string') {
      queryString = urlParamsObject ? `?${urlParamsObject}` : '';
    } else {
      const q = stringify(urlParamsObject);
      queryString = q ? `?${q}` : '';
    }
    
    // In Strapi v4/v5, API paths usually start with /api/
    const requestUrl = `${baseUrl}/api/${path}${queryString}`;

    const response = await fetch(requestUrl, mergedOptions);
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    let data: any;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Strapi Non-JSON Response at', requestUrl, ':', text.substring(0, 500));
      throw new Error(`Strapi returned non-JSON response (${response.status} ${response.statusText})`);
    }

    if (!response.ok) {
        console.error('Strapi Error at', requestUrl, ':', data?.error || data);
        throw new Error(data?.error?.message || `Failed to fetch from Strapi: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Fetch Strapi Error:', error);
    throw error; // Rethrow to let the caller handle it or show error boundary
  }
}

/**
 * Get Global Settings
 */
export async function getGlobalSettings() {
  const response = await fetchStrapi('global-setting', {
    populate: ['logo', 'contactPersons']
  });
  return response?.data?.attributes || response?.data;
}

/**
 * Get Home Page Data
 */
export async function getHomePage() {
  const response = await fetchStrapi('home-page', {
    populate: {
      heroSlides: {
        populate: ['image']
      }
    }
  });
  return response?.data?.attributes || response?.data;
}

/**
 * Helper to get a full Strapi Media URL
 */
export function getStrapiMedia(url: string | null) {
  if (url == null) return null;

  // Return the full URL if it's already a full URL (like Cloudinary)
  if (url.startsWith('http') || url.startsWith('//')) return url;

  // Otherwise, prepend the Strapi Base URL
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
}
