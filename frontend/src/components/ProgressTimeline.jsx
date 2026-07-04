const STATUS_STYLES = {
  active: 'text-blue-400 animate-pulse',
  done:   'text-green-400',
  error:  'text-red-400',
  idle:   'text-gray-600',
};

const STATUS_ICON = {
  active: '⟳',
  done:   '✓',
  error:  '✗',
  idle:   '○',
};

export default function ProgressTimeline({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 my-3">
      {steps.map((s) => (
        <div key={s.label} className="flex items-center gap-2.5 text-sm">
          <span className={`text-base leading-none ${STATUS_STYLES[s.status]}`}>
            {STATUS_ICON[s.status]}
          </span>
          <span className={`${STATUS_STYLES[s.status]} font-medium`}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
