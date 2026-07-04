import ProgressTimeline from './ProgressTimeline';

export default function ResearchCard({ research, pdfBase64, progress, onDownload }) {
  if (!research) return null;

  const analysis = research.analysis || {};
  const serper   = research.serper   || {};
  const company  = analysis.companyInfo?.name || serper.name || 'Company';

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-2xl rounded-tl-sm overflow-hidden max-w-3xl w-full">
      {/* Header */}
      <div className="bg-blue-700/20 border-b border-gray-700 px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold text-white text-lg leading-tight">{company}</h2>
          {(research.website || serper.website) && (
            <a
              href={research.website || serper.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 text-sm hover:underline mt-0.5 block"
            >
              {research.website || serper.website}
            </a>
          )}
        </div>
        {pdfBase64 && (
          <button onClick={onDownload} className="btn-primary text-sm shrink-0 flex items-center gap-2">
            <span>⬇</span> Download PDF
          </button>
        )}
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Progress */}
        {progress?.length > 0 && <ProgressTimeline steps={progress} />}

        {/* Info row */}
        {(serper.phone || serper.address) && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
            {serper.phone   && <span>📞 {serper.phone}</span>}
            {serper.address && <span>📍 {serper.address}</span>}
          </div>
        )}

        {/* Summary */}
        {analysis.summary && (
          <Section title="Summary">
            <p className="text-gray-300 text-sm leading-relaxed">{analysis.summary}</p>
          </Section>
        )}

        {/* Products & Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysis.products?.length > 0 && (
            <Section title="Products">
              <TagList items={analysis.products} color="blue" />
            </Section>
          )}
          {analysis.services?.length > 0 && (
            <Section title="Services">
              <TagList items={analysis.services} color="purple" />
            </Section>
          )}
        </div>

        {/* Pain Points */}
        {analysis.painPoints?.length > 0 && (
          <Section title="Pain Points Addressed">
            <ul className="space-y-2">
              {analysis.painPoints.map((pp, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium text-orange-400">
                    {typeof pp === 'object' ? pp.point : pp}
                  </span>
                  {typeof pp === 'object' && pp.description && (
                    <span className="text-gray-400"> — {pp.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Competitors */}
        {(analysis.competitors?.length || serper.competitors?.length) > 0 && (
          <Section title="Competitors">
            <div className="space-y-2.5">
              {(analysis.competitors || serper.competitors || []).map((c, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-900/60 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{c.name || c.company}</p>
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noreferrer"
                         className="text-blue-400 text-xs hover:underline truncate block">
                        {c.website}
                      </a>
                    )}
                    {c.reason && <p className="text-gray-400 text-xs mt-1">{c.reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}

function TagList({ items, color = 'blue' }) {
  const cls = color === 'blue'
    ? 'bg-blue-900/40 text-blue-300 border border-blue-800'
    : 'bg-purple-900/40 text-purple-300 border border-purple-800';
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, 12).map((item, i) => (
        <span key={i} className={`text-xs px-2 py-1 rounded-md ${cls}`}>{item}</span>
      ))}
    </div>
  );
}
