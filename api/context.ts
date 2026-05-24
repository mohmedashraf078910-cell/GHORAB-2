import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { authenticateRequest } from "./kimi/auth";
import type { User } from "@db/schema";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  try {
    const user = await authenticateRequest(opts.req.headers);
    return { req: opts.req, resHeaders: opts.resHeaders, user };
  } catch {
    return { req: opts.req, resHeaders: opts.resHeaders };
  }
}
