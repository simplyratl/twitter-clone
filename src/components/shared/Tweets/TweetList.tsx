import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Tweet from "~/components/shared/Tweets/Tweet";
import { memo } from "react";

export type TweetProps = {
  multimedia?: string;
  multimediaType?: string;
  id: string;
  content: string;
  createdAt: Date;
  likes: number;
  likedByMe: boolean;
  user: {
    id: string;
    name: string;
    image: string | null;
    verified?: boolean;
    tagName: string | null;
  };
  verified?: boolean;
};

type TweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  tweets: TweetProps[];
  fetchNextPage: () => Promise<unknown>;
};

const TweetList = ({
  isError,
  isLoading,
  tweets,
  hasMore,
  fetchNextPage,
}: TweetListProps) => {
  if (isLoading)
    return <h1 className="mt-4 text-center text-xl font-bold">Loading...</h1>;
  if (isError)
    return <h1 className="mt-4 text-center text-xl font-bold">Error...</h1>;
  if (!tweets)
    return (
      <h1 className="mt-4 text-center text-xl font-bold">No tweets found.</h1>
    );

  if (tweets.length === 0)
    return (
      <h1 className="mt-4 text-center text-xl font-bold">
        Currently, there are no tweets.
      </h1>
    );

  return (
    <div>
      <InfiniteScroll
        next={fetchNextPage}
        hasMore={hasMore}
        loader={"Loading..."}
        dataLength={tweets.length}
      >
        {tweets.map((tweet: TweetProps) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default memo(TweetList);
