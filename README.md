# Saudi Riyal Collection — saudiriyal.store

A premium luxury gallery website for rare banknotes, coins, and medals by Abdullah Al Khathami.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **Database/Auth/Storage**: Supabase
- **i18n**: next-intl (English + Arabic with full RTL)
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in Supabase credentials
3. Run the SQL migration in Supabase SQL Editor (`supabase/migrations/001_initial_schema.sql`)
4. Create a `item-images` storage bucket in Supabase (public access)
5. Create an admin user in Supabase Auth dashboard

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (with country code) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email address |

## Features

- Luxury bilingual gallery (EN/AR with RTL)
- Admin panel for item management
- eBay listing import helper
- Image upload with gallery
- Advanced filtering and search
- Trust & feedback page with eBay reputation
- SEO optimized with sitemap and Open Graph
- Mobile-first responsive design

## Admin Access

Navigate to `/en/admin/login` to access the admin panel.
