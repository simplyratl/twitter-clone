import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import FollowingTweets from "~/components/tweets/FollowingTweets";
import NewTweetForms from "~/components/tweets/NewTweetForms";
import { api } from "~/utils/api";
import Search from "~/components/shared/Search";

const TABS = ["Recent", "Following"];

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();

  return (
    <>
      <header className="sticky top-0 z-10 border-b pt-2">
        <h1 className="mb-2 px-4 text-xl font-bold dark:text-white">Explore</h1>

        <div>
          <Search />
        </div>

        {session.status === "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`relative flex-grow rounded-sm p-2 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 ${
                  tab === selectedTab
                    ? "before:absolute before:bottom-0 before:left-1/2 before:h-[3px] before:w-[40%] before:-translate-x-1/2 before:rounded-xl before:rounded-tl before:bg-blue-500 before:transition-transform before:duration-300 before:ease-in-out"
                    : ""
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
        <NewTweetForms />
        {selectedTab === "Recent" ? <RecentTweets /> : <FollowingTweets />}
      </header>
    </>
  );
};

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.hasNextPage}
    />
  );
}

export default Home;
