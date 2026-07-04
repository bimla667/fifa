const axios = require('axios');
const FormData = require('form-data');

/**
 * Send research PDF + message to a Discord channel via bot token.
 */
async function send({ botToken, channelId, applicantName, applicantEmail, company, website, pdfBase64 }) {
  const baseUrl = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const headers = {
    Authorization: `Bot ${botToken}`,
  };

  const message = [
    '**New Company Research Report**',
    `**Applicant:** ${applicantName || 'N/A'}`,
    `**Email:** ${applicantEmail || 'N/A'}`,
    `**Company:** ${company || 'N/A'}`,
    `**Website:** ${website || 'N/A'}`,
    `**Generated:** ${new Date().toUTCString()}`,
  ].join('\n');

  if (pdfBase64) {
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const form = new FormData();
    form.append('content', message);
    form.append('file', pdfBuffer, {
      filename: `research_${(company || 'report').replace(/\s+/g, '_')}.pdf`,
      contentType: 'application/pdf',
    });

    await axios.post(baseUrl, form, {
      headers: { ...headers, ...form.getHeaders() },
      timeout: 30000,
    });
  } else {
    await axios.post(baseUrl, { content: message }, { headers, timeout: 15000 });
  }
}

module.exports = { send };
