import { http, httpAuth } from '../../common/config/http.config';
import {
  ReactMessageRequest,
  SendMessageRequest,
} from '../model/request/message.request';
import {
  GetMessagePageResponse,
  ReactMessageResponse,
  SendMessageResponse,
} from '../model/response/message.response';

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

  async sendMessage(body: SendMessageRequest): Promise<SendMessageResponse> {
    const responseData = (await httpAuth.post(`/message/send`, body)).data;
    return responseData.data;
  }

  async reactMessage(body: ReactMessageRequest): Promise<ReactMessageResponse> {
    const responseData = (await httpAuth.post(`/message/react`, body)).data;
    return responseData.data;
  }
}
