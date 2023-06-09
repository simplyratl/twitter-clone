import { createTRPCRouter } from "~/server/api/trpc";
import { tweetRouter } from "~/server/api/routers/tweet";
import { hashtagRouter } from "~/server/api/routers/hashtag";
import { usersRouter } from "~/server/api/routers/users";
import { profileRouter } from "~/server/api/routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tweet: tweetRouter,
  hashtag: hashtagRouter,
  users: usersRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
