export type GetMessagePageResponse = {
  totalPage: number;
  messageList: {
    messageChain: {
      content: string;
      createdAt: Date;
    }[];
    senderId: number;
    avatarUrl: string;
  }[];
};
