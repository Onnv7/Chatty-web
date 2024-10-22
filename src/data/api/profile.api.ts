import { httpAuth } from '../../common/config/http.config';
import { GetUserProfileResponse } from '../model/response/profile.response';

export class ProfileApi {
  constructor() {}

  async getUserProfile(userId: number): Promise<GetUserProfileResponse> {
    const responseData = (await httpAuth.get(`/profile/user/${userId}`)).data;
    return responseData.data;
  }
}
