import { useState, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export function useResearch() {
  const [messages, setMessages]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [progress, setProgress]     = useState([]);
  const [research, setResearch]     = useState(null);
  const [pdfBase64, setPdfBase64]   = useState(null);

  const addMessage = useCallback((role, content, extra = {}) => {
    setMessages((prev) => [...prev, { id: Date.now(), role, content, ...extra }]);
  }, []);

  const step = useCallback((label, status = 'active') => {
    setProgress((prev) => {
      const exists = prev.find((s) => s.label === label);
      if (exists) {
        return prev.map((s) => s.label === label ? { ...s, status } : s);
      }
      return [...prev, { label, status }];
    });
  }, []);

  const run = useCallback(async ({ companyName, websiteUrl, model }) => {
    if (!companyName && !websiteUrl) return;

    const query = companyName || websiteUrl;
    addMessage('user', query);
    setLoading(true);
    setProgress([]);
    setPdfBase64(null);
    setResearch(null);

    try {
      // ── Research ───────────────────────────────────────────────────────
      step('Searching...');
      await delay(400);
      step('Searching...', 'done');

      step('Crawling website...');
      const researchRes = await axios.post(`${API}/research`, {
        companyName: companyName || undefined,
        websiteUrl:  websiteUrl  || undefined,
        model,
      });
      step('Crawling website...', 'done');

      const data = researchRes.data;
      setResearch(data);

      step('AI Analysis...', 'active');
      await delay(300);
      step('AI Analysis...', 'done');

      step('Finding competitors...');
      await delay(200);
      step('Finding competitors...', 'done');

      // ── PDF ────────────────────────────────────────────────────────────
      step('Generating PDF...');
      const pdfRes = await axios.post(`${API}/generate-pdf`, { research: data });
      const b64 = pdfRes.data.pdf;
      setPdfBase64(b64);
      step('Generating PDF...', 'done');

      addMessage('assistant', null, { research: data, pdfBase64: b64 });

      // Auto-send to Discord if configured
      const discord = JSON.parse(localStorage.getItem('discordSettings') || '{}');
      if (discord.botToken && discord.channelId) {
        try {
          await axios.post(`${API}/discord/send`, {
            botToken:      discord.botToken,
            channelId:     discord.channelId,
            applicantName: discord.applicantName,
            applicantEmail:discord.applicantEmail,
            company: companyName || data.serper?.name || '',
            website: data.website || '',
            pdfBase64: b64,
          });
        } catch (e) {
          console.warn('Discord send failed:', e.message);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Something went wrong.';
      addMessage('assistant', `Error: ${msg}`);
      setProgress((prev) => prev.map((s) => s.status === 'active' ? { ...s, status: 'error' } : s));
    } finally {
      setLoading(false);
    }
  }, [addMessage, step]);

  const downloadPdf = useCallback((company = 'report') => {
    if (!pdfBase64) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = `research_${company.replace(/\s+/g, '_')}.pdf`;
    link.click();
  }, [pdfBase64]);

  return { messages, loading, progress, research, pdfBase64, run, downloadPdf };
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
