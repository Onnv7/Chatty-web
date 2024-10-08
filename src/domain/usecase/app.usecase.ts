import { Socket } from 'socket.io-client';
import { authRepository } from '../../data/repository';
import { ConversationEntity } from '../entity/conversation.entity';
import {
  HeartbeatSocketData,
  TrackingFriendSocketData,
} from '../entity/common.entity';

export async function logout() {}

export function getUserIdLocal() {
  return Number(authRepository.getUserId());
}

export function emitHeartbeat(data: HeartbeatSocketData, socket: Socket) {
  socket.emit('heartbeat', data);
}

export function emitJoinTrackingRoom(
  conversationList: ConversationEntity[],
  socket: Socket,
) {
  let friendIdList: number[] = [];
  conversationList.forEach((conv) => {
    if (conv.friendId) {
      friendIdList.push(conv.friendId);
    }
  });
  socket.emit('join-room-friend-tracking', {
    friendIdList: friendIdList,
  });
}
