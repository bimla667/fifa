const serperService = require('../services/serperService');
const crawlerService = require('../services/crawlerService');
const openrouterService = require('../services/openrouterService');

/**
 * POST /research
 * Accepts { companyName, websiteUrl, model }
 * Returns structured research JSON
 */
async function runResearch(req, res) {
  const { companyName, websiteUrl, model } = req.body;

  if (!companyName && !websiteUrl) {
    return res.status(400).json({ error: 'Provide companyName or websiteUrl.' });
  }

  try {
    let targetUrl = websiteUrl || null;
    let serperData = {};

    // Step 1 — Serper search
    if (companyName) {
      console.log(`[Research] Searching Serper for: ${companyName}`);
      serperData = await serperService.search(companyName);
      targetUrl = serperData.website || websiteUrl;
    }

    if (!targetUrl) {
      return res.status(400).json({ error: 'Could not resolve a website URL. Please provide one directly.' });
    }

    // Step 2 — Crawl website
    console.log(`[Research] Crawling: ${targetUrl}`);
    const crawledText = await crawlerService.crawl(targetUrl);

    // Step 3 — AI analysis
    console.log(`[Research] Running AI analysis with model: ${model || 'default'}`);
    const analysis = await openrouterService.analyze({
      crawledText,
      serperData,
      companyName: companyName || serperData.name || targetUrl,
      model,
    });

    return res.json({
      success: true,
      website: targetUrl,
      serper: serperData,
      analysis,
    });
  } catch (err) {
    console.error('[Research Error]', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { runResearch };
