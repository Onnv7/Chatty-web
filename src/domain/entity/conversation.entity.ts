export type ConversationEntity = {
  id: string;
  imageUrl: string;
  lastMessage: string;
  lastSendAt: string;
  name: string;
  senderId: number;
};

export type MessageEntity = {
  messageChain: {
    content: string;
    createdAt: Date;
  }[];
  senderId: number;
  avatarUrl: string;
};

export type ConversationSelectedEntity = {
  id?: string;
  roomName: string;
  imageUrl: string;
  // lastMessage: string;
  // lastSentAt: Date;
  // senderId: number;
};

export type UpdateNewMessageEntity = {
  conversationId: string;
  senderId: number;
  createdAt: string;
  content: string;
};
