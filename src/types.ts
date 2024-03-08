export type ChatItem = {
  type: 'chat' | 'owner-chat' | 'system';
  sender: string;
  body: string;
};
