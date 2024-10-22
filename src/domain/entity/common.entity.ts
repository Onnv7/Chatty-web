import Peer, { MediaConnection } from 'peerjs';
import { ActiveStatus } from '../../common/constant/enum';

export type PageEntity = {
  pageSize: number;
  currentPage: number;
  totalPage?: number;
};

export interface HeartbeatSocketData {
  userId: number;
}

export interface RegisterSocketData {
  userId: number;
  peerId: string;
}

export interface TrackingFriendSocketData {
  senderId: number;
  activeStatus: ActiveStatus;
}

export type OngoingCallEntity = {
  isRinging: boolean;
  conversation: {
    id: string;
    imageUrl: string;
    name: string;
  };
};
