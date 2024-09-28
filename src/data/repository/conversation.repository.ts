import { ConversationEntity } from '../../domain/entity/conversation.entity';
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
}
