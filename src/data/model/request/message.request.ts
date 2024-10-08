export type SendMessageRequest =
  | {
      content: string;
      senderId: number;
      memberIdList: number[];
    }
  | {
      content: string;
      senderId: number;
      conversationId: string;
    };

export type ReactMessageRequest = {
  reaction: string;
  senderId: number;
  messageId: string;
};
