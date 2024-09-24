import HIDE_ICON from "@icon/eye_close_icon.svg";
import VISIBLE_ICON from "@icon/eye_open_icon.svg";
import { useState } from "react";

type LoginInputProps = {
  iconPath: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "password";
};
function LoginInput({
  className,
  iconPath,
  placeholder,
  type = "text",
}: LoginInputProps) {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  return (
    <div
      className={`relative flex items-center w-full h-[2.4rem] bg-gray-200 rounded-[0.6rem] ${className}`}
    >
      <img src={iconPath} alt="" className="size-[1.4rem]  mx-2" />
      <input
        placeholder={placeholder}
        type={
          type === "password"
            ? isVisiblePassword
              ? "text"
              : "password"
            : "text"
        }
        className="w-full bg-transparent outline-none"
      />
      {type === "password" && (
        <img
          src={isVisiblePassword ? VISIBLE_ICON : HIDE_ICON}
          alt=""
          className="size-[1.2rem] mx-2 cursor-pointer"
          onClick={() => setIsVisiblePassword((prev) => !prev)}
        />
      )}
    </div>
  );
}

export default LoginInput;
