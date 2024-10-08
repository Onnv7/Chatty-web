import { http, httpAuth } from '../../common/config/http.config';
import { PageEntity } from '../../domain/entity/common.entity';
import {
  GetConversationByFriendIdResponse,
  GetConversationPageResponse,
  GetConversationResponse,
} from '../model/response/conversation.response';

export class ConversationApi {
  constructor() {}

  async getConversationPage(
    page: number,
    size: number,
    userId: number,
  ): Promise<GetConversationPageResponse> {
    const responseData = (
      await httpAuth.get(
        `/conversation/user/${userId}?page=${page}&size=${size}`,
      )
    ).data;

    return responseData.data;
  }

  async getConversation(
    conversationId: string,
  ): Promise<GetConversationResponse> {
    const responseData = (await httpAuth.get(`/conversation/${conversationId}`))
      .data;

    return responseData.data;
  }

  async getConversationByFriendId(
    friendId: number,
    userId: number,
  ): Promise<GetConversationByFriendIdResponse> {
    const responseData = (
      await httpAuth.get(
        `/conversation/exist/user/${userId}?friendId=${friendId}`,
      )
    ).data;

    return responseData.data;
  }
}
