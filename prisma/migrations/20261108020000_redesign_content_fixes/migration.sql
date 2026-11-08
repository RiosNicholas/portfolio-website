-- Content fixes for the redesign. Data only, no schema change, and safe to
-- re-run: each statement is a no-op once applied.

-- Apple Community Education Initiative as the last Experience row.
INSERT INTO "CvEntry" ("id", "category", "years", "title", "titleAccent", "where", "sortOrder", "createdAt", "updatedAt")
SELECT 'cv-apple-cei-2022', 'EXPERIENCE', 'Aug ''22 — Dec ''22',
       'Computer Science Education Facilitator', '{}',
       'Apple Community Education Initiative',
       COALESCE((SELECT MAX("sortOrder") + 1 FROM "CvEntry" WHERE "category" = 'EXPERIENCE'), 0),
       now(), now()
WHERE NOT EXISTS (
  SELECT 1 FROM "CvEntry" WHERE "title" = 'Computer Science Education Facilitator'
);

-- Lead endorsements with Matthew (current role), then Steven.
UPDATE "Endorsement" SET "sortOrder" = 0, "updatedAt" = now() WHERE "name" = 'Matthew Baker' AND "sortOrder" <> 0;
UPDATE "Endorsement" SET "sortOrder" = 1, "updatedAt" = now() WHERE "name" = 'Steven Tejeda' AND "sortOrder" <> 1;

-- Remove the internal JPMorganChase case study.
DELETE FROM "CaseStudy" WHERE "id" = 'risk-agents';
