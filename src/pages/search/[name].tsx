import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Header from "~/components/shared/Header";
import TweetList from "~/components/shared/Tweets/TweetList";
import Head from "next/head";

const HashTagPage = () => {
  const router = useRouter();
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    { searchQuery: (router.query.name as string) ?? undefined },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <Head>
        <title>{router.query.name} - Twitter Search</title>
        <meta name="description" content="HashTag Page" />
      </Head>

      <Header title={`${router.query.name as string}`} back search></Header>

      <div>
        <TweetList
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage ?? false}
          fetchNextPage={tweets.fetchNextPage}
        ></TweetList>
      </div>
    </div>
  );
};

export default HashTagPage;
