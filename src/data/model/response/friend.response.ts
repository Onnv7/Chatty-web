import { Gender, Relationship } from '../../../common/constant/enum';

export type SearchFriendResponse = {
  totalPage: number;
  friendList: {
    invitationId?: number;
    profileId: number;
    avatarUrl: string;
    fullName: string;
    gender: Gender;
    relationship: Relationship;
  }[];
};
export type InvitationProfile = {};

export type GetInvitationResponse = {
  totalPage: number;
  invitationList: {
    invitationId: number;
    profileId: number;
    avatarUrl: string;
    fullName: string;
    gender: Gender;
  }[];
};

export type GetFriendProfileSummary = {
  fullName: string;
  avatarUrl: string;
};
