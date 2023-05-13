import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { TweetCard, TweetType } from "./shared/TweetCard";

type InfiteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewTweets?: () => Promise<unknown>;
  tweets?: TweetType[];
};

export const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

const InfiniteTweetList = ({
  tweets,
  isError,
  fetchNewTweets,
  hasMore,
  isLoading,
}: InfiteTweetListProps) => {
  const router = useRouter();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error</h1>;
  if (!tweets) return null;

  if (tweets.length === 0 || !tweets)
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">
        There are no new tweets.
      </h2>
    );

  return (
    <>
      <ul>
        <InfiniteScroll
          dataLength={tweets.length}
          next={fetchNewTweets}
          hasMore={hasMore}
          loader={"Loading..."}
        >
          <AnimatePresence>
            {tweets.map((tweet) => (
              <motion.div
                key={tweet.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TweetCard {...tweet} />
              </motion.div>
            ))}
          </AnimatePresence>
        </InfiniteScroll>
      </ul>
    </>
  );
};

export default InfiniteTweetList;
