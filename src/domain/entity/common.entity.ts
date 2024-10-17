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
