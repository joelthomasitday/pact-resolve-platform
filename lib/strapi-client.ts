/**
 * Strapi Client Utility
 * 
 * This replaces direct MongoDB calls and provides a clean interface
 * to fetch content from the Strapi Headless CMS.
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiOptions {
  populate?: string | string[] | object;
  filters?: object;
  sort?: string | string[];
  pagination?: object;
}

export async function fetchStrapi(endpoint: string, options: StrapiOptions = {}) {
  const { populate = '*', filters, sort, pagination } = options;
  
  const query = new URLSearchParams();
  
  if (populate) {
    if (typeof populate === 'string' || Array.isArray(populate)) {
      // In Strapi 5, simple populate works well
      query.append('populate', Array.isArray(populate) ? populate.join(',') : populate);
    } else {
      // Complex nested populate (deep-populate)
      // This would require a library like qs, but we'll stick to simple for now
    }
  }

  if (filters) {
    // Basic filter implementation
    Object.entries(filters).forEach(([key, value]) => {
      query.append(`filters[${key}]`, value);
    });
  }

  if (sort) {
    const sortArray = Array.isArray(sort) ? sort : [sort];
    sortArray.forEach(s => query.append('sort', s));
  }

  const url = `${STRAPI_URL}/api/${endpoint}?${query.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    next: { revalidate: 3600 }, // Default revalidation for ISR
  });

  if (!response.ok) {
    throw new Error(`Strapi Fetch Error: ${response.statusText} (${url})`);
  }

  return response.json();
}

/**
 * Normalizer to flatten Strapi 5 response structure
 * Strapi 5 returns { data: [...] } where items are flatter than Strapi 4.
 */
export function normalizeStrapiData(data: any) {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.map(item => normalizeItem(item));
  }
  return normalizeItem(data);
}

function normalizeItem(item: any) {
  if (!item) return null;
  // Strapi 5 structure is simpler than 4, but let's be robust
  const id = item.id || item.documentId;
  return { ...item, id };
}
