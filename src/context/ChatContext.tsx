import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { streamChat } from '../api/aiChat';

const SESSION_STORAGE_KEY = 'tomato.chat.sessionId';

const TOOL_LABELS: Record<string, string> = {
  listRestaurants: 'restaurants',
  getMenu: 'the menu',
  getOrderStatus: 'your order',
  getOrderDetails: 'your order',
  listMyOrders: 'your orders',
  placeOrder: 'your order',
  cancelOrder: 'your order',
  getMyMenu: 'your menu',
  addMenuItem: 'your menu',
  updateMenuItem: 'your menu',
  deactivateMenuItem: 'your menu',
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  pending?: boolean;
  error?: boolean;
}

interface ChatContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  messages: ChatMessage[];
  isStreaming: boolean;
  toolStatus: string | null;
  sendMessage: (text: string) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function readSessionId(): string | undefined {
  return sessionStorage.getItem(SESSION_STORAGE_KEY) ?? undefined;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const sessionIdRef = useRef<string | undefined>(readSessionId());
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: trimmed },
      { id: assistantMessageId, role: 'assistant', text: '', pending: true },
    ]);
    setIsStreaming(true);
    setToolStatus(null);

    const controller = new AbortController();
    abortRef.current = controller;

    void streamChat(
      trimmed,
      sessionIdRef.current,
      {
        onSession: (sessionId) => {
          sessionIdRef.current = sessionId;
          sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
        },
        onToken: (chunk) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMessageId ? { ...m, text: m.text + chunk, pending: false } : m))
          );
        },
        onTool: (name, phase) => {
          setToolStatus(phase === 'start' ? `Checking ${TOOL_LABELS[name] ?? 'that'}...` : null);
        },
        onDone: () => {
          setMessages((prev) => prev.map((m) => (m.id === assistantMessageId ? { ...m, pending: false } : m)));
          setIsStreaming(false);
          setToolStatus(null);
        },
        onError: (message) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId ? { ...m, text: message, pending: false, error: true } : m
            )
          );
          setIsStreaming(false);
          setToolStatus(null);
        },
      },
      controller.signal
    );
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
    setToolStatus(null);
    sessionIdRef.current = undefined;
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const value: ChatContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
    messages,
    isStreaming,
    toolStatus,
    sendMessage,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within a ChatProvider');
  return ctx;
}
