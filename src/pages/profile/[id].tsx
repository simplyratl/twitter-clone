import React, { useState } from "react";
import { useRouter } from "next/router";
import Header from "~/components/shared/Header";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import ProfileImage from "~/components/shared/ProfileImage";
import Button from "~/components/shared/Button";
import moment from "moment";
import { HiCalendarDays, HiOutlineEllipsisVertical } from "react-icons/hi2";
import TweetList from "~/components/shared/Tweets/TweetList";
import { VscVerifiedFilled } from "react-icons/vsc";
import HoverEffect from "~/utils/style/HoverEffect";
import EditProfileModal from "~/components/shared/Modals/EditProfileModal";
import Modal from "react-modal";
import CustomModal from "~/components/shared/Modals/CustomModal";
import { User } from ".prisma/client";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const trpcUtils = api.useContext();

  const router = useRouter();
  const [modal, setModal] = useState(false);
  const session = useSession();

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

  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: (addedFollow) => {
      console.log(addedFollow);

      trpcUtils.users.getUserById.setData(
        { id: (router.query.id as string) ?? "" },
        (oldData) => {
          if (oldData === null || oldData === undefined) return;

          console.log(oldData);
          console.log(addedFollow);

          const countModifier = addedFollow ? 1 : -1;

          return {
            ...oldData,
            isFollowing: addedFollow,
            followersCount: oldData.followersCount + countModifier,
          };
        }
      );
    },
  });

  if (!user) return <h1>Loading..</h1>;

  return (
    <>
      <div>
        <Head>
          <title>{user?.name} - Twitter Profile</title>
          <meta name="description" content="Profile Page" />
        </Head>

        <Header title={"Profile"} back></Header>

        <div className="border-b pb-6 dark:border-neutral-600">
          <div className="relative">
            <div className="relative h-[200px]">
              {user?.backgroundImage ? (
                <Image
                  fill
                  src={user?.backgroundImage}
                  alt={"picture"}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-blue-400"></div>
              )}
            </div>

            <div className="absolute left-4 top-[calc(100%-100px)] rounded-full border-[5px] border-white dark:border-black">
              <ProfileImage src={user?.image ?? ""} size={35} />
            </div>

            <div className="relative right-4 top-4 flex items-center justify-end gap-4">
              {session.data?.user.id === user.id && (
                <div>
                  <div className="dropdown-end dropdown">
                    <span tabIndex={0}>
                      <HoverEffect>
                        <HiOutlineEllipsisVertical className="h-8 w-8 text-black dark:text-white" />
                      </HoverEffect>
                    </span>
                    <ul
                      tabIndex={0}
                      className="dropdown-content rounded-box w-52 bg-neutral-200 p-2 text-black shadow dark:bg-neutral-900 dark:text-white"
                    >
                      <li
                        className="cursor-pointer rounded-xl px-4 py-2 text-base dark:hover:bg-neutral-800"
                        onClick={() => setModal(true)}
                      >
                        Edit profile
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {session.data?.user.id !== user.id && (
                <Button
                  defaultColor
                  onClick={() =>
                    toggleFollow.mutate({
                      userId: session.data?.user.id ?? null,
                    })
                  }
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-16 px-4">
            <div>
              <h3 className="flex items-center gap-1 text-xl font-bold text-black dark:text-gray-200">
                {user?.name}
                {user?.verified && (
                  <div className="tooltip" data-tip="Verified user">
                    <span className="text-blue-500">
                      <VscVerifiedFilled className="h-5 w-5" />
                    </span>
                  </div>
                )}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-500">
                @{user?.tagName ?? user?.name}
              </p>

              <p className="mt-3 flex items-center gap-1 text-neutral-500 dark:text-neutral-500">
                <HiCalendarDays size={20} /> Joined{" "}
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
                {user ? moment(user.createdAt).format("MMMM YYYY") : "unknown"}
              </p>

              <div className="mt-4 flex gap-4">
                <div>
                  <p className="text-base text-black hover:link dark:text-gray-200">
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                    <span className="font-bold">{user.followsCount}</span>{" "}
                    <span className="text-gray-500">Following</span>
                  </p>
                </div>
                <div>
                  <p className="text-base text-black hover:link dark:text-gray-200">
                    {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                    <span className="font-bold">{user.followersCount}</span>{" "}
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

      <CustomModal width={700} modal={modal} setModal={setModal}>
        <EditProfileModal setModal={setModal} user={user ?? null} />
      </CustomModal>
    </>
  );
};

export default ProfilePage;
