import React from "react";
import { useRouter } from "next/router";
import Header from "~/components/shared/Header";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import ProfileImage from "~/components/shared/ProfileImage";
import Button from "~/components/shared/Button";
import moment from "moment";
import { HiCalendarDays } from "react-icons/hi2";
import TweetList from "~/components/shared/Tweets/TweetList";
import { VscVerifiedFilled } from "react-icons/vsc";

const ProfilePage = () => {
  const router = useRouter();

  const { data: user } = api.users.getUserById.useQuery({
    id: (router.query.id as string) ?? "",
  });

  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    {
      userId: (router.query.id as string) ?? "",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  console.log(user);

  return (
    <div>
      <Head>
        <title>{router.query.id}</title>
        <meta name="description" content="Profile Page" />
      </Head>

      <Header title={"Profile"} back></Header>

      <div className="border-b pb-6 dark:border-neutral-600">
        <div className="relative">
          <div className="relative h-[200px]">
            <Image
              fill
              src={
                "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500"
              }
              alt={"picture"}
              className="object-cover"
            />
          </div>

          <div className="absolute left-4 top-[calc(100%-100px)] rounded-full border-[5px] border-white dark:border-black">
            <ProfileImage src={user?.image ?? ""} size={35} />
          </div>

          <div className="relative right-4 top-4 flex justify-end">
            <Button default>Follow</Button>
          </div>
        </div>

        <div className="mt-16 px-4">
          <div>
            <h3 className="flex items-center gap-1 text-xl font-bold text-black dark:text-gray-200">
              {user?.name}
              {user?.verified && (
                <span className="text-blue-500">
                  <VscVerifiedFilled className="h-5 w-5" />
                </span>
              )}
            </h3>
            <p className="text-neutral-500 dark:text-neutral-500">
              @{user?.name}
            </p>

            <p className="mt-3 flex items-center gap-1 text-neutral-500 dark:text-neutral-500">
              <HiCalendarDays size={20} /> Joined{" "}
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
              {user ? moment(user.createdAt).format("MMMM YYYY") : "unknown"}
            </p>

            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-base text-black dark:text-gray-200">
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  <span className="font-bold">{user?._count?.follows}</span>{" "}
                  <span className="text-gray-500">Following</span>
                </p>
              </div>
              <div>
                <p className="text-base text-black dark:text-gray-200">
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  <span className="font-bold">{user?._count?.followers}</span>{" "}
                  <span className="text-gray-500">Followers</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2">
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

export default ProfilePage;
