import { http } from '../../common/config/http.config';
import { PageEntity } from '../../domain/entity/common.entity';
import { GetConversationPageResponse } from '../model/response/conversation.response';

export class ConversationApi {
  constructor() {}

  async getConversationPage(
    page: number,
    size: number,
    userId: number,
  ): Promise<GetConversationPageResponse> {
    const responseData = (
      await http.get(`/conversation/user/${userId}?page=${page}&size=${size}`)
    ).data;

    return responseData.data;
  }
}
