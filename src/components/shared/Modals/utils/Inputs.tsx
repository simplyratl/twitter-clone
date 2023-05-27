import React, { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
};

type InputAddOnProps = InputProps & {
  addon: string;
};

export const Input = ({
  label,
  placeholder,
  type = "text",
  defaultValue = "",
  ...rest
}: InputProps) => {
  return (
    <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-indigo-600 dark:border-gray-600">
      <label
        htmlFor={label}
        className="block text-xs font-medium text-gray-500"
      >
        {label}
      </label>
      <input
        type={type}
        name={label}
        id={label}
        defaultValue={defaultValue}
        className="block w-full border-0 bg-transparent p-0 text-gray-900 placeholder-gray-500 outline-none focus:ring-0 dark:text-white sm:text-sm"
        autoComplete="off"
        {...rest}
      />
    </div>
  );
};

export const InputAddOn = ({
  label,
  placeholder,
  type = "text",
  defaultValue = "",
  addon,
  ...rest
}: InputAddOnProps) => {
  return (
    <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-indigo-600 dark:border-gray-600">
      <label
        htmlFor={label}
        className="block text-xs font-medium text-gray-500"
      >
        {label}
      </label>

      <div className="mt-1 flex rounded-md shadow-sm">
        <span className="inline-flex items-center text-black dark:text-white sm:text-sm">
          {addon}
        </span>
        <input
          type={type}
          name={label}
          id={label}
          defaultValue={defaultValue}
          className="block w-full border-0 bg-transparent p-0 text-gray-900 placeholder-gray-500 outline-none focus:ring-0 dark:text-white sm:text-sm"
          autoComplete="off"
          {...rest}
        />
      </div>
    </div>
  );
};
