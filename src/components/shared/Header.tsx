import React from "react";
import { HiArrowSmallLeft } from "react-icons/hi2";
import HoverEffect from "~/utils/style/HoverEffect";
import Link from "next/link";
import SearchBar from "~/components/shared/SearchBar";

type HeaderProps = {
  children?: React.ReactNode;
  title: string;
  back?: boolean;
  search?: boolean;
};

const Header = ({ children, title, back, search }: HeaderProps) => {
  return (
    <header className="bg sticky left-0 top-0 z-50 flex min-h-[94px] w-full flex-col border-b bg-white bg-opacity-80 pt-6 backdrop-blur-md dark:border-neutral-500 dark:bg-black dark:bg-opacity-50">
      <div className="flex items-center px-4">
        {back && (
          <Link href={".."}>
            <HoverEffect>
              <HiArrowSmallLeft className="mr-2 h-10 w-10 p-2 text-black dark:text-white" />
            </HoverEffect>
          </Link>
        )}

        {!search ? (
          <h1
            className={`text-2xl font-bold text-black dark:text-white ${
              back ? "relative bottom-[2px]" : ""
            }`}
          >
            {title}
          </h1>
        ) : (
          <SearchBar placeholder={title} />
        )}
      </div>

      {children}
    </header>
  );
};

export default Header;
