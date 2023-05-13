import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiOutlineChatBubbleOvalLeft, HiOutlineXMark } from "react-icons/hi2";
import { api } from "~/utils/api";
import ProfileImage from "./ProfileImage";
import { dateTimeFormatter } from "../InfiniteTweetList";
import Image from "next/image";
import IconHoverEffect from "./IconHoverEffect";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";

export type TweetType = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
  image?: string;
  showcase?: boolean;
  commentCount: number;
};

type HeartButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  likedByMe: boolean;
  likeCount: number;
  showcase?: boolean;
};

type CommentButtonProps = {
  isLoading: boolean;
  commentCount: number;
  showcase?: boolean;
};

export function HeartButton({
  likedByMe,
  likeCount,
  isLoading,
  onClick,
  showcase,
}: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== "authenticated") {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe ? "text-red-500" : "text-gray-500"
      } hover:text-red-500 focus-visible:text-red-500`}
    >
      <IconHoverEffect red>
        <HeartIcon
          className={`transition-colors duration-200 ${
            showcase ? "text-2xl" : ""
          } ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </IconHoverEffect>
      <span className={`${showcase ? "text-xl" : ""}`}>{likeCount}</span>
    </button>
  );
}

export function CommentButton({
  commentCount,
  isLoading,
  showcase,
}: CommentButtonProps) {
  return (
    <button
      disabled={isLoading}
      className={`group flex items-center gap-1 self-start text-gray-500 transition-colors duration-200`}
    >
      <IconHoverEffect gray>
        <HiOutlineChatBubbleOvalLeft
          className={`transition-colors duration-200 ${
            showcase ? "text-2xl" : ""
          }`}
        />
      </IconHoverEffect>
      <span className={`${showcase ? "text-xl" : ""}`}>{commentCount}</span>
    </button>
  );
}

export function TweetCard({
  id,
  user,
  content,
  createdAt,
  likeCount,
  commentCount,
  likedByMe,
  image,
  showcase,
}: TweetType) {
  const trpcUtils = api.useContext();
  const session = useSession();

  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (!oldData) return;

        const countModifier = addedLike ? 1 : -1;

        if (showcase)
          return {
            ...oldData,
            likeCount: likeCount + countModifier,
            likedByMe: addedLike,
            commentCount: commentCount,
          };

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === id) {
                  return {
                    ...tweet,
                    likeCount: likeCount + countModifier,
                    likedByMe: addedLike,
                    commentCount: commentCount,
                  };
                }

                return tweet;
              }),
            };
          }),
        };
      };

      if (showcase) trpcUtils.tweet.getById.setData({ id }, updateData);

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId: user.id },
        updateData
      );
    },
  });

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  return (
    <li className="relative flex flex-col gap-2 overflow-hidden border-b border-gray-200  hover:bg-neutral-100 dark:border-gray-500 dark:hover:bg-neutral-950">
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
          <Link href={`/post/${id}`} className="flex flex-grow flex-col">
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
            <p className="whitespace-pre-wrap dark:text-white">{content}</p>
            {image && (
              <Image
                src={image}
                alt={id}
                width={!showcase ? 400 : 700}
                height={!showcase ? 400 : 700}
                className="mb-4 mt-4 rounded-xl object-cover"
              />
            )}
          </Link>

          <div className="flex gap-7">
            <HeartButton
              onClick={handleToggleLike}
              isLoading={toggleLike.isLoading}
              likedByMe={likedByMe}
              likeCount={likeCount}
              showcase={showcase}
            />

            <CommentButton
              isLoading={toggleLike.isLoading}
              commentCount={commentCount}
              showcase={showcase}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
