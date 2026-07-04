const discordService = require('../services/discordService');

/**
 * POST /discord/send
 * Accepts { botToken, channelId, applicantName, applicantEmail, company, website, pdfBase64 }
 */
async function sendToDiscord(req, res) {
  const { botToken, channelId, applicantName, applicantEmail, company, website, pdfBase64 } = req.body;

  if (!botToken || !channelId) {
    return res.status(400).json({ error: 'Bot token and channel ID are required.' });
  }

  try {
    await discordService.send({ botToken, channelId, applicantName, applicantEmail, company, website, pdfBase64 });
    return res.json({ success: true, message: 'Sent to Discord.' });
  } catch (err) {
    console.error('[Discord Error]', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { sendToDiscord };
