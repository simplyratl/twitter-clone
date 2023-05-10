import type {
	GetStaticPaths,
	GetStaticPropsContext,
	InferGetStaticPropsType,
	NextPage,
} from "next";
import Head from "next/head";
import {ssgHelper} from "~/server/api/ssgHelper";
import {api} from "~/utils/api";
import ErrorPage from "next/error";
import Link from "next/link";
import IconHoverEffect from "~/components/shared/IconHoverEffect";
import {HiArrowSmallLeft} from "react-icons/hi2";
import ProfileImage from "~/components/shared/ProfileImage";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import {useSession} from "next-auth/react";
import Button from "~/components/shared/Button";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	                                                                               id,
                                                                               }) => {
	const {data: profile} = api.profile.getById.useQuery({id});
	const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
		{userId: id},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);
	const trpcUtils = api.useContext();

	const toggleFollow = api.profile.toggleFollow.useMutation({
		onSuccess: ({addedFollow}) => {
			trpcUtils.profile.getById.setData({id}, oldData => {
				if (!oldData) return;

				const countModifier = addedFollow ? 1 : -1;

				return {
					...oldData,
					isFollowing: addedFollow,
					followersCount: oldData.followersCount + countModifier
				}
			})
		}
	})

	if (!profile || !profile.name) return <ErrorPage statusCode={404}/>;

	return (
		<>
			<Head>
				<title>{`Twitter Clone - ${profile.name}`}</title>
			</Head>
			<header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
				<Link href=".." className="mr-2">
					<IconHoverEffect>
						<HiArrowSmallLeft className="h-6 w-6"/>
					</IconHoverEffect>
				</Link>
				<ProfileImage src={profile.image} className="flex-shrink-0"/>

				<div className="ml-2 flex-grow">
					<h1 className="text-lg font-bold">{profile.name}</h1>
					<div className="flex gap-2">
						<div className="text-gray-500">
							{profile.tweetsCount}{" "}
							{getPlural(profile.tweetsCount, "Tweet", "Tweets")}
						</div>
						<div className="text-gray-500">
							{profile.followersCount}{" "}
							{getPlural(profile.followersCount, "Tweet", "Tweets")}
						</div>
						<div className="text-gray-500">
							{profile.followersCount} Following
						</div>
					</div>
					<FollowButton
						isFollowing={profile.isFollowing}
						userId={id}
						isLoading={toggleFollow.isLoading}
						onClick={() => toggleFollow.mutate({userId: id})}
					/>
				</div>
			</header>
			<main>
				<InfiniteTweetList
					tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
					isError={tweets.isError}
					isLoading={tweets.isLoading}
					hasMore={tweets.hasNextPage}
					fetchNewTweets={tweets.hasNextPage}
				/>
			</main>
		</>
	);
};

function FollowButton({
	                      userId,
	                      isFollowing,
	                      onClick,
	                      isLoading
                      }: {
	userId: string;
	isFollowing: boolean;
	onClick: () => void;
	isLoading: boolean;
}) {
	const session = useSession();
	if (session.status !== "authenticated" || session.data.user.id === userId)
		return null;

	return (
		<Button disabled={isLoading} onClick={onClick} small grey={isFollowing}>
			{isFollowing ? "Unfollow" : "Follow"}
		</Button>
	);
}

const pluralRules = new Intl.PluralRules();

function getPlural(number: number, singular: string, plural: string): string {
	return pluralRules.select(number) === "one" ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
	return {
		paths: [],
		fallback: "blocking",
	};
};

export async function getStaticProps(
	context: GetStaticPropsContext<{ id: string }>
) {
	const id = context.params?.id;

	if (!id)
		return {
			redirect: {
				destination: "/",
			},
		};

	const ssg = ssgHelper();
	await ssg.profile.getById.prefetch({id});

	return {
		props: {
			trcpState: ssg.dehydrate(),
			id,
		},
	};
}

export default ProfilePage;
