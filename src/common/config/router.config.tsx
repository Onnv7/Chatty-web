import ConversationPage from '../../presentation/page/conversation/ConversationPage';
import FriendInvitationPage from '../../presentation/page/friend-request/FriendInvitationPage';
import FriendPage from '../../presentation/page/friend/FriendPage';
import LoginPage from '../../presentation/page/login/LoginPage';
import RegisterPage from '../../presentation/page/register/RegisterPage';

export const AppRouter = {
  login: {
    page: <LoginPage />,
    route: '/login',
  },
  register: {
    page: <RegisterPage />,
    route: '/register',
  },
  home: {
    route: '/home',
  },
  conversation: {
    page: <ConversationPage />,
    route: '/conversation',
  },
  friends: {
    page: <FriendPage />,
    route: '/friends',
  },
  invitation: {
    page: <FriendInvitationPage />,
    route: '/invitation',
  },
};
