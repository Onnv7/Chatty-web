import { AuthAPI } from '../api/auth.api';
import { ConversationApi } from '../api/conversation.api';
import { FriendAPI } from '../api/friend.api';
import { MessageApi } from '../api/message.api';
import { AuthLocalStorage } from '../local/auth.localstorage';
import { AuthRepository } from './auth.repository';
import { ConversationRepository } from './conversation.repository';
import { FriendRepository } from './friend.repository';
import { MessageRepository } from './message.repository';

const authApi = new AuthAPI();
const authLocalStorage = new AuthLocalStorage();
const authRepository = new AuthRepository(authApi, authLocalStorage);

const friendApi = new FriendAPI();
const friendRepository = new FriendRepository(friendApi);

const conversationApi = new ConversationApi();
const conversationRepository = new ConversationRepository(conversationApi);

const messageApi = new MessageApi();
const messageRepository = new MessageRepository(messageApi);

export {
  authRepository,
  friendRepository,
  conversationRepository,
  messageRepository,
};