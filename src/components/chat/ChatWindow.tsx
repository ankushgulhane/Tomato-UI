import { Send, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { EmptyState } from '../common/EmptyState';
import { ChatMessageBubble } from './ChatMessageBubble';

export function ChatWindow() {
  const { close, messages, isStreaming, toolStatus, sendMessage, clearChat } = useChatContext();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, toolStatus]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 bg-primary-500 p-4 text-white">
        <h2 className="text-base font-semibold">Tomato Assistant</h2>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              type="button"
              aria-label="Clear chat"
              title="Clear chat"
              onClick={clearChat}
              className="text-white/80 hover:text-white"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button type="button" aria-label="Close chat" onClick={close} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <EmptyState
            title="Ask me anything"
            description="I can help you browse restaurants, place orders, check order status, or manage your menu."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} onQuickReply={sendMessage} />
            ))}
            {toolStatus && <p className="text-xs italic text-gray-400">{toolStatus}</p>}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="button"
            aria-label="Send message"
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
