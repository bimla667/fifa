const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const COLORS = {
  primary:   rgb(0.10, 0.25, 0.70),
  accent:    rgb(0.05, 0.60, 0.85),
  dark:      rgb(0.10, 0.10, 0.15),
  grey:      rgb(0.45, 0.45, 0.50),
  lightGrey: rgb(0.93, 0.94, 0.96),
  white:     rgb(1, 1, 1),
  red:       rgb(0.85, 0.20, 0.20),
};

/**
 * Generate a professional PDF from research data.
 * Returns Uint8Array of PDF bytes.
 */
async function generate(research) {
  const pdfDoc = await PDFDocument.create();
  const boldFont   = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const ctx = { pdfDoc, boldFont, regularFont, italicFont };

  // ── Title page ──────────────────────────────────────────────────────────
  const titlePage = addPage(pdfDoc);
  drawTitlePage(titlePage, ctx, research);

  // ── Content page(s) ─────────────────────────────────────────────────────
  const contentPage = addPage(pdfDoc);
  let y = drawContentPage(contentPage, ctx, research);

  // Extra pages if content overflows
  if (y < 60) {
    const extra = addPage(pdfDoc);
    drawCompetitors(extra, ctx, research.analysis?.competitors || research.serper?.competitors || [], 720);
  }

  return pdfDoc.save();
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function addPage(pdfDoc) {
  return pdfDoc.addPage([816, 1056]); // Letter size
}

function drawTitlePage(page, { boldFont, regularFont, italicFont }, research) {
  const { width, height } = page.getSize();
  const analysis = research.analysis || {};
  const serper   = research.serper   || {};

  // Header band
  page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: COLORS.primary });

  // Title
  page.drawText('Company Research Report', {
    x: 50, y: height - 68, size: 32, font: boldFont, color: COLORS.white,
  });

  // Generated date
  page.drawText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
    x: 50, y: height - 95, size: 11, font: regularFont, color: rgb(0.75, 0.85, 1),
  });

  // Accent bar
  page.drawRectangle({ x: 0, y: height - 125, width, height: 5, color: COLORS.accent });

  let y = height - 180;

  // Company name
  const company = analysis.companyInfo?.name || serper.name || research.companyName || 'Unknown Company';
  page.drawText(company, { x: 50, y, size: 26, font: boldFont, color: COLORS.dark });
  y -= 30;

  // Website
  const website = research.website || serper.website || '';
  if (website) {
    page.drawText(website, { x: 50, y, size: 12, font: italicFont, color: COLORS.accent });
    y -= 25;
  }

  // Info grid
  const info = [
    ['Phone',       serper.phone || 'N/A'],
    ['Address',     serper.address || 'N/A'],
    ['Industry',    analysis.companyInfo?.industry || 'N/A'],
    ['Founded',     analysis.companyInfo?.founded || 'N/A'],
    ['Size',        analysis.companyInfo?.size || 'N/A'],
    ['Headquarters',analysis.companyInfo?.headquarters || 'N/A'],
  ];

  y -= 20;
  page.drawRectangle({ x: 40, y: y - 10, width: width - 80, height: info.length * 28 + 20, color: COLORS.lightGrey });

  for (const [label, value] of info) {
    y -= 5;
    page.drawText(`${label}:`, { x: 60, y, size: 10, font: boldFont, color: COLORS.grey });
    page.drawText(String(value).slice(0, 90), { x: 200, y, size: 10, font: regularFont, color: COLORS.dark });
    y -= 23;
  }

  // Footer
  drawFooter(page, regularFont, company);
}

