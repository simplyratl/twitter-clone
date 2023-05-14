import { type NextPage } from "next";
import Head from "next/head";
import AddTweet from "~/components/shared/AddTweet";
import { useSession } from "next-auth/react";
import TweetList from "~/components/shared/Tweets/TweetList";
import { api } from "~/utils/api";

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <TweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage ?? false}
      fetchNextPage={tweets.fetchNextPage}
    ></TweetList>
  );
}

const Home: NextPage = () => {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="relative h-full">
        <header className="sticky left-0 top-0 z-50 flex h-16 w-full items-center bg-white bg-opacity-60 px-4 backdrop-blur-sm dark:bg-black">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Explore
          </h1>
        </header>

        {session.data?.user && <AddTweet />}

        <div>
          <RecentTweets />
        </div>
      </section>
    </>
  );
};

export default Home;
