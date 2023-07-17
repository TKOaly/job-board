#!/bin/env bash

# Script for migrating from the old PostgreSQL schema to the new one.

EXEC="docker-compose exec -T db"
PSQL="${EXEC} psql --username job-board"

$PSQL -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'

$EXEC psql -U job-board -d job-board /dev/fd/0 < $1
$PSQL -c 'ALTER SCHEMA public RENAME TO public_old;'

docker-compose run next npx prisma db push
docker-compose run next npx prisma generate
docker-compose run next node scripts/migrate.mjs

$PSQL -c 'DROP SCHEMA public_old CASCADE;'
