export type GetConversationPageResponse = {
  totalPage: number;
  conversationList: {
    id: string;
    name: string;
    imageUrl: string;
    lastMessage: string;
    lastSendAt: Date;
  }[];
};
