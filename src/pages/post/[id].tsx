import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { TweetCard } from "~/components/InfiniteTweetList";
import Link from "next/link";
import IconHoverEffect from "~/components/shared/IconHoverEffect";
import { HiArrowSmallLeft } from "react-icons/hi2";
import ProfileImage from "~/components/shared/ProfileImage";

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: tweet } = api.tweet.getById.useQuery({ id });

  if (!tweet) return <h1>Loading...</h1>;

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center border-b px-4 py-2 dark:text-white">
        <Link href=".." className="mr-2">
          <IconHoverEffect gray>
            <HiArrowSmallLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={tweet.user.image} className="flex-shrink-0" />

        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{tweet.user.name}</h1>
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
    </div>
  );
};

export default PostPage;
