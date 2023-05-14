import React from "react";

type ButtonProps = {
  children: React.ReactNode;
};

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className={`rounded-full bg-blue-500 px-4 py-1 font-medium hover:bg-blue-600`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
