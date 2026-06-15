import type { ChatMessage } from '../../context/ChatContext';
import { Spinner } from '../common/Spinner';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onQuickReply?: (text: string) => void;
}

function looksLikeConfirmationPrompt(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.toLowerCase().includes('confirm') && trimmed.endsWith('?');
}

export function ChatMessageBubble({ message, onQuickReply }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const showQuickReplies = !isUser && !message.pending && !message.error && looksLikeConfirmationPrompt(message.text);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[85%]">
        <div
          className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
            isUser
              ? 'bg-primary-500 text-white'
              : message.error
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.pending && message.text === '' ? (
            <span className="inline-flex items-center gap-2 text-gray-500">
              <Spinner size="sm" /> Thinking...
            </span>
          ) : (
            message.text
          )}
        </div>
        {showQuickReplies && onQuickReply && (
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => onQuickReply('Yes, confirm')}
              className="rounded-md bg-primary-500 px-3 py-1 text-xs font-medium text-white hover:bg-primary-600"
            >
              Yes, confirm
            </button>
            <button
              type="button"
              onClick={() => onQuickReply('No, cancel')}
              className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-900 hover:bg-gray-200"
            >
              No, cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
