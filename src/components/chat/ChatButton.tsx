import { MessageCircle, X } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';

export function ChatButton() {
  const { isOpen, toggle } = useChatContext();

  return (
    <button
      type="button"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </button>
  );
}
