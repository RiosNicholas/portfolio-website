-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL DEFAULT 'profile',
    "intro" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "projectsLede" TEXT NOT NULL,
    "writingLede" TEXT NOT NULL,
    "contactLede" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Profile_nonempty" CHECK (
        btrim("intro") <> '' AND btrim("summary") <> '' AND btrim("status") <> ''
        AND btrim("city") <> '' AND btrim("region") <> '' AND btrim("employer") <> ''
        AND btrim("team") <> '' AND btrim("projectsLede") <> '' AND btrim("writingLede") <> ''
        AND btrim("contactLede") <> ''
    )
);

-- Seed today's copy so production has the row after `prisma migrate deploy`.
INSERT INTO "Profile" ("id", "intro", "summary", "status", "city", "region", "employer", "team", "projectsLede", "writingLede", "contactLede", "updatedAt")
VALUES (
    'profile',
    'I''m Nicholas - a Software Engineer based in the NYC area, focused on web development and agentic AI.',
    'I enjoy working at the intersection of design, product, and engineering. I like taking ideas from concept to implementation, building intuitive user experiences, and thinking through the architecture needed to make products scalable and maintainable.

I''m currently in Risk Technology at JPMorganChase, where I work on frontend architecture, shared libraries, and developer tooling used across my organization, alongside agentic AI tools that are shaping how our engineering teams build and ship software.

Outside of engineering, I enjoy street photography and occasionally publish my work.',
    'Open to **full-time** + **freelance** opportunities',
    'Jersey City',
    'New Jersey',
    'JPMorgan Chase',
    'Credit Risk Technology (Core UI Platform)',
    'Apps, sites and experiments I''ve designed and built outside my day job.',
    'Articles I''ve written, and places my work has been featured.',
    'I''m open to full-time and contract work. Connect on LinkedIn or send me an email, whichever you prefer.',
    CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
