import React from "react";

type ButtonSignProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonSign = ({ children, ...rest }: ButtonSignProps) => {
  return (
    <button
      {...rest}
      className={`${rest.className ?? ""} h-full rounded px-4 py-2 font-bold`}
    >
      {children}
    </button>
  );
};

export default ButtonSign;
