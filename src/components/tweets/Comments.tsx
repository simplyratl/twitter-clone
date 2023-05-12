import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiOutlineXMark } from "react-icons/hi2";
import ProfileImage from "~/components/shared/ProfileImage";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Tweet } from "@prisma/client";
import { dateTimeFormatter, HeartButton } from "~/components/InfiniteTweetList";
import { updateTextAreaSize } from "~/components/tweets/NewTweetForms";

export function Comments({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
  image,
}: Tweet) {
  const trpcUtils = api.useContext();
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { data: comments } = api.tweet.getComments.useQuery({ postId: id });

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    // @ts-ignore
    textAreaRef.current = textArea;
  }, []);

  const createComment = api.tweet.addComment.useMutation({
    onSuccess: ({ addedComment }) => {},
  });

  // const toggleLike = api.tweet.toggleLike.useMutation({
  //   onSuccess: ({ addedLike }) => {
  //     const updateData: Parameters<
  //       typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
  //     >[1] = (oldData) => {
  //       if (!oldData) return;
  //
  //       const countModifier = addedLike ? 1 : -1;
  //
  //       return {
  //         ...oldData,
  //         pages: oldData.pages.map((page) => {
  //           return {
  //             ...page,
  //             tweets: page.tweets.map((tweet) => {
  //               if (tweet.id === id) {
  //                 return {
  //                   ...tweet,
  //                   likeCount: likeCount + countModifier,
  //                   likedByMe: addedLike,
  //                 };
  //               }
  //
  //               return tweet;
  //             }),
  //           };
  //         }),
  //       };
  //     };
  //
  //     trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
  //     trpcUtils.tweet.infiniteFeed.setInfiniteData(
  //       { onlyFollowing: true },
  //       updateData
  //     );
  //     trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
  //       { userId: user.id },
  //       updateData
  //     );
  //   },
  // });

  // function handleToggleLike() {
  //   toggleLike.mutate({ id });
  // }

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  return (
    <div>
      <p className="mb-2 ml-4 pb-2 pt-4 text-lg text-white">Comments</p>

      <div className="flex gap-4 text-lg">
        <ProfileImage src={session.data.user.image} />
        <div className="flex w-full flex-col gap-2">
          <textarea
            style={{ height: 0 }}
            value={inputValue}
            ref={textAreaRef}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-full resize-none overflow-hidden border-b p-4 dark:border-gray-500 dark:bg-black dark:text-white`}
            placeholder="What's happening?"
            maxLength={280}
          />
        </div>
      </div>

      {!comments && (
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
                  <Link
                    href={`/post/${id}`}
                    className="flex flex-grow flex-col"
                  >
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
                    {image && (
                      <img
                        src={image}
                        alt={id}
                        className="mb-4 mt-4 h-[400px] w-full rounded-2xl object-cover"
                      />
                    )}
                  </Link>

                  <HeartButton
                    onClick={() => {}}
                    isLoading={false}
                    likedByMe={likedByMe}
                    likeCount={likeCount}
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
