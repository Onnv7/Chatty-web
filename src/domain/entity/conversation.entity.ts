import { ActiveStatus, Gender } from '../../common/constant/enum';

export type ConversationEntity = {
  id: string;
  imageUrl: string;
  lastMessage: string;
  lastSendAt: string;
  name: string;
  senderId: number;
  activeStatus: ActiveStatus;
  lastActiveAt: string;
  friendId?: number;
};

export type MessageEntity = {
  messageChain: {
    id?: string;
    content: string;
    createdAt: Date;
    reactionList: string[];
    reactedCount: number;
  }[];
  senderId: number;
};

export type ConversationSelectedEntity = {
  id?: string;
  roomName: string;
  imageUrl: string;
  // lastMessage: string;
  // lastSentAt: Date;
  // senderId: number;
};

export type UpdateNewMessageEntity = {
  conversationId: string;
  senderId: number;
  createdAt: string;
  content: string;
};

export type ConversationInfoEntity = {
  memberList: {
    id: number;
    name: string;
    avatarUrl: string;
  }[];
  imageUrl: string;
  name: string;
};

export interface SendNewMessageSocketData {
  senderId: number;
  conversationId: string;
  content: string;
  createdAt: string;
}

export interface SendReactionSocketData {
  senderId: number;
  conversationId: string;
  messageId: string;
  reactionList: string[];
  reactedCount: number;
}

export type UpdateNewActiveFriendEntity = {
  activeStatus: ActiveStatus;
  friendId: number;
};

export type ConversationSummaryEntity = {
  name: string;
  imageUrl: string;
};

export type ReactMessageEntity = {
  reactionList: string[];
  reactedCount: number;
};

export type UserProfileEntity = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  gender: Gender;
  birthDate: Date;
};
