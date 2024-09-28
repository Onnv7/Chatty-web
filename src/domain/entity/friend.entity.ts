import {
  Gender,
  InvitationAction,
  Relationship,
} from '../../common/constant/enum';

export type FriendSearchEntity = {
  profileId: number;
  avatarUrl: string;
  fullName: string;
  gender: Gender;
  relationship: Relationship;
  invitationId?: number;
};

export type FriendInvitationEntity = {
  invitationId: number;
  profileId: number;
  avatarUrl: string;
  fullName: string;
  gender: Gender;
};

export type ProcessInvitationEntity = {
  invitationId: number;
  action: InvitationAction;
};
