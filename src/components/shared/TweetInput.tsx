import React from "react";

type TweetInputProps = {
  inputValue: string;
  inputRef: (textArea: HTMLTextAreaElement) => void;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  error?: { error: boolean; message: string };
};

const TweetInput = ({
  inputValue,
  inputRef,
  setInputValue,
  error,
}: TweetInputProps) => {
  return (
    <textarea
      style={{ height: 0 }}
      value={inputValue}
      ref={inputRef}
      onChange={(e) => setInputValue(e.target.value)}
      className={`w-full resize-none overflow-hidden border-b p-4 dark:border-gray-500 dark:bg-black dark:text-white ${
        error && error.error ? "outline outline-red-500" : "outline-none"
      }`}
      placeholder="What's happening?"
      maxLength={280}
    />
  );
};

export default TweetInput;
