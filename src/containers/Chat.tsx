import { useLayoutEffect, useRef, useState } from 'react';

import { useVoxelize } from '../hooks/useVoxelize';
import type { ChatItem } from '../types';

const chatMargin = '16px';
const chatVanishTime = 5000;

export function Chat() {
  const { chat, inputs, rigidControls } = useVoxelize();

  const chatListDomRef = useRef<HTMLUListElement>(null);
  const chatInputDomRef = useRef<HTMLInputElement>(null);

  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [shouldShowChat, setShouldShowChat] = useState(false);

  useLayoutEffect(() => {
    if (!chat || !inputs || !rigidControls) {
      return;
    }

    chat.onChat = (chat: ChatItem) => {
      setChatItems((prev) => [...prev, chat]);
    };

    inputs.bind(
      't',
      () => {
        setShouldShowChat(true);
        rigidControls.unlock();
        chat.send({
          type: 'chat',
          sender: 'hi',
          body: 'hello',
        });
      },
      'in-game',
    );
  }, [chat, inputs, rigidControls]);

  return (
    <div
      className="absolute bottom-0 left-1/2 transform translate-x-[-1/2] flex flex-col w-[60vw] gap-2"
      style={{
        width: 'calc(100% - ${chatMargin} * 2)',
        margin: chatMargin,
      }}
    >
      <ul
        className="list-none overflow-auto w-full rounded max-h-[200px] flex flex-col"
        ref={chatListDomRef}
      >
        {chatItems.map((chatItem, index) => (
          <div key={chatItem.body + index} className="flex items-center gap-1">
            <p>{chatItem.sender}</p>
            <p>{chatItem.body}</p>
          </div>
        ))}
      </ul>
      <input ref={chatInputDomRef} />
    </div>
  );
}
