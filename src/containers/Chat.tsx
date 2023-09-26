import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useVoxelize } from '../hooks/useVoxelize';
import type { ChatItem } from '../types';

const chatMargin = '16px';
const chatVanishTime = 5000;

let removeTimeout: NodeJS.Timeout;

export function Chat() {
  const { chat, inputs, rigidControls, world } = useVoxelize();

  const chatListDomRef = useRef<HTMLUListElement>(null);
  const chatInputDomRef = useRef<HTMLInputElement>(null);

  const [chatItems, setChatItems] = useState<ChatItem[]>([]);

  const hideInput = () => {
    if (!chatInputDomRef.current) return;

    chatInputDomRef.current!.value = '';
    chatInputDomRef.current!.style.visibility = 'hidden';
    chatInputDomRef.current?.blur();
  };

  const showChatList = () => {
    clearTimeout(removeTimeout);
    chatListDomRef.current?.classList.remove('remove');
  };

  const hideChatList = () => {
    clearTimeout(removeTimeout);

    removeTimeout = setTimeout(() => {
      chatListDomRef.current?.classList.add('remove');
    }, chatVanishTime);
  };

  const openChatInput = useCallback(
    (isCommand = false) => {
      inputs?.setNamespace('chat');
      chatInputDomRef.current!.style.visibility = 'visible';
      chatInputDomRef.current?.focus();
      clearTimeout(removeTimeout);
      rigidControls?.unlock();

      setTimeout(() => {
        if (chatInputDomRef.current)
          chatInputDomRef.current.value =
            isCommand && chat ? chat.commandSymbol : '';
      }, 10);
    },
    [chat, inputs, rigidControls],
  );

  useLayoutEffect(() => {
    if (!chat || !inputs || !rigidControls) {
      return;
    }

    chat.onChat = (chat: ChatItem) => {
      setChatItems((prev) => [...prev, chat]);
      showChatList();

      if (inputs.namespace !== 'chat') {
        hideChatList();
      }
    };

    rigidControls.on('lock', () => {
      if (inputs.namespace !== 'in-game') {
        inputs.setNamespace('in-game');
      }

      hideChatList();
      hideInput();
    });

    rigidControls.on('unlock', () => {
      if (
        chatInputDomRef.current?.style.visibility === 'hidden' &&
        inputs.namespace === 'in-game'
      ) {
        inputs.setNamespace('menu');
      }
    });

    inputs.bind(
      't',
      () => {
        rigidControls.unlock();
        openChatInput();
      },
      'in-game',
    );

    inputs.bind(
      chat.commandSymbol,
      () => {
        openChatInput(true);
        chatInputDomRef.current!.focus();
      },
      'in-game',
    );

    return () => {
      inputs.unbind('t');
      inputs.unbind(chat.commandSymbol);
    };
  }, [chat, inputs, openChatInput, rigidControls, world]);

  useEffect(() => {
    chatListDomRef.current?.children[
      chatListDomRef.current?.children.length - 1
    ]?.scrollIntoView();
  }, [chatItems]);

  return (
    <div
      className="absolute bottom-px left-1/2 transform translate-x-[-50%] flex flex-col w-[60vw] gap-2"
      style={{
        width: 'calc(100% - ${chatMargin} * 2)',
        margin: chatMargin,
      }}
    >
      <ul
        className="list-none overflow-auto w-full rounded max-h-[200px] flex flex-col bg-overlay"
        ref={chatListDomRef}
      >
        {chatItems.map((chatItem, index) => (
          <div
            key={chatItem.body + index}
            className="flex items-center gap-1 text-background-primary px-3 py-2 text-xs"
          >
            {chatItem.sender && <p>{chatItem.sender}: </p>}
            <p>{chatItem.body}</p>
          </div>
        ))}
      </ul>
      <input
        ref={chatInputDomRef}
        className="border-none bg-overlay rounded outline-none px-3 py-2 text-background-primary text-xs"
        style={{ visibility: 'hidden' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            chat?.send({
              type: 'chat',
              sender: 'hi',
              body: e.currentTarget.value,
            });
            e.currentTarget.value = '';

            hideInput();
            rigidControls?.lock();
          }
        }}
      />
    </div>
  );
}
