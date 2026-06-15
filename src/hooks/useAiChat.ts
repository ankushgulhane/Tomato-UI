import { useChatContext } from '../context/ChatContext';

export function useAiChat() {
  const { messages, isStreaming, toolStatus, sendMessage } = useChatContext();
  return { messages, isStreaming, toolStatus, sendMessage };
}
