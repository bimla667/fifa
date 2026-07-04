const pdfGenerator = require('../pdf/pdfGenerator');

/**
 * POST /generate-pdf
 * Accepts research result JSON, returns PDF as base64
 */
async function generatePdf(req, res) {
  const { research } = req.body;

  if (!research) {
    return res.status(400).json({ error: 'No research data provided.' });
  }

  try {
    const pdfBytes = await pdfGenerator.generate(research);
    const base64 = Buffer.from(pdfBytes).toString('base64');
    return res.json({ success: true, pdf: base64 });
  } catch (err) {
    console.error('[PDF Error]', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generatePdf };
