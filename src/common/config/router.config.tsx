import ConversationPage from '../../presentation/page/conversation/ConversationPage';
import LoginPage from '../../presentation/page/login/LoginPage';
import RegisterPage from '../../presentation/page/register/RegisterPage';

export const AppRouter = {
  login: {
    page: <LoginPage />,
    route: '/',
  },
  register: {
    page: <RegisterPage />,
    route: '/register',
  },
  dashboard: {
    route: '/dashboard',
  },
  conversation: {
    page: <ConversationPage />,
    route: '/conversation',
  },
};
