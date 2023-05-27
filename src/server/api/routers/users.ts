import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      if (!id.length) {
        throw new Error("Invalid ID");
      }

      const currentUserId = ctx.session?.user.id;

      const profile = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          image: true,
          name: true,
          createdAt: true,
          backgroundImage: true,
          tagName: true,
          email: currentUserId ? true : undefined,
          verified: true,
          _count: {
            select: {
              followers: true,
              follows: true,
              tweets: true,
            },
          },
          followers: !currentUserId
            ? undefined
            : {
                where: {
                  id: currentUserId,
                },
              },
        },
      });

      return {
        ...profile,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        isFollowing: !!profile?.followers?.length,
        followersCount: profile?._count?.followers,
        followsCount: profile?._count?.follows,
      };
    }),
  searchUser: publicProcedure
    .input(z.string())
    .query(async ({ input: searchQuery, ctx }) => {
      return await ctx.prisma.user.findMany({
        where: {
          name: {
            contains: searchQuery,
          },
        },
        take: 10,
      });
    }),
});
