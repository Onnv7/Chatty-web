import { UserProfileEntity } from '../../domain/entity/conversation.entity';
import { ProfileApi } from '../api/profile.api';

export class ProfileRepository {
  constructor(private readonly profileApi: ProfileApi) {}

  async getUserProfile(userId: number): Promise<UserProfileEntity> {
    const data = await this.profileApi.getUserProfile(userId);
    return data;
  }
}
