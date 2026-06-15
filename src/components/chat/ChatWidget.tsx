import { useChatContext } from '../../context/ChatContext';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';

export function ChatWidget() {
  const { isOpen } = useChatContext();

  return (
    <>
      {isOpen && <ChatWindow />}
      <ChatButton />
    </>
  );
}
