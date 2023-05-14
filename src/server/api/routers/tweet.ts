import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Like } from ".prisma/client";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        multimedia: z.string().nullable(),
        multimediaType: z.string().nullable(),
      })
    )
    .mutation(({ input: { multimedia, content, multimediaType }, ctx }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new Error("User not logged in");
      }

      const tweetObject: {
        userId: string;
        content: string;
        multimedia?: string | null;
        multimediaType?: string | null;
      } = {
        userId,
        content,
      };

      if (multimedia) {
        tweetObject.multimedia = multimedia;
        tweetObject.multimediaType = multimediaType;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return ctx.prisma.tweet.create({
        data: tweetObject,
      });
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const tweets: {
        user: { id: string; name: string | null; image: string | null };
        likes: Like[];
        _count: { likes: number };
        id: string;
        content: string;
        createdAt: Date;
        multimedia: string | null;
        multimediaType: string | null;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      }[] = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          multimediaType: true,
          multimedia: true,
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (tweets.length > limit) {
        const nextItem = tweets.pop();
        if (nextItem !== undefined) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        tweets: tweets.map((tweet) => {
          return {
            ...tweet,
            likes: tweet._count.likes,
            likedByMe: tweet.likes.length > 0,
          };
        }),
        nextCursor,
      };
    }),
  toggleLike: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ input: { tweetId }, ctx }) => {
      const data = { tweetId, userId: ctx.session.user.id };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });

      if (existingLike == null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
        return { addedLike: false };
      }
    }),
});
