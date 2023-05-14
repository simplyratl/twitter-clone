import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Tweet from "~/components/shared/Tweets/Tweet";

export type TweetProps = {
  multimedia?: string;
  multimediaType?: string;
  id: string;
  content: string;
  createdAt: Date;
  likes: number;
  likedByMe: boolean;
  user: { id: string; name: string; image: string | null };
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
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error...</h1>;
  if (!tweets) return <h1>No tweets...</h1>;

  if (tweets.length === 0) return <h1>No tweets...</h1>;

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

export default TweetList;
