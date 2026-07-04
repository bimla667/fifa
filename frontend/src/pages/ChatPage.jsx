import { useRef, useEffect } from 'react';
import { useResearch } from '../hooks/useResearch';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import ResearchCard from '../components/ResearchCard';
import ProgressTimeline from '../components/ProgressTimeline';

export default function ChatPage() {
  const { messages, loading, progress, research, pdfBase64, run, downloadPdf } = useResearch();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const company = research?.analysis?.companyInfo?.name || research?.serper?.name || 'report';

  return (
    <div className="flex flex-col h-full">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-20">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-600/30
                            flex items-center justify-center text-3xl mb-5">
              🔍
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">AI Company Research Assistant</h1>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">
              Enter a company name or website URL to get an instant AI-powered research report
              including summary, products, services, pain points, and competitors.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {['Stripe', 'Notion', 'Figma', 'OpenAI', 'Vercel'].map((name) => (
                <button
                  key={name}
                  onClick={() => run({ companyName: name, model: 'openai/gpt-4o-mini' })}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700
                             rounded-full text-sm text-gray-300 transition-colors"
                >
                  Try "{name}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'user' && (
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3
                                max-w-lg text-sm leading-relaxed">
                  {msg.content}
                </div>
              </div>
            )}

            {msg.role === 'assistant' && msg.content && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center
                                text-xs font-bold shrink-0">
                  AI
                </div>
                <div className="bg-red-900/30 border border-red-800 rounded-2xl rounded-tl-sm
                                px-4 py-3 max-w-xl text-sm text-red-300">
                  {msg.content}
                </div>
              </div>
            )}

            {msg.role === 'assistant' && msg.research && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center
                                text-xs font-bold shrink-0">
                  AI
                </div>
                <ResearchCard
                  research={msg.research}
                  pdfBase64={msg.pdfBase64}
                  progress={null}
                  onDownload={() =>
                    downloadPdf(msg.research?.serper?.name || msg.research?.companyName)
                  }
                />
              </div>
            )}
          </div>
        ))}

        {/* Live progress while loading */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center
                            text-xs font-bold shrink-0">
              AI
            </div>
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl rounded-tl-sm px-5 py-4">
              <ProgressTimeline steps={progress} />
              {progress.length === 0 && <TypingIndicator />}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSubmit={run} loading={loading} />
    </div>
  );
}
