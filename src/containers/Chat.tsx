import { useLayoutEffect, useState } from 'react';

import { useVoxelize } from '../hooks/useVoxelize';

const chatMargin = '16px';
const chatVanishTime = 5000;

export function Chat() {
  const { chat, inputs, rigidControls } = useVoxelize();

  const [shouldShowChat, setShouldShowChat] = useState(false);

  useLayoutEffect(() => {
    if (!chat || !inputs || !rigidControls) {
      return;
    }

    chat.onChat = (chat) => {
      console.log(chat);
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
      <ul className="list-none overflow-auto w-full rounded max-h-[200px] flex flex-col"></ul>
    </div>
  );
}
