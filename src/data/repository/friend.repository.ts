import { ActorType, Gender } from '../../common/constant/enum';
import {
  FriendInvitationEntity,
  FriendSearchEntity,
  ProcessInvitationEntity,
} from '../../domain/entity/friend.entity';
import { FriendAPI } from '../api/friend.api';

export class FriendRepository {
  constructor(private readonly friendApi: FriendAPI) {}

  async searchFriend(
    page: number,
    size: number,
    userId: number,
    key: string,
    gender?: Gender,
  ): Promise<{ totalPage: number; friendList: FriendSearchEntity[] }> {
    const data = await this.friendApi.searchFriend(
      page,
      size,
      userId,
      key,
      gender,
    );
    return {
      totalPage: data.totalPage,
      friendList: data.friendList.map((item) => ({
        invitationId: item.invitationId,
        profileId: item.profileId,
        avatarUrl: item.avatarUrl,
        fullName: item.fullName,
        gender: item.gender,
        relationship: item.relationship,
      })),
    };
  }

  async getInvitationList(
    page: number,
    size: number,
    userId: number,
    actor: ActorType,
  ) {
    const data = await this.friendApi.getInvitationList(
      page,
      size,
      userId,
      actor,
    );
    return {
      totalPage: data.totalPage,
      invitationList: data.invitationList.map((item) => ({
        invitationId: item.invitationId,
        profileId: item.profileId,
        avatarUrl: item.avatarUrl,
        fullName: item.fullName,
        gender: item.gender,
      })),
    };
  }
  async sendInvitation(userId: number, receiverId: number) {
    const data = await this.friendApi.sendInvitation({
      senderId: userId,
      receiverId: receiverId,
    });
    return data;
  }

  async processInvitation(body: ProcessInvitationEntity) {
    const data = await this.friendApi.processInvitation({
      ...body,
    });
    return data;
  }
}
