-- Old "year" / "years" columns stay nullable until the backfill is verified, then get dropped.
ALTER TABLE "CaseStudy" ALTER COLUMN "year" DROP NOT NULL,
ADD COLUMN "startYear" INTEGER,
ADD COLUMN "startMonth" INTEGER,
ADD COLUMN "endYear" INTEGER,
ADD COLUMN "endMonth" INTEGER,
ADD COLUMN "present" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "CvEntry" ALTER COLUMN "years" DROP NOT NULL,
ADD COLUMN "startYear" INTEGER,
ADD COLUMN "startMonth" INTEGER,
ADD COLUMN "endYear" INTEGER,
ADD COLUMN "endMonth" INTEGER,
ADD COLUMN "present" BOOLEAN NOT NULL DEFAULT false;
