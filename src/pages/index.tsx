import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import FollowingTweets from "~/components/tweets/FollowingTweets";
import NewTweetForms from "~/components/tweets/NewTweetForms";
import { api } from "~/utils/api";

const TABS = ["Recent", "Following"];

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status === "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                  tab === selectedTab
                    ? "font bold border-b-4 border-b-blue-500"
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
