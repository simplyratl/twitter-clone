import React from "react";
import ProfileImage from "~/components/shared/ProfileImage";
import Link from "next/link";
import { VscVerifiedFilled } from "react-icons/vsc";
import { User } from ".prisma/client";

type ListUsersProps = {
  data: User[] | null;
  loading: boolean;
};

const ListUsers = ({ data, loading }: ListUsersProps) => {
  return (
    <ul className="grid max-h-[300px] overflow-auto rounded-md bg-white shadow dark:bg-black dark:shadow-white">
      {data && data.length === 0 && !loading && (
        <p className="p-4 text-lg text-black dark:text-white">
          No results found
        </p>
      )}

      {loading && (
        <p className="p-4 text-lg text-black dark:text-white">Loading...</p>
      )}

      {data &&
        !loading &&
        data.map((element, index: number) => (
          <li
            key={index}
            className="transition-colors dark:hover:bg-neutral-800"
          >
            <Link href={`/`} className="flex w-full gap-3 p-4">
              <ProfileImage src={element.image ?? ""} size={14} />

              <div>
                <p className="flex items-center gap-1 text-black dark:text-white">
                  {element.name}
                  {element.verified && (
                    <span className="text-blue-500">
                      <VscVerifiedFilled className="h-5 w-5" />
                    </span>
                  )}
                </p>
                <p className="text-gray-500 dark:text-gray-400">@username</p>
              </div>
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default ListUsers;
