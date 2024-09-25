import HIDE_ICON from '@icon/eye_close_icon.svg';
import VISIBLE_ICON from '@icon/eye_open_icon.svg';
import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type LoginInputProps = {
  iconPath: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'password';
  register?: UseFormRegisterReturn<any>;
  error?: string;
};
function LoginInput({
  className,
  iconPath,
  placeholder,
  type = 'text',
  error = '',
  register,
}: LoginInputProps) {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  return (
    <div>
      <div
        className={`relative flex h-[2.4rem] w-full items-center rounded-[0.6rem] bg-gray-200 ${className}`}
      >
        <img src={iconPath} alt="" className="mx-2 size-[1.4rem]" />
        <input
          {...register}
          placeholder={placeholder}
          type={
            type === 'password'
              ? isVisiblePassword
                ? 'text'
                : 'password'
              : 'text'
          }
          className="w-full bg-transparent outline-none"
        />
        {type === 'password' && (
          <img
            src={isVisiblePassword ? VISIBLE_ICON : HIDE_ICON}
            alt=""
            className="mx-2 size-[1.2rem] cursor-pointer"
            onClick={() => setIsVisiblePassword((prev) => !prev)}
          />
        )}
      </div>
      {error && <p className="text-8 text-red-500">{error}</p>}
    </div>
  );
}

export default LoginInput;
