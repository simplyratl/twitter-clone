import React, { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import ProfileImage from "~/components/shared/ProfileImage";
import { api } from "~/utils/api";
import { useDebounce } from "use-debounce";
import { User } from ".prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const Search = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 700);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: searchResults,
    isLoading,
    isFetching,
  } = api.search.searching.useQuery(
    {
      query: debouncedSearch,
    },
    { enabled: debouncedSearch !== undefined && debouncedSearch.length > 0 }
  );

  return (
    <div className="relative mb-2 px-4">
      <div className="flex w-full w-full items-center gap-2 rounded-3xl bg-gray-200 dark:bg-gray-700">
        <IoSearchOutline className="ml-2 w-8 text-xl dark:text-white" />
        <input
          className="h-full w-full bg-transparent px-1 py-3 text-lg outline-none dark:text-white"
          placeholder="Search twitter"
          type="text"
          value={search}
          ref={inputRef}
          onFocus={() => setShowSearchResults(true)}
          onBlur={() => setShowSearchResults(false)}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {showSearchResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-[58px] z-50 max-h-[430px] min-h-[120px] w-[94%] -translate-x-1/2 overflow-hidden rounded-xl bg-white shadow shadow-sm shadow-black dark:bg-gray-900 dark:shadow-white"
          >
            <div className="flex h-full w-full items-center gap-2">
              <ul className="w-full">
                <li className="px-4 py-3 dark:text-white">
                  Search for "{search}"
                </li>
                {searchResults &&
                searchResults.users.length > 0 &&
                search.length > 0 ? (
                  searchResults.users.map((user) => (
                    <li key={user.id}>
                      <Link
                        href={`/profiles/${user.id}`}
                        className="flex w-full gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <ProfileImage src={user.image} className="h-16 w-16" />

                        <div className="flex flex-col">
                          <span className="text-lg font-bold dark:text-white">
                            {user.name}
                          </span>
                          <span className="dark:text-white">
                            {user._count.followers} followers
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <span className="p-4 text-lg dark:text-white">
                    {isFetching ? "Loading..." : "No results found"}
                  </span>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
