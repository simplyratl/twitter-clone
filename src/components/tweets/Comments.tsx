import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { dateTimeFormatter } from "~/components/InfiniteTweetList";
import ProfileImage from "~/components/shared/ProfileImage";
import { api } from "~/utils/api";
import Button from "../shared/Button";
import TweetInput from "../shared/TweetInput";
import { updateTextAreaSize } from "./NewTweetForms";

export type CommentsType = {
  id: string;
  user: { id: string; image: string | null; name: string | null };
  content: string;
  createdAt: Date;
};

export function Comments({ id, user, content, createdAt }: CommentsType) {
  const session = useSession();

  return (
    <div>
      <div className="border-t dark:border-gray-500">
        <ul>
          <li>
            <div className="flex gap-2 border-b p-4 dark:border-gray-500">
              {user.id === session.data?.user.id && (
                <Link
                  href={`?id=${id}`}
                  as={`/confirmation/${id}`}
                  className="absolute right-2 top-2 cursor-pointer rounded-lg text-2xl hover:bg-neutral-200 hover:text-red-400 dark:text-white dark:hover:bg-neutral-600"
                >
                  <HiOutlineXMark />
                </Link>
              )}

              <Link className="items-start" href={`/profiles/${user.id}`}>
                <ProfileImage src={user.image} />
              </Link>

              <div className="flex flex-grow flex-col">
                <div className="flex flex-grow flex-col">
                  <div className="flex gap-1">
                    <Link
                      href={`/profiles/${user.id}`}
                      className="font-bold hover:underline focus-visible:underline dark:text-white"
                    >
                      {user.name}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {" "}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {dateTimeFormatter.format(createdAt)}
                      </span>
                    </Link>
                  </div>
                  <p className="whitespace-pre-wrap dark:text-white">
                    {content}
                  </p>
                </div>

                {/* <HeartButton
                    onClick={() => {}}
                    isLoading={false}
                    likedByMe={likedByMe}
                    likeCount={likeCount}
                  /> */}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