function drawContentPage(page, ctx, research) {
  const { boldFont, regularFont } = ctx;
  const { width, height } = page.getSize();
  const analysis = research.analysis || {};
  const serper   = research.serper   || {};

  const company = analysis.companyInfo?.name || serper.name || research.companyName || 'Company';

  // Header band
  page.drawRectangle({ x: 0, y: height - 60, width, height: 60, color: COLORS.primary });
  page.drawText('Research Analysis', { x: 50, y: height - 38, size: 18, font: boldFont, color: COLORS.white });
  page.drawRectangle({ x: 0, y: height - 65, width, height: 5, color: COLORS.accent });

  let y = height - 100;

  // Summary
  y = drawSection(page, ctx, 'Company Summary', y);
  const summary = analysis.summary || serper.description || 'No summary available.';
  y = drawWrappedText(page, regularFont, summary, 50, y, width - 100, 12, COLORS.dark);
  y -= 15;

  // Products
  const products = analysis.products || [];
  if (products.length) {
    y = drawSection(page, ctx, 'Products', y);
    for (const p of products.slice(0, 10)) {
      y = drawBullet(page, regularFont, String(p), y, width);
    }
    y -= 10;
  }

  // Services
  const services = analysis.services || [];
  if (services.length) {
    y = drawSection(page, ctx, 'Services', y);
    for (const s of services.slice(0, 10)) {
      y = drawBullet(page, regularFont, String(s), y, width);
    }
    y -= 10;
  }

  // Pain Points
  const painPoints = analysis.painPoints || [];
  if (painPoints.length) {
    y = drawSection(page, ctx, 'Pain Points Addressed', y);
    for (const pp of painPoints.slice(0, 8)) {
      const title = typeof pp === 'object' ? pp.point : String(pp);
      const desc  = typeof pp === 'object' ? pp.description : '';
      page.drawText(`• ${title}`, { x: 60, y, size: 11, font: boldFont, color: COLORS.dark });
      y -= 16;
      if (desc) {
        y = drawWrappedText(page, regularFont, `   ${desc}`, 70, y, width - 130, 10, COLORS.grey);
        y -= 5;
      }
      if (y < 80) break;
    }
    y -= 10;
  }

  // Competitors
  const competitors = analysis.competitors || serper.competitors || [];
  if (competitors.length && y > 150) {
    y = drawSection(page, ctx, 'Competitors', y);
    y = drawCompetitors(page, ctx, competitors, y);
  }

  drawFooter(page, regularFont, company);
  return y;
}

function drawCompetitors(page, { boldFont, regularFont }, competitors, y) {
  const { width } = page.getSize();
  for (const c of competitors.slice(0, 6)) {
    if (y < 80) break;
    const name    = c.name    || c.company || 'Unknown';
    const website = c.website || '';
    const reason  = c.reason  || '';
    page.drawText(`• ${name}`, { x: 60, y, size: 11, font: boldFont, color: COLORS.dark });
    if (website) {
      page.drawText(website, { x: 60, y: y - 14, size: 9, font: regularFont, color: COLORS.accent });
    }
    if (reason) {
      y = drawWrappedText(page, regularFont, reason, 60, y - (website ? 28 : 14), width - 120, 9, COLORS.grey);
    } else {
      y -= website ? 30 : 16;
    }
    y -= 8;
  }
  return y;
}

function drawSection(page, { boldFont }, title, y) {
  const { width } = page.getSize();
  y -= 8;
  page.drawRectangle({ x: 40, y: y - 6, width: width - 80, height: 24, color: COLORS.primary });
  page.drawText(title.toUpperCase(), { x: 50, y, size: 11, font: boldFont, color: COLORS.white });
  return y - 24;
}

function drawBullet(page, font, text, y, width) {
  page.drawText(`• ${text.slice(0, 100)}`, { x: 60, y, size: 10, font, color: COLORS.dark });
  return y - 16;
}

function drawWrappedText(page, font, text, x, y, maxWidth, size, color) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(test, size);
    if (testWidth > maxWidth && line) {
      page.drawText(line, { x, y, size, font, color });
      y -= size + 4;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    page.drawText(line, { x, y, size, font, color });
    y -= size + 4;
  }
  return y;
}

function drawFooter(page, font, company) {
  const { width } = page.getSize();
  page.drawLine({ start: { x: 40, y: 50 }, end: { x: width - 40, y: 50 }, thickness: 0.5, color: COLORS.grey });
  page.drawText(`${company} — AI Company Research Assistant — Confidential`, {
    x: 50, y: 35, size: 8, font, color: COLORS.grey,
  });
  page.drawText(`© ${new Date().getFullYear()}`, {
    x: width - 80, y: 35, size: 8, font, color: COLORS.grey,
  });
}

module.exports = { generate };
