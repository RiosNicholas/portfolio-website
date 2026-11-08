-- Swap em dashes for hyphens in case study and CV text, to match the seed.
-- Data only, safe to re-run. Endorsement quotes are left verbatim.

UPDATE "CaseStudy" SET
  "description" = replace("description", '—', '-'),
  "org"         = replace("org", '—', '-'),
  "role"        = replace("role", '—', '-'),
  "title"       = replace("title", '—', '-'),
  "titleEm"     = replace("titleEm", '—', '-'),
  "titleSuffix" = replace("titleSuffix", '—', '-'),
  "year"        = replace("year", '—', '-'),
  "tags"        = ARRAY(SELECT replace(t, '—', '-') FROM unnest("tags") AS t),
  "updatedAt"   = now()
WHERE concat_ws(' ', "description", "org", "role", "title", "titleEm", "titleSuffix", "year", array_to_string("tags", ' ')) LIKE '%—%';

UPDATE "CvEntry" SET
  "title"       = replace("title", '—', '-'),
  "where"       = replace("where", '—', '-'),
  "years"       = replace("years", '—', '-'),
  "titleAccent" = ARRAY(SELECT replace(t, '—', '-') FROM unnest("titleAccent") AS t),
  "updatedAt"   = now()
WHERE concat_ws(' ', "title", "where", "years", array_to_string("titleAccent", ' ')) LIKE '%—%';
