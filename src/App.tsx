import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import LoginPage from './presentation/page/login/LoginPage';
import RegisterPage from './presentation/page/register/RegisterPage';
import { AppRouter } from './common/config/router.config';
import AppLayout from './presentation/layout/AppLayout/AppLayout';

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route>
      <Route path="/" element={<AppLayout />}>
        <Route
          path={AppRouter.conversation.route}
          element={AppRouter.conversation.page}
        />
        <Route
          path={AppRouter.friends.route}
          element={AppRouter.friends.page}
        />
        <Route
          path={AppRouter.invitation.route}
          element={AppRouter.invitation.page}
        />
      </Route>
    </Route>,
    <Route path={AppRouter.login.route} element={AppRouter.login.page} />,
    <Route path={AppRouter.register.route} element={AppRouter.register.page} />,
  ]),
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
