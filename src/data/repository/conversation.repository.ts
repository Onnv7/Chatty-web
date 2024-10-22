import {
  ConversationEntity,
  ConversationInfoEntity,
} from '../../domain/entity/conversation.entity';
import { ConversationApi } from '../api/conversation.api';

export class ConversationRepository {
  constructor(private readonly conversationApi: ConversationApi) {}

  async getConversationPage(page: number, size: number, userId: number) {
    const data = await this.conversationApi.getConversationPage(
      page,
      size,
      userId,
    );
    return {
      totalPage: data.totalPage,
      conversationList: data.conversationList as ConversationEntity[],
    };
  }

  async getConversation(
    conversationId: string,
    userId: number,
  ): Promise<ConversationInfoEntity> {
    const data = await this.conversationApi.getConversation(conversationId);
    const friend = data.memberList.find((u) => u.id !== userId);
    return {
      memberList: data.memberList,
      imageUrl: friend?.avatarUrl || '',
      name: friend?.name || '',
    };
  }

  async getConversationIdByFriendId(
    friendId: number,
    userId: number,
  ): Promise<string | undefined> {
    const data = await this.conversationApi.getConversationByFriendId(
      friendId,
      userId,
    );
    return data.id;
  }
}
