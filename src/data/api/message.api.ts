import { http, httpAuth } from '../../common/config/http.config';
import { SendMessageRequest } from '../model/request/message.request';
import { GetMessagePageResponse } from '../model/response/message.response';

export class MessageApi {
  async getMessagePage(
    page: number,
    size: number,
    conversationId: string,
  ): Promise<GetMessagePageResponse> {
    const responseData = (
      await http.get(
        `/message/conversation/${conversationId}?page=${page}&size=${size}`,
      )
    ).data;
    return responseData.data;
  }

  async sendMessage(body: SendMessageRequest) {
    const responseData = (await httpAuth.post(`/message/send`, body)).data;
    return responseData.data;
  }
}
