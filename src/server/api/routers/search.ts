import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const searchRouter = createTRPCRouter({
  searching: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input: { query }, ctx }) => {
      if (!query || query.length === 0) return;

      const users = await ctx.prisma.user.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          _count: { select: { followers: true } },
        },
        take: 10,
      });

      return { users };
    }),
});
