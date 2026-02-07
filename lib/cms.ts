import { fetchStrapi, normalizeStrapiData } from './strapi-client';

export async function getHomePage() {
  const data = await fetchStrapi('home-page', {
    populate: {
      hero: { populate: '*' },
      sections: { populate: '*' },
      seo: { populate: '*' }
    }
  });
  return normalizeStrapiData(data.data);
}

export async function getSessions(limit = 10) {
  const data = await fetchStrapi('sessions', {
    pagination: { limit },
    populate: ['instructor', 'thumbnail']
  });
  return normalizeStrapiData(data.data);
}

export async function getArticles() {
  const data = await fetchStrapi('articles', {
    populate: ['author', 'coverImage']
  });
  return normalizeStrapiData(data.data);
}

export async function getGlobalSettings() {
  const data = await fetchStrapi('global-setting', {
    populate: '*'
  });
  return normalizeStrapiData(data.data);
}
