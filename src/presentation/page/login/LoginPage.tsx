import APP_ICON from '@src/assets/icon/app_icon.svg';
import EMAIL_ICON from '@src/assets/icon/email_icon.png';
import PASSWORD_ICON from '@src/assets/icon/lock_icon.png';
import LoginInput from './components/LoginInput';
import GOOGLE_ICON from '@icon/google_icon.svg';
import { useNavigate } from 'react-router-dom';
import { AppRouter } from '../../../common/config/router.config';
import { useForm } from 'react-hook-form';
import { LoginAccountEntity } from '../../../domain/entity/login.entity';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../common/zod/login.zod';
import { loginAccount } from '../../../domain/usecase/login.usecase';
import { toastNotification } from '../../../common/util/notification.util';
import { handleException } from '../../../common/exception/api.exeption';
import { useCallApi } from '../../../common/hook/useCallApi';
import { useAuthContext } from '../../../common/context/auth.context';

function LoginPage() {
  const { authDispatch, userId } = useAuthContext();
  const navigate = useNavigate();
  const loginApi = useCallApi();
  const form = useForm<LoginAccountEntity>({
    resolver: zodResolver(loginSchema),
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  async function onSubmit(formData: LoginAccountEntity) {
    loginApi.callApi(async () => {
      const data = await loginAccount(formData);
      authDispatch({ type: 'LOGIN_SUCCESS', payload: data.userId });
      toastNotification({ msg: 'Login successfully' });
      navigate(AppRouter.conversation.route);
    });
  }
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-login-background bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-login-background bg-cover bg-center bg-no-repeat blur-md" />
      <section className="relative rounded-[1rem] bg-white bg-gradient-to-b from-[#a3def7] from-5% via-white p-[2rem] shadow-[0_0px_60px_10px_rgba(128,157,173,0.8)]">
        <div className="child:text-center">
          <img src={APP_ICON} alt="" className="mx-auto mb-4 size-[3.2rem]" />
          <h1 className="text-14 font-5">Sign in with email</h1>
          <p className="my-2 max-w-[24rem] text-gray-500">
            Connect and Chat: Your Go-To App for Instant Messaging and Staying
            in Touch with Friends!
          </p>
        </div>
        <form action="" className="my-4" onSubmit={handleSubmit(onSubmit)}>
          <LoginInput
            register={register('username')}
            iconPath={EMAIL_ICON}
            placeholder="Email"
            className="my-2"
            error={errors.username?.message}
          />
          <LoginInput
            register={register('password')}
            iconPath={PASSWORD_ICON}
            placeholder="Password"
            type="password"
            className="my-2"
            error={errors.password?.message}
          />{' '}
          <div className="flex items-center justify-end">
            <p className="cursor-pointer text-[0.9rem]">Forgot password?</p>
          </div>
          <button
            type="submit"
            className="mb-2 mt-4 h-[2.6rem] w-full transform rounded-[0.8rem] bg-black text-12 text-white shadow-[0_10px_10px_-10px_rgba(0,0,0,0.9)] transition-transform hover:scale-[1.03] active:scale-95"
          >
            Get started
          </button>
        </form>
        <div>
          <p className="mb-2 text-center text-9">Or sign in with</p>
          <div className="flex cursor-pointer items-center justify-center rounded-[1rem] p-2 shadow-[0_10px_15px_-15px_rgba(0,0,0,0.3)]">
            <img src={GOOGLE_ICON} alt="" className="size-[1.5rem]" />
            <p className="ml-2 text-[1.1rem]">Google</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-center">
            Don't have account?{' '}
            <span
              onClick={() => navigate(AppRouter.register.route)}
              className="cursor-pointer text-cyan-500 underline"
            >
              Let register here
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
