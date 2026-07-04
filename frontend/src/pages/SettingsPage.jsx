import { useState, useEffect } from 'react';

const DEFAULTS = {
  applicantName:  '',
  applicantEmail: '',
  botToken:       '',
  channelId:      '',
};

export default function SettingsPage() {
  const [form, setForm]       = useState(DEFAULTS);
  const [saved, setSaved]     = useState(false);
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('discordSettings') || '{}');
    setForm({ ...DEFAULTS, ...stored });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('discordSettings', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestMsg('');
    try {
      const res = await fetch('/discord/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken:      form.botToken,
          channelId:     form.channelId,
          applicantName: form.applicantName,
          applicantEmail:form.applicantEmail,
          company: 'Test Company',
          website: 'https://example.com',
          pdfBase64: null,
        }),
      });
      const data = await res.json();
      setTestMsg(data.success ? '✓ Message sent to Discord!' : `Error: ${data.error}`);
    } catch (err) {
      setTestMsg(`Error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Discord Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Configure your Discord bot to automatically receive research reports.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Applicant info */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-white text-sm uppercase tracking-wide">
              Applicant Info
            </h2>
            <Field
              label="Applicant Name"
              name="applicantName"
              value={form.applicantName}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <Field
              label="Applicant Email"
              name="applicantEmail"
              type="email"
              value={form.applicantEmail}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          {/* Discord config */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-white text-sm uppercase tracking-wide">
              Discord Configuration
            </h2>
            <Field
              label="Discord Bot Token"
              name="botToken"
              type="password"
              value={form.botToken}
              onChange={handleChange}
              placeholder="Bot token from Discord Developer Portal"
            />
            <Field
              label="Discord Channel ID"
              name="channelId"
              value={form.channelId}
              onChange={handleChange}
              placeholder="Right-click channel → Copy ID"
            />

            <div className="bg-blue-950/40 border border-blue-800/50 rounded-lg p-3 text-xs text-blue-300 space-y-1">
              <p className="font-semibold">How to get these:</p>
              <p>1. Create a bot at <span className="text-blue-400">discord.com/developers</span></p>
              <p>2. Enable Developer Mode in Discord settings</p>
              <p>3. Add the bot to your server with <strong>Send Messages + Attach Files</strong></p>
              <p>4. Right-click your target channel → Copy Channel ID</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary">
              {saved ? '✓ Saved!' : 'Save Settings'}
            </button>
            {form.botToken && form.channelId && (
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="btn-ghost border border-gray-700 text-sm"
              >
                {testing ? 'Sending…' : 'Test Connection'}
              </button>
            )}
          </div>

          {testMsg && (
            <p className={`text-sm ${testMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
              {testMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
