const axios = require('axios');

const SERPER_URL = 'https://google.serper.dev/search';

/**
 * Search Serper for company info, website, phone, address, competitors.
 */
async function search(companyName) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) throw new Error('SERPER_API_KEY not set.');

  const queries = [
    { q: `${companyName} official website` },
    { q: `${companyName} company phone address` },
    { q: `${companyName} competitors` },
  ];

  const results = await Promise.allSettled(
    queries.map((body) =>
      axios.post(SERPER_URL, body, {
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        timeout: 10000,
      })
    )
  );

  const [mainRes, contactRes, compRes] = results;

  let website = '';
  let phone = '';
  let address = '';
  let description = '';
  let competitors = [];

  // Extract main website
  if (mainRes.status === 'fulfilled') {
    const data = mainRes.value.data;
    const organic = data.organic || [];
    if (organic.length > 0) {
      website = organic[0].link || '';
      description = organic[0].snippet || '';
    }
    // Knowledge graph
    if (data.knowledgeGraph) {
      const kg = data.knowledgeGraph;
      website = kg.website || website;
      description = kg.description || description;
    }
  }

  // Extract contact info
  if (contactRes.status === 'fulfilled') {
    const text = JSON.stringify(contactRes.value.data);
    const phoneMatch = text.match(/(\+?[\d\s\-().]{10,20})/);
    if (phoneMatch) phone = phoneMatch[1].trim();
    const addressMatch = text.match(/"address"\s*:\s*"([^"]+)"/i);
    if (addressMatch) address = addressMatch[1];
  }

  // Extract competitors
  if (compRes.status === 'fulfilled') {
    const organic = compRes.value.data.organic || [];
    competitors = organic.slice(0, 5).map((r) => ({
      name: r.title?.replace(/ - .*/, '').trim() || '',
      website: r.link || '',
      reason: r.snippet || '',
    }));
  }

  return { name: companyName, website, phone, address, description, competitors };
}

module.exports = { search };
