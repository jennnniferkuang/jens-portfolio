Hi welcome to my epic portfolio mono-repo :P
Deployed/hosted on Vercel, using Supabase DB and Prisma infra.

Live site: https://jenniferkuang.me/

# Notes for self/devs

To start frontend locally:
```cli
npm run build
npm run dev
```

To install dependencies:
```cli
bun i
npm i
```

To apply database changes and generate Prisma migration:
```cli
npx prisma format
npx prisma validate
npx prisma migrate dev --name init_content
npx prisma generate
```

## Art market payments
The `/payments` page creates one-time Stripe Checkout Sessions using
`STRIPE_SECRET_KEY`. The online payment charge defaults to 3% and can be
configured with hardcoded constants in `market-payments.ts`.
`feeRateBps` uses basis points, so `300` means 3%. Amounts
ending in `Cents` use Canadian cents.

# Bug backlog
- mobile scroll at very end slightly cut off until you scroll down hard to bring up the search bar (safari at least)
- just everything wrong with mobile horizontal view

# To do
- Project gallery
- Rotating moodboard/hero gallery (what's the best way to show this on mobile too?)
- Visitor gallery - leave a drawing!
- Sister art site
