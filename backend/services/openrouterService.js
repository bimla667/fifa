const axios = require('axios');
const { buildResearchPrompt } = require('../prompts/researchPrompt');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

/**
 * Send crawled content to OpenRouter and get structured analysis.
 */
async function analyze({ crawledText, serperData, companyName, model }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set.');

  const prompt = buildResearchPrompt({ crawledText, serperData, companyName });

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: model || DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert business analyst. Always respond with valid JSON only. No markdown, no explanation outside JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-research-assistant.app',
        'X-Title': 'AI Company Research Assistant',
      },
      timeout: 60000,
    }
  );

  const content = response.data.choices?.[0]?.message?.content || '';

  try {
    // Strip markdown code fences if present
    const cleaned = content.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Return raw text wrapped in structure if JSON parse fails
    return {
      summary: content,
      products: [],
      services: [],
      painPoints: [],
      competitors: serperData?.competitors || [],
    };
  }
}

module.exports = { analyze };
