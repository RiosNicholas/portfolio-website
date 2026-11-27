import { articleRouter } from "~/server/api/routers/article";
import { caseStudyRouter } from "~/server/api/routers/case-study";
import { cvEntryRouter } from "~/server/api/routers/cv-entry";
import { endorsementRouter } from "~/server/api/routers/endorsement";
import { languageRouter } from "~/server/api/routers/language";
import { mentionRouter } from "~/server/api/routers/mention";
import { profileRouter } from "~/server/api/routers/profile";
import { skillRouter } from "~/server/api/routers/skill";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	caseStudy: caseStudyRouter,
	endorsement: endorsementRouter,
	cvEntry: cvEntryRouter,
	skill: skillRouter,
	language: languageRouter,
	article: articleRouter,
	mention: mentionRouter,
	profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.caseStudy.all();
 */
export const createCaller = createCallerFactory(appRouter);
