/**
 * Build the research prompt sent to OpenRouter.
 */
function buildResearchPrompt({ crawledText, serperData, companyName }) {
  const context = [
    `Company: ${companyName}`,
    serperData?.website ? `Website: ${serperData.website}` : '',
    serperData?.description ? `Description from search: ${serperData.description}` : '',
    crawledText ? `\n--- CRAWLED WEBSITE CONTENT ---\n${crawledText.slice(0, 25000)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `
You are an expert business analyst. Analyze the following company information and return a JSON object.

${context}

Return ONLY valid JSON with this exact structure:
{
  "summary": "2-3 paragraph professional company summary",
  "products": ["product or feature 1", "product or feature 2"],
  "services": ["service 1", "service 2"],
  "painPoints": [
    { "point": "pain point title", "description": "brief description" }
  ],
  "competitors": [
    { "name": "Competitor Name", "website": "https://...", "reason": "why they compete" }
  ],
  "companyInfo": {
    "industry": "industry name",
    "founded": "year or unknown",
    "size": "company size estimate",
    "headquarters": "location if known"
  }
}

Rules:
- Return ONLY the JSON. No markdown. No extra text.
- If information is unavailable, use empty string or empty array.
- Competitors should be real, named companies in the same space.
- Pain points should reflect business challenges the company solves for customers.
`;
}

module.exports = { buildResearchPrompt };
