import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { Errors } from "@contracts/errors";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

export const authedQuery = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw Errors.unauthorized("Authentication required");
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const adminQuery = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw Errors.unauthorized("Authentication required");
  }
  if (ctx.user.role !== "admin") {
    throw Errors.forbidden("Admin access required");
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
