import { caseStudyRouter } from "~/server/api/routers/case-study";
import { cvEntryRouter } from "~/server/api/routers/cv-entry";
import { endorsementRouter } from "~/server/api/routers/endorsement";
import { postRouter } from "~/server/api/routers/post";
import { skillRouter } from "~/server/api/routers/skill";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
	caseStudy: caseStudyRouter,
	endorsement: endorsementRouter,
	cvEntry: cvEntryRouter,
	skill: skillRouter,
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
