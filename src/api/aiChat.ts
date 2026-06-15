import { getAuthToken } from './client';

const AI_SERVICE_BASE_URL = import.meta.env.VITE_AI_SERVICE_BASE_URL || '';

// When VITE_AI_SERVICE_BASE_URL is unset, use the relative /ai path (rewritten
// to /api/ai and proxied to tomato-ai-service by vite.config.ts) instead of
// /api/ai/..., which the dev proxy would otherwise route to tomato-backend.
const CHAT_STREAM_URL = AI_SERVICE_BASE_URL ? `${AI_SERVICE_BASE_URL}/api/ai/chat/stream` : '/ai/chat/stream';

export interface ChatStreamHandlers {
  onSession?: (sessionId: string) => void;
  onToken: (text: string) => void;
  onTool?: (name: string, phase: 'start' | 'end') => void;
  onDone: () => void;
  onError: (message: string) => void;
}

export async function streamChat(
  message: string,
  sessionId: string | undefined,
  handlers: ChatStreamHandlers,
  signal: AbortSignal
) {
  let res: Response;
  try {
    res = await fetch(CHAT_STREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ sessionId, message }),
      signal,
    });
  } catch {
    handlers.onError('Could not reach the assistant. Please check your connection and try again.');
    return;
  }

  if (!res.ok || !res.body) {
    handlers.onError(`Chat request failed (${res.status})`);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sepIndex;
    while ((sepIndex = buffer.indexOf('\n\n')) >= 0) {
      const rawEvent = buffer.slice(0, sepIndex);
      buffer = buffer.slice(sepIndex + 2);
      dispatchSseEvent(rawEvent, handlers);
    }
  }
}

function dispatchSseEvent(raw: string, handlers: ChatStreamHandlers) {
  const eventLine = raw.split('\n').find((line) => line.startsWith('event:'));
  const dataLine = raw.split('\n').find((line) => line.startsWith('data:'));
  const event = eventLine?.slice(6).trim() ?? 'message';
  const data = dataLine ? JSON.parse(dataLine.slice(5).trim()) : {};

  switch (event) {
    case 'session':
      handlers.onSession?.(data.sessionId);
      break;
    case 'token':
      handlers.onToken(data.text);
      break;
    case 'tool':
      handlers.onTool?.(data.name, data.phase);
      break;
    case 'done':
      handlers.onDone();
      break;
    case 'error':
      handlers.onError(data.message);
      break;
  }
}
