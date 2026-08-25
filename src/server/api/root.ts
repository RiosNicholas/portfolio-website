import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 *
 * Not currently wired to any page — retained as scaffolding for a possible
 * future admin surface (see agentWork/prod-readiness-audit/SCALING.md).
 * `env.js`'s DATABASE_URL/AUTH_* vars are optional precisely so this can
 * stay on disk without forcing every deploy to configure a database.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
