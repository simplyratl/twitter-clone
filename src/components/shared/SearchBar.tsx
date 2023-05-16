import React, { FormEvent, useEffect, useRef, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { HiOutlineXMark } from "react-icons/hi2";
import { api } from "~/utils/api";
import useOutsideClick from "~/utils/hooks/useOnClickOutside";
import ListUsers from "~/components/shared/ListUsers";
import { useDebounce } from "use-debounce";

type SearchBarProps = {
  placeholder?: string;
};

const SearchBar = ({ placeholder }: SearchBarProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState<string>("");

  const [debouncedSearch] = useDebounce(search, 1000);

  const { data: users, isFetching } = api.users.searchUser.useQuery(
    debouncedSearch,
    {
      enabled: debouncedSearch.length > 2,
    }
  );

  useEffect(() => {
    if (placeholder) setSearch(placeholder);
  }, [placeholder]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (search.length > 0) {
    }
  };

  useOutsideClick(formRef, () => {
    setFocused(false);
  });

  const handleClearClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <form
        className={`relative flex h-12 w-full items-center overflow-hidden rounded-full border  ${
          focused
            ? "border border-blue-500 bg-transparent"
            : "border border-transparent bg-neutral-300 dark:bg-neutral-800"
        }`}
        ref={formRef}
        onSubmit={handleSubmit}
        onFocus={() => setFocused(true)}
      >
        <span className="ml-1 flex h-full w-14 items-center justify-center">
          <HiSearch
            className={`text-2xl text-black dark:text-white ${
              focused ? "text-blue-500" : ""
            }`}
          />
        </span>
        <input
          type="text"
          className="h-full w-full border-none bg-transparent text-lg text-black outline-none dark:text-white"
          value={search}
          placeholder="Search Twitter"
          ref={inputRef}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search.length > 0 && focused && (
          <span
            className="absolute right-1 top-0 flex h-full w-12 items-center justify-center"
            onClick={handleClearClick}
          >
            <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600">
              <HiOutlineXMark className="text-xl text-white dark:text-black" />
            </div>
          </span>
        )}
      </form>

      {focused && search.length > 0 && (
        <div className="absolute left-0 top-[calc(100%+8px)] w-full">
          <ListUsers data={users || null} loading={isFetching} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
