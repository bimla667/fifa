export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 max-w-3xl">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
        AI
      </div>
      <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}
