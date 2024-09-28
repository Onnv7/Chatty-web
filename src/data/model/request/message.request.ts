

export type SendMessageRequest = {
    content: string;
    senderId: number;
    memberIdList: number[]
} | {
    content: string;
    senderId: number;
    conversationId: string;
}