# Carbon Culture — Frontend

Storefront and admin for Carbon Culture. Vite, React, TypeScript and Tailwind.

Customers build a bag and send the whole order to the studio as one WhatsApp message. The admin at `/admin`
manages products, collections and store settings through the [backend API](https://github.com/Tobe0504/carbon-culture-be).

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/our-story` | About Carbon Culture |
| `/collections` | Product grid, filter with `?c=<collection>` and search with `?q=<term>` |
| `/product/:slug` | Product detail |
| `/admin` | Admin (sign in at `/admin/login`) |

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

Runs on http://localhost:5173. Set `VITE_API_BASE_URL` to the backend URL followed by `/api`.

## Deploying

Deploy to Vercel. `vercel.json` rewrites all routes to the SPA. Set `VITE_API_BASE_URL` in the project settings.

## Images

Brand photography is hosted on Cloudinary and listed in `src/lib/brandImages.ts`. Product images and collection
covers are managed in the admin.
