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
