const MODELS = [
  { id: 'openai/gpt-4o-mini',           label: 'GPT-4o Mini (fast)' },
  { id: 'openai/gpt-4o',                label: 'GPT-4o' },
  { id: 'anthropic/claude-3-haiku',     label: 'Claude 3 Haiku' },
  { id: 'anthropic/claude-3.5-sonnet',  label: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-flash-1.5',      label: 'Gemini 1.5 Flash' },
  { id: 'google/gemini-pro-1.5',        label: 'Gemini 1.5 Pro' },
  { id: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B (free)' },
  { id: 'mistralai/mistral-7b-instruct',    label: 'Mistral 7B (free)' },
];

export default function ModelSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 shrink-0">Model:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg
                   px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500
                   cursor-pointer"
      >
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}
