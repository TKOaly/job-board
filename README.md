# Job Board

This is a rewrite of the old TKO-äly job board with modern frameworks and libraries (Next.js, Prisma & Tailwind).

## What is it used for?

Job Board is a specific use-case application for TKO-äly's needs. TKO-äly offers sponsorships to promote CS-oriented jobs to the University of Helsinki's Computer Science students.

Users can visit the site to view current and expired job postings, view the details and find contact information to apply for the job. Users can also search for keywords.

TKO-äly's company correspondents can post job postings using the admin panel. Companies are selected from a dropdown list to associate the same company with all its job postings, and companies can be added.
Sponsor companies also have their logo displayed in their job postings, both on the front page and in the details. Company correspondents can upload these from the admin panel.

## Database

The database is handled through Prisma, and the most up-to-date schema can be found in [prisma/schema.prisma](https://github.com/TKOaly/job-board-next/blob/main/prisma/schema.prisma).  
The model is very simplified and limited in scope.

## Authentication

Job Board uses next-auth to authenticate adminstratos through TKO-äly's [user service OAuth](https://github.com/tkoaly/user-service). It is simple to replace the OAuth provider with another, following [next-auth's documentation](https://next-auth.js.org/providers/).

## Developing

While Job Board can be run in isolation, it would require the authentication service to be mocked (or disabled). The provided [docker-compose.yml](https://github.com/TKOaly/job-board-next/blob/main/docker-compose.yml) sets up a local development database.

The easiest way to develop Job Board is to set up the [tko-aly.localhost](https://github.com/tkoaly/tko-aly.localhost) environment. Job Board is currently not included in the environment, but can be run separately with `docker-compose up` in the project root.

### Database problems & seeding

Currently it might be necessary to generate the prisma client in the docker container.  
Connect to the container and run `yarn prisma generate`, if you receive an error about `@prisma/client`.

Seeding data can be done by connecting to the container and running `yarn prisma db seed`.  
Amounts can be specified with `yarn seed` using the command line arguments `--companies`, `--tags` and `--posts`.  
For example, to seed the database with 75 companies, 500 posts and 15 tags: `yarn seed --companies 75 --posts 500 --tags 15`.

You may also reset the database to just seed data with `yarn prisma migrate reset`.  
The data is completely random. The seeds script can be run multiple times in succession to generate large amounts of mock data.

Emptying the database is done with `yarn prisma migrate reset --skip-seed`.
