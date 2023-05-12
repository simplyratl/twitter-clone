import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { TweetCard } from "~/components/InfiniteTweetList";
import Link from "next/link";
import IconHoverEffect from "~/components/shared/IconHoverEffect";
import { HiArrowSmallLeft, HiOutlineXMark } from "react-icons/hi2";
import ProfileImage from "~/components/shared/ProfileImage";
import { Comments } from "~/components/tweets/Comments";

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: tweet } = api.tweet.getById.useQuery({ id });

  if (!tweet) return <h1>Loading...</h1>;

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2 dark:bg-black dark:text-white">
        <Link href=".." className="mr-2">
          <IconHoverEffect gray>
            <HiArrowSmallLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>

        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">Tweet</h1>
        </div>
      </header>

      <TweetCard
        id={tweet.id}
        content={tweet.content}
        createdAt={tweet.createdAt}
        likeCount={tweet.likeCount}
        likedByMe={tweet.likedByMe}
        user={tweet.user}
        image={tweet.image}
      />

      <Comments
        id={tweet.id}
        content={tweet.content}
        createdAt={tweet.createdAt}
        likeCount={tweet.likeCount}
        likedByMe={tweet.likedByMe}
        user={tweet.user}
        image={tweet.image}
      />
    </div>
  );
};

export default PostPage;
