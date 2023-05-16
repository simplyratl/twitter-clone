import React from "react";

type ButtonProps = {
  default?: boolean;
  children: React.ReactNode;
};

const Button = ({ children, ...props }: ButtonProps) => {
  const classes = `${
    props.default ? "bg-gray-200 text-black hover:bg-gray-300" : "text-white"
  }`;

  return (
    <button
      className={`rounded-full bg-blue-500 px-4 py-1 font-medium hover:bg-blue-600 ${classes}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
