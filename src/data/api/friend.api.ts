import { http } from '../../common/config/http.config';
import { ActorType, Gender } from '../../common/constant/enum';
import {
  ProcessInvitationRequest,
  SendInvitationRequest,
} from '../model/request/friend.request';
import {
  GetInvitationResponse,
  SearchFriendResponse,
} from '../model/response/friend.response';

export class FriendAPI {
  constructor() {}

  async searchFriend(
    page: number,
    size: number,
    userId: number,
    key: string,
    gender?: Gender,
  ): Promise<SearchFriendResponse> {
    const responseData = (
      await http.get(
        `/friend/search?page=${page}&size=${size}&key=${key}&userId=${userId}` +
          (gender ? `&key=${gender}` : ''),
      )
    ).data;
    return responseData.data;
  }

  async getInvitationList(
    page: number,
    size: number,
    userId: number,
    actor: ActorType,
  ): Promise<GetInvitationResponse> {
    const responseData = (
      await http.get(
        `/friend/invitation/user/${userId}?page=${page}&size=${size}&actor=${actor}`,
      )
    ).data;
    return responseData.data;
  }

  async sendInvitation(body: SendInvitationRequest) {
    const responseData = (await http.post(`/friend/invitation/send`, body))
      .data;
    return responseData.data;
  }

  async processInvitation(body: ProcessInvitationRequest) {
    const responseData = (await http.put(`/friend/invitation/process`, body))
      .data;
    return responseData.data;
  }
}
