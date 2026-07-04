import ResearchCard from './ResearchCard';

export default function MessageBubble({ message, onDownload }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3
                        max-w-lg text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.content) {
    return (
      <div className="flex items-start gap-3">
        <Avatar />
        <div className="bg-red-900/30 border border-red-800 rounded-2xl rounded-tl-sm
                        px-4 py-3 max-w-xl text-sm text-red-300">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.research) {
    return (
      <div className="flex items-start gap-3">
        <Avatar />
        <ResearchCard
          research={message.research}
          pdfBase64={message.pdfBase64}
          onDownload={onDownload}
        />
      </div>
    );
  }

  return null;
}

function Avatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center
                    text-xs font-bold shrink-0 mt-0.5">
      AI
    </div>
  );
}
