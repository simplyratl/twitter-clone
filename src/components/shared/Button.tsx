import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  defaultColor: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, defaultColor, ...rest }: ButtonProps) => {
  const classes = `${
    defaultColor ? "bg-gray-200 text-black hover:bg-gray-300" : "text-white"
  }`;

  return (
    <button
      {...rest}
      className={`${
        rest.className ?? ""
      } rounded-full bg-blue-500 px-4 py-1 font-medium hover:bg-blue-600 ${classes}`}
    >
      {children}
    </button>
  );
};

export default Button;
