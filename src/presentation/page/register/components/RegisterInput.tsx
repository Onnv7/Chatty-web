import HIDE_ICON from '@icon/eye_close_icon.svg';
import VISIBLE_ICON from '@icon/eye_open_icon.svg';
import { useState } from 'react';
import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';

type RegisterInputProps = {
  placeholder?: string;
  className?: string;
  type?: 'text' | 'password';
  register?: UseFormRegisterReturn<any>;
  error?: string;
};
function RegisterInput({
  className,
  placeholder,
  type = 'text',
  register,
  error = '',
}: RegisterInputProps) {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  return (
    <div>
      {placeholder && <h1 className="mb-1 font-5">{placeholder}</h1>}
      <div
        className={`relative flex h-[2.4rem] w-full items-center rounded-[0.6rem] border-[1px] bg-white ${className}`}
      >
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
          className="ml-2 w-full bg-transparent outline-none"
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

export default RegisterInput;
