# [circel.me](https://circel.me) | [Github](https://github.com/martonlanga/circel) — A hybrid approach

# Features

1. Sign up using Twitter and upload your followers
2. Send out personalized DM's to your followers, with a link where they can subscribe to your email list
3. Create a campaign with a deadline, and set a bounty
4. Your followers sign up and verify their email
5. They can opt-in to become a referrers, and use their special link to advance on the leaderboard
6. The followers with the highest referral count receive cryptocurrency as a form of payment
7. At the end of the campaign, export your list of email addresses, and import it on your platform of choice

# Architecture

# Testing

I made a new (Twitter account)[https://twitter.com/circeldotme] and bought 500 followers with BTC for testing.

# Future plans

-   Local version, that let's you own your data
-   White glove service for a few passionate users

# Codebase

```
├── prisma // postgres db — hosted on amazon
│   └── schema.prisma
├── public // static files
├── server // server — running in a ec2
│   ├── email.ts
│   ├── prisma
│   │   └── schema.prisma // in sync with the other schema file (for now, just manually)
│   ├── src
│   │   └── index.ts
│   └── upload.ts
├── src // hosted on vercel
│   ├── components // react components
│   ├── lib // helper functions
│   ├── pages // next.js pages
│   │   ├── api // next.js api routes
│   └── styles // styles
...
```

# FAQ

## How are the DM's sent?

A cron job is running every hour and sends out 42 to messages from each accout. During the requests, the job waits for a random interval to avoid being rate limited.

## Why upload the followers?

-   Works better for larger accounts
-   Your following can undergo changes during crawling, which means that some people could potentially be left out
-   For smaller accounts, there will be an option to get their followers using the api

# Misc

### Reset DB

```
rm -rf prisma/migrations && dropdb circel-db &&
npx prisma migrate save --name 'init' --experimental && npx prisma migrate up --experimental && npx prisma generate
```

### Boilerplates:

-   Nextjs: [with-tailwindcss](https://github.com/zeit/next.js/tree/canary/examples/with-tailwindcss)
-   Nextjs: [with-iron-session](https://github.com/vercel/next.js/tree/canary/examples/with-iron-session)
-   Prisma: [rest-nextjs](https://github.com/prisma/prisma-examples/tree/master/typescript/rest-nextjs)
-   Prisma: [deploying-to-vercel](https://www.prisma.io/docs/guides/deployment/deploying-to-verce)

### Todos

-   [ ] Mobile styles
-   [ ] Make it work locally
-   [ ] Consistent error handling in api routes and client
-   [ ] Make TS adhere to a standard (eg. IUser)
-   [ ] Protect routes if not authenticated (both api & page)
-   [ ] https://github.com/whois-api-llc/node-email-verifier
