import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        tagName: z.string(),
        image: z.string().optional(),
        backgroundImage: z.string().optional(),
      })
    )
    .mutation(
      ({ input: { name, email, tagName, image, backgroundImage }, ctx }) => {
        if (!name.length || !tagName.length || !email?.length) {
          throw new Error("Invalid input");
        }

        const userId = ctx.session.user.id;
        if (!userId) {
          throw new Error("User not logged in");
        }

        const updatedUser: {
          name: string;
          email?: string;
          tagName: string;
          image?: string;
          backgroundImage?: string;
        } = {
          name,
          tagName,
        };

        if (image) {
          updatedUser.image = image;
        }

        if (email) {
          updatedUser.email = email;
        }

        if (backgroundImage) {
          updatedUser.backgroundImage = backgroundImage;
        }

        return ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: updatedUser,
        });
      }
    ),
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string().nullable() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      if (!userId) throw new Error("Invalid input");

      const currentUserId = ctx.session.user.id;

      const existingFollow = await ctx.prisma.user.findFirst({
        where: { id: userId, followers: { some: { id: currentUserId } } },
      });

      let addedFollow;
      if (existingFollow === null) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: { followers: { connect: { id: currentUserId } } },
        });
        addedFollow = true;
      } else {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: { followers: { disconnect: { id: currentUserId } } },
        });
        addedFollow = false;
      }

      return { addedFollow };
    }),
});
