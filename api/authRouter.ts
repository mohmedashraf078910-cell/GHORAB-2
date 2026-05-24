import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { Session } from "@contracts/constants";

export const authRouter = createRouter({
  me: authedQuery.query(async ({ ctx }) => {
    return ctx.user;
  }),

  logout: authedQuery.mutation(async () => {
    return { success: true };
  }),
});
