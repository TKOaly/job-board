#!/bin/env bash

# Script for migrating from the old PostgreSQL schema to the new one.

EXEC="docker-compose exec -T ${DB_SERVICE:=db}"
PSQL="${EXEC} psql --username job-board"

$PSQL -c 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'

$EXEC psql -U job-board -d job-board < $1
$PSQL -c 'ALTER SCHEMA public RENAME TO public_old;'

docker-compose run ${NEXT_SERVICE:=next} npx prisma db push
docker-compose run ${NEXT_SERVICE:=next} npx prisma generate
docker-compose run ${NEXT_SERVICE:=next} node scripts/migrate.mjs

$PSQL -c 'DROP SCHEMA public_old CASCADE;'
