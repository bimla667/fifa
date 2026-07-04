import { useState } from 'react';
import ModelSelector from './ModelSelector';

export default function ChatInput({ onSubmit, loading }) {
  const [input, setInput]   = useState('');
  const [model, setModel]   = useState('openai/gpt-4o-mini');
  const [mode, setMode]     = useState('name'); // 'name' | 'url'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSubmit({
      companyName: mode === 'name' ? input.trim() : undefined,
      websiteUrl:  mode === 'url'  ? input.trim() : undefined,
      model,
    });
    setInput('');
  };

  const placeholder = mode === 'name'
    ? 'Enter company name (e.g. Stripe, Notion, OpenAI…)'
    : 'Enter website URL (e.g. https://stripe.com)';

  return (
    <div className="border-t border-gray-800 bg-gray-950 px-4 py-4">
      {/* Mode toggle + Model selector */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex bg-gray-800 rounded-lg p-0.5 gap-0.5">
          {['name', 'url'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {m === 'name' ? '🏢 Company Name' : '🌐 Website URL'}
            </button>
          ))}
        </div>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type={mode === 'url' ? 'url' : 'text'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="input-field flex-1"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary px-5"
        >
          {loading ? '…' : 'Research'}
        </button>
      </form>
    </div>
  );
}
