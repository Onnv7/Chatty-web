import {
  MessageEntity,
  ReactMessageEntity,
} from '../../domain/entity/conversation.entity';
import { MessageApi } from '../api/message.api';
import { SendMessageRequest } from '../model/request/message.request';

export class MessageRepository {
  constructor(private readonly messageApi: MessageApi) {}

  async getMessagePage(page: number, size: number, conversationId: string) {
    const data = await this.messageApi.getMessagePage(
      page,
      size,
      conversationId,
    );

    return {
      totalPage: data.totalPage,
      messageList: (data.messageList as MessageEntity[]) ?? [],
    };
  }

  async sendMessage(
    content: string,
    userId: number,
    conversationId?: string,
    memberIdList?: number[],
  ) {
    const body: SendMessageRequest = conversationId
      ? {
          content,
          senderId: userId,
          conversationId,
        }
      : {
          content,
          senderId: userId,
          memberIdList: memberIdList!,
        };
    const data = await this.messageApi.sendMessage(body);
    if (data) {
      return data.id;
    }
  }

  async reactMessage(
    userId: number,
    reaction: string,
    messageId: string,
  ): Promise<ReactMessageEntity> {
    const data = await this.messageApi.reactMessage({
      senderId: userId,
      reaction,
      messageId,
    });
    return {
      reactionList: data.reactionList,
      reactedCount: data.reactedCount,
    };
  }
}
