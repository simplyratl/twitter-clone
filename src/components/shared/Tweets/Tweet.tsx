import React from "react";
import ProfileImage from "~/components/shared/ProfileImage";
import {
  HiHeart,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHeart,
} from "react-icons/hi2";
import HoverEffect from "~/utils/style/HoverEffect";
import Link from "next/link";
import { type TweetProps } from "~/components/shared/Tweets/TweetList";
import moment from "moment";
import { api } from "~/utils/api";
import Image from "next/image";

const CommentIcon = () => {
  return (
    <div className="group flex cursor-pointer items-center gap-1 text-black hover:text-blue-500 dark:text-white">
      <HoverEffect blue>
        <div className="h-9 w-9">
          <span className="flex h-full items-center justify-center text-xl">
            <HiOutlineChatBubbleOvalLeft />
          </span>
        </div>
      </HoverEffect>
      <span className="text-md">0</span>
    </div>
  );
};

const HeartIcon = ({
  likes,
  likedByMe,
  handleLike,
}: {
  likes: number;
  likedByMe: boolean;
  handleLike: () => void;
}) => {
  return (
    <div
      className={`group flex cursor-pointer items-center gap-1 hover:text-red-500 ${
        likedByMe ? "text-red-500" : "text-black dark:text-white"
      }`}
      onClick={handleLike}
    >
      <HoverEffect red>
        <div className="h-9 w-9">
          <span className="flex h-full items-center justify-center text-xl">
            {likedByMe ? <HiHeart /> : <HiOutlineHeart />}
          </span>
        </div>
      </HoverEffect>
      <span className="text-md">{likes}</span>
    </div>
  );
};

type TweetPropsCard = {
  tweet: TweetProps;
};

const Tweet = ({ tweet }: TweetPropsCard) => {
  const trpcUtils = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweetEl) => {
                if (tweetEl.id === tweet.id) {
                  return {
                    ...tweetEl,
                    likes: tweetEl.likes + countModifier,
                    likedByMe: addedLike,
                  };
                }

                return tweetEl;
              }),
            };
          }),
        };
      };

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
    },
  });

  const handleLike = () => {
    toggleLike.mutate({ tweetId: tweet.id });
  };

  const formatDate = (date: Date) => {
    const createdMoment = moment(date);
    const elapsedMinutes = moment().diff(createdMoment, "minutes");
    if (elapsedMinutes < 60) {
      return `${elapsedMinutes}m`;
    } else if (elapsedMinutes < 1440) {
      const elapsedHours = Math.floor(elapsedMinutes / 60);
      return `${elapsedHours}h`;
    } else {
      const elapsedDays = Math.floor(elapsedMinutes / 1440);
      return `${elapsedDays}d`;
    }
  };

  return (
    <article className="relative z-[1] border-b border-t px-4 py-6 transition-colors duration-200 first:border-none last:border-none hover:bg-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-900">
      <div className="flex gap-3">
        {tweet.user && (
          <div className="h-fit flex-shrink-0">
            <Link href={`/profile/${tweet.user.id}`}>
              <ProfileImage src={tweet.user.image || ""} />
            </Link>
          </div>
        )}
        <div>
          <div className="flex gap-2">
            <Link href={`/profile/${tweet.user.id}`}>
              <p className="text-lg text-black hover:link dark:text-white">
                {tweet.user.name}
              </p>
            </Link>
            <div
              className="tooltip tooltip-bottom"
              data-tip={moment(tweet.createdAt).format("LLL")}
            >
              <p className="cursor-pointer text-lg text-neutral-700 hover:underline dark:text-neutral-500">
                {formatDate(tweet.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-black dark:text-white">{tweet.content}</p>

            {tweet.multimedia && (
              <div className="relative h-full w-fit overflow-hidden rounded-2xl">
                {tweet.multimediaType === "image" ? (
                  <>
                    <Image
                      src={tweet.multimedia}
                      alt="Image"
                      fill
                      className="!relative max-h-full sm:max-h-[500px]"
                    />
                  </>
                ) : (
                  <video
                    src={tweet.multimedia}
                    controls
                    className="max-h-[500px]"
                  ></video>
                )}
              </div>
            )}

            <div className="relative right-2">
              <div className="flex select-none gap-4">
                <CommentIcon />
                <HeartIcon
                  likes={tweet.likes}
                  likedByMe={tweet.likedByMe}
                  handleLike={handleLike}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Tweet;
