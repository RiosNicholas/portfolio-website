-- Article tags were always topic tags (GLOSSARY.md). Same column, new name.
ALTER TABLE "Article" RENAME COLUMN "tags" TO "topicTags";

-- Mention: add the new columns as nullable, backfill them, then drop the old ones.
ALTER TABLE "Mention" ALTER COLUMN "title" DROP NOT NULL,
ADD COLUMN "sourceName" TEXT,
ADD COLUMN "imageUrl" TEXT,
ADD COLUMN "year" INTEGER,
ADD COLUMN "month" INTEGER,
ADD COLUMN "day" INTEGER,
ADD COLUMN "topicTags" TEXT[];

-- The old admin date input saved midnight UTC, so Jan 1 at midnight was a
-- year-only placeholder. Any other date keeps its month and day.
-- A tag equal to the outlet named the Source, not a topic, so it is dropped.
-- Known Sources are named from the URL. Any other domain keeps its typed outlet.
UPDATE "Mention" SET
    "year" = EXTRACT(YEAR FROM "publishedAt")::INTEGER,
    "month" = CASE WHEN "publishedAt" = date_trunc('year', "publishedAt") THEN NULL
        ELSE EXTRACT(MONTH FROM "publishedAt")::INTEGER END,
    "day" = CASE WHEN "publishedAt" = date_trunc('year', "publishedAt") THEN NULL
        ELSE EXTRACT(DAY FROM "publishedAt")::INTEGER END,
    "topicTags" = ARRAY(
        SELECT t FROM unnest("tags") WITH ORDINALITY AS u(t, i)
        WHERE btrim(t) <> '' AND lower(btrim(t)) <> lower(btrim("outlet"))
        ORDER BY i
    ),
    "sourceName" = CASE
        WHEN "url" ~* '^https?://([^/]+\.)?(linkedin\.com|lnkd\.in|youtube\.com|youtu\.be|youtube-nocookie\.com)(/|$)' THEN NULL
        ELSE "outlet" END;

ALTER TABLE "Mention" ALTER COLUMN "year" SET NOT NULL;

DROP INDEX "Mention_published_publishedAt_idx";
ALTER TABLE "Mention" DROP COLUMN "outlet",
DROP COLUMN "publishedAt",
DROP COLUMN "tags";
CREATE INDEX "Mention_published_idx" ON "Mention"("published");

-- The one production Mention is an lnkd.in short link (#65). SQL can't follow
-- redirects, so its resolved URL is written here. New short links are
-- resolved by the mention router on save.
UPDATE "Mention"
SET "url" = 'https://www.linkedin.com/feed/update/urn:li:activity:7282169875932790785/'
WHERE "url" = 'https://lnkd.in/p/gpWBNiNF';
