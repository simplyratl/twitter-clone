import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const hashtagRouter = createTRPCRouter({
  searchHashtag: protectedProcedure
    .input(z.string())
    .query(async ({ input: hashtag, ctx }) => {
      return await ctx.prisma.tweet.findMany({
        where: {
          content: {
            contains: hashtag,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});
