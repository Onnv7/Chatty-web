import { ActiveStatus } from '../../../common/constant/enum';

export type GetConversationPageResponse = {
  totalPage: number;
  conversationList: {
    id: string;
    name: string;
    imageUrl: string;
    lastMessage: string;
    senderId: number;
    lastSendAt: string;
    activeStatus: ActiveStatus;
    lastActiveAt: Date;
    friendId?: number;
  }[];
};

export type GetConversationResponse = {
  memberList: {
    id: number;
    name: string;
    avatarUrl: string;
  }[];
};

export type GetConversationByFriendIdResponse = {
  id?: string;
};
