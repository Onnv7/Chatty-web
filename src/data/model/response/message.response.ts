export type GetMessagePageResponse = {
  totalPage: number;
  messageList: {
    messageChain: {
      id: string;
      content: string;
      createdAt: Date;
      reactionList: string[];
      reactedCount: number;
    }[];
    senderId: number;
  }[];
};

export type SendMessageResponse = {
  id?: string;
};

export type ReactMessageResponse = {
  reactionList: string[];
  reactedCount: number;
};
