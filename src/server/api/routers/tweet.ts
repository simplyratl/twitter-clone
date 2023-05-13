import type { Prisma } from "@prisma/client";
import type { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  createTRPCContext,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor, userId }, ctx }) => {
      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause: { userId },
      });
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({ input: { limit = 10, cursor, onlyFollowing = false }, ctx }) => {
        const currentUserID = ctx.session?.user.id;

        return await getInfiniteTweets({
          limit,
          ctx,
          cursor,
          whereClause:
            !currentUserID || !onlyFollowing
              ? undefined
              : {
                  user: {
                    followers: { some: { id: currentUserID } },
                  },
                },
        });
      }
    ),
  create: protectedProcedure
    .input(z.object({ content: z.string(), multimedia: z.string().nullable() }))
    .mutation(async ({ input: { content, multimedia }, ctx }) => {
      console.log(multimedia);
      return await ctx.prisma.tweet.create({
        data: { content, userId: ctx.session.user.id, multimedia },
      });
    }),
  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { tweetId: id, userId: ctx.session.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: { userId_tweetId: data },
      });

      if (!existingLike) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({ where: { userId_tweetId: data } });
        return { addedLike: false };
      }
    }),
  delete: protectedProcedure
    .input(z.object({ userId: z.string(), postId: z.string() }))
    .mutation(async ({ input: { userId, postId }, ctx }) => {
      const currentUserID = ctx.session?.user.id;
      if (currentUserID === userId) {
        await ctx.prisma.comment.deleteMany({
          where: {
            tweetId: postId,
          },
        });

        await ctx.prisma.tweet.delete({ where: { id: postId } });
        return { deleted: true };
      } else {
        return { deleted: false };
      }
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const tweet = await ctx.prisma.tweet.findUnique({
        where: { id },
        select: {
          id: true,
          user: { select: { name: true, id: true, image: true } },
          multimedia: true,
          content: true,
          createdAt: true,
          _count: {
            select: { likes: true, comments: true },
          },
          likes: !ctx.session?.user.id,
        },
      });

      if (!tweet) return;

      return {
        id: tweet.id,
        user: tweet.user,
        image: tweet.multimedia,
        content: tweet.content,
        createdAt: tweet.createdAt,
        likeCount: tweet._count.likes,
        likes: tweet.likes,
        likedByMe: tweet.likes?.length > 0,
        commentCount: tweet._count.comments,
      };
    }),
  addComment: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        postId: z.string().nullable(),
        content: z.string(),
      })
    )
    .mutation(async ({ input: { userId, postId, content }, ctx }) => {
      if (!content) return;
      if (content.length < 1) throw new Error("Comment too short");
      if (content.length > 280) throw new Error("Comment too long");
      if (userId.length === 0) throw new Error("User not provided");
      if (!postId) throw new Error("Post not provided");

      const comment = await ctx.prisma.comment.create({
        data: {
          content,
          userId,
          tweetId: postId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { name: true, id: true, image: true } },
        },
      });

      return comment;
    }),
  getComments: publicProcedure
    .input(z.object({ postId: z.string().nullable() }))
    .query(async ({ input: { postId }, ctx }) => {
      if (!postId) throw new Error("Post not provided");

      const comments = await ctx.prisma.comment.findMany({
        where: { tweetId: postId },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { name: true, id: true, image: true } },
        },
      });

      return comments;
    }),
});

async function getInfiniteTweets({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.TweetWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserID = ctx.session?.user.id;
  const tweets = await ctx.prisma.tweet.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: {
        select: { likes: true, comments: true },
      },
      likes: !currentUserID ? false : { where: { userId: currentUserID } },
      user: {
        select: { name: true, id: true, image: true },
      },
      multimedia: true,
    },
  });

  let nextCursor: typeof cursor | undefined;

  if (tweets.length > limit) {
    const nextItem = tweets.pop();

    if (nextItem) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {
    tweets: tweets.map((tweet) => {
      return {
        id: tweet.id,
        content: tweet.content,
        createdAt: tweet.createdAt,
        likeCount: tweet._count.likes,
        user: tweet.user,
        likedByMe: tweet.likes?.length > 0,
        image: tweet.multimedia,
        commentCount: tweet._count.comments,
      };
    }),
    nextCursor,
  };
}
