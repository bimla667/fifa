const axios = require('axios');
const cheerio = require('cheerio');
const { normalizeUrl, shouldCrawl, extractText } = require('../utils/helpers');

const TARGET_PATHS = ['', '/', '/about', '/products', '/services', '/solutions', '/contact', '/pricing'];
const MAX_PAGES = 8;

/**
 * Crawl a website and return extracted text content.
 */
async function crawl(baseUrl) {
  const normalizedBase = normalizeUrl(baseUrl);
  const visited = new Set();
  const textChunks = [];

  // Build initial URL queue from target paths
  const queue = TARGET_PATHS.map((p) => `${normalizedBase}${p}`);

  for (const url of queue) {
    if (visited.size >= MAX_PAGES) break;
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const html = await fetchPage(url);
      if (!html) continue;

      const $ = cheerio.load(html);
      const text = extractText($);
      if (text.trim().length > 100) {
        textChunks.push(`[Page: ${url}]\n${text}`);
      }

      // Discover more internal links
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const resolved = resolveUrl(href, normalizedBase);
        if (resolved && shouldCrawl(resolved, normalizedBase) && !visited.has(resolved)) {
          queue.push(resolved);
        }
      });
    } catch (err) {
      console.warn(`[Crawler] Failed to fetch ${url}: ${err.message}`);
    }
  }

  return textChunks.join('\n\n---\n\n').slice(0, 40000);
}

async function fetchPage(url) {
  try {
    const res = await axios.get(url, {
      timeout: 12000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ResearchBot/1.0; +https://example.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      maxRedirects: 5,
    });
    if (typeof res.data === 'string') return res.data;
    return null;
  } catch {
    return null;
  }
}

function resolveUrl(href, base) {
  try {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
    if (href.startsWith('http')) return href;
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

module.exports = { crawl };
