import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { records, users } from "drizzle/schema";
import { eq, asc } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  createUser: privateProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.insert(users).values({ userId: ctx.userId });
  }),

  getUsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(users).all(); 
  }),

  saveData: privateProcedure
    .input(
      z.object({
        time: z.number(),
        code: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userExist = await ctx.db.query.users.findFirst({
        where: eq(users.userId, ctx.userId),
      });
      if (!userExist) {
        await ctx.db.insert(users).values({ userId: ctx.userId });
      }
      return await ctx.db.insert(records).values({ userId: ctx.userId, time: input.time, codeId: input.code })    
  }),

  getUserRecords: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      columns: {
        createdAt: false,
        updatedAt: false,
        userId: false,
      },
      where: eq(users.userId, ctx.userId),
      with: {
        records: {
          orderBy: asc(records.time),
          limit: 5,
          columns: {
            id: true,
            time: true,
            userId: false,
          },
          with: {
            code: true
          }
        },
      }
    })
  })
});

