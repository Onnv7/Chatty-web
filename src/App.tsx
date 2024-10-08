import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
  useNavigate,
} from 'react-router-dom';
import './index.css';
import LoginPage from './presentation/page/login/LoginPage';
import RegisterPage from './presentation/page/register/RegisterPage';
import { AppRouter } from './common/config/router.config';
import AppLayout from './presentation/layout/AppLayout/AppLayout';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuthContext } from './common/context/auth.context';
import { getUserIdLocal } from './domain/usecase/app.usecase';

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route>
      <Route path="" element={<AppLayout />}>
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
  const { userId, authDispatch } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      const currentUserId = getUserIdLocal();
      if (currentUserId)
        authDispatch({ type: 'LOGIN_SUCCESS', payload: currentUserId });
      else navigate(AppRouter.login.route);
    }
  }, []);
  return (
    <>
      <Routes>
        <Route>
          <Route path="" element={<AppLayout />}>
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
        </Route>
        <Route path={AppRouter.login.route} element={AppRouter.login.page} />,
        <Route
          path={AppRouter.register.route}
          element={AppRouter.register.page}
        />
      </Routes>
    </>
  );
}

export default App;
