import GOOGLE_ICON from '@icon/google_icon.svg';
import REGISTER_ILL_IMG from '@image/register_illustration_image.png';
import APP_ICON from '@icon/app_icon.svg';
import RegisterInput from './components/RegisterInput';
import { useNavigate } from 'react-router-dom';
import { AppRouter } from '../../../common/config/router.config';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Gender } from '../../../common/constant/enum';
import { Controller, useForm } from 'react-hook-form';
import { RegisterAccountEntity } from '../../../domain/entity/register.entity';
import dayjs from 'dayjs';
import { formatYMD } from '../../../common/util/date.util';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../../common/zod/register.zod';
import { registerAccount } from '../../../domain/usecase/register.usecase';
import { handleException } from '../../../common/exception/api.exeption';
import { toastNotification } from '../../../common/util/notification.util';

function RegisterPage() {
  const navigate = useNavigate();
  const form = useForm<RegisterAccountEntity>({
    resolver: zodResolver(registerSchema),
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  async function onSubmitForm(data: RegisterAccountEntity) {
    try {
      await registerAccount(data);
      toastNotification({ msg: 'Account registration successful' });
    } catch (err) {
      handleException(err);
    }
  }

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-register-background bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-register-background bg-cover bg-center bg-no-repeat blur-md" />
      <div className="relative grid grid-cols-2 overflow-hidden rounded-[1rem] shadow-md">
        <section className="shrink grow bg-white bg-opacity-95 p-4">
          <div className="mx-auto w-[90%]">
            <div>
              <img src={APP_ICON} alt="" className="mx-auto size-[3.2rem]" />
              <h1 className="mb-8 mt-8 text-center text-18 font-5">
                Create an account
              </h1>
            </div>
            <form action="" onSubmit={handleSubmit(onSubmitForm)}>
              <section className="flex flex-wrap justify-between">
                <RegisterInput
                  placeholder="First name"
                  register={register('firstName')}
                  error={errors.firstName?.message}
                />
                <RegisterInput
                  placeholder="Last name"
                  register={register('lastName')}
                  error={errors.lastName?.message}
                />
              </section>
              <RegisterInput
                placeholder="Email"
                register={register('email')}
                error={errors.email?.message}
              />
              <RegisterInput
                placeholder="Password"
                type="password"
                register={register('password')}
                error={errors.password?.message}
              />
              <RegisterInput
                placeholder="Confirm password"
                type="password"
                register={register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <h1 className="mb-1 font-5">Birth date</h1>
                <Controller
                  name="birthDate"
                  control={form.control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      format="YYYY-MM-DD"
                      slotProps={{
                        textField: {
                          className: 'w-full',
                          helperText: errors.birthDate
                            ? errors.birthDate.message
                            : 'YYYY-MM-DD',
                          size: 'small',
                          color: 'info',
                          error: !!errors.birthDate,
                        },
                      }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        return field.onChange(date?.toDate());
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <div>
                <span>
                  <h3 className="mb-1 font-5">Gender</h3>
                  <Controller
                    name="gender" // Tên của trường
                    control={form.control} // Truyền control từ useForm
                    defaultValue={Gender.FEMALE} // Giá trị mặc định
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        row
                        className="flex gap-8"
                        aria-labelledby="demo-radio-buttons-group-label"
                      >
                        <FormControlLabel
                          value={Gender.FEMALE}
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value={Gender.MALE}
                          control={<Radio />}
                          label="Male"
                        />
                      </RadioGroup>
                    )}
                  />
                </span>
              </div>

              <button
                type="submit"
                className="mb-2 mt-4 h-[2.6rem] w-full transform rounded-[0.8rem] bg-black text-12 text-white shadow-[0_10px_10px_-10px_rgba(0,0,0,0.9)] transition-transform hover:scale-[1.03] active:scale-95"
              >
                Create accout
              </button>
            </form>

            <hr className="my-8 border-t-2"></hr>
            <div>
              <p className="mb-2 text-center text-9">Or sign in with</p>
              <div className="flex cursor-pointer items-center justify-center rounded-[1rem] p-2 shadow-[0_10px_15px_-15px_rgba(0,0,0,0.3)]">
                <img src={GOOGLE_ICON} alt="" className="size-[1.5rem]" />
                <p className="ml-2 text-[1.1rem]">Google</p>
              </div>
            </div>
          </div>
          <div className="mb-2 mt-4 text-center">
            <p>
              Already account?{' '}
              <span
                className="cursor-pointer text-cyan-500 underline"
                onClick={() => navigate(AppRouter.login.route)}
              >
                Log In
              </span>
            </p>
          </div>
        </section>
        <section className="blend flex shrink grow items-center bg-cyan-100 bg-opacity-90">
          <img src={REGISTER_ILL_IMG} alt="" className="mix-blend- w-[30rem]" />
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
