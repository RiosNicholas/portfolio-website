#!/bin/sh
set -e

# Migrations run against DIRECT_URL, which is set to production by hand. A
# preview may only migrate and backfill its own Neon branch, so refuse any URL
# that points at the same host as DIRECT_URL.
if [ "$VERCEL_ENV" = production ]; then
	prisma migrate deploy && tsx prisma/backfill-dates.ts && tsx scripts/seed-if-empty.ts
elif [ "$VERCEL_ENV" = preview ]; then
	branch_host=${DATABASE_URL_UNPOOLED##*@}
	branch_host=${branch_host%%[/:?]*}
	prod_host=${DIRECT_URL##*@}
	prod_host=${prod_host%%[/:?]*}
	if [ -n "$branch_host" ] && [ "$branch_host" != "$prod_host" ]; then
		echo "Preview migrations: ${branch_host%%.*} (production is ${prod_host%%.*})"
		# The backfill's PrismaClient reads DATABASE_URL, so give it the branch
		# URL that passed the host check.
		DIRECT_URL="$DATABASE_URL_UNPOOLED" prisma migrate deploy &&
			DATABASE_URL="$DATABASE_URL_UNPOOLED" tsx prisma/backfill-dates.ts
	else
		echo "Preview migrations skipped: no separate preview database detected"
	fi
fi

next build
