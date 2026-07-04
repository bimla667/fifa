const IGNORE_PATHS = [
  'login', 'signin', 'signup', 'register',
  'privacy', 'terms', 'legal', 'cookie',
  'blog', 'news', 'press', 'careers', 'jobs',
  'cdn', 'static', 'assets', 'wp-content',
];

const IGNORE_EXTENSIONS = [
  '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.svg',
  '.mp4', '.zip', '.exe', '.css', '.js', '.ico',
];

/**
 * Normalize a URL: ensure https, remove trailing slash and query strings.
 */
function normalizeUrl(url) {
  try {
    if (!url.startsWith('http')) url = 'https://' + url;
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return url;
  }
}

/**
 * Decide whether a URL should be crawled.
 */
function shouldCrawl(url, base) {
  try {
    const u = new URL(url);
    const b = new URL(base);

    if (u.host !== b.host) return false;

    const path = u.pathname.toLowerCase();

    for (const ext of IGNORE_EXTENSIONS) {
      if (path.endsWith(ext)) return false;
    }

    for (const seg of IGNORE_PATHS) {
      if (path.includes(seg)) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Extract clean readable text from a Cheerio instance.
 */
function extractText($) {
  // Remove noise elements
  $('script, style, nav, footer, header, .cookie, .popup, .ads, .advertisement, [aria-hidden="true"]').remove();

  const text = $('body').text();

  return text
    .replace(/\s{3,}/g, '\n\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
}

module.exports = { normalizeUrl, shouldCrawl, extractText };
