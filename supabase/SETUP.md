# Supabase backend — Penyegaran Pagi FKKP

GitHub Pages can host the static PWA but cannot run a private database or secure server code. Supabase is the proposed backend for the database, admin authentication, and media storage.

## Current status

The repository now includes the database schema in `schema.sql`. The live Supabase project has **not** been created or connected yet. Until a project is connected, admin edits remain browser-local and are not shared with visitors.

## Setup

1. Create a project at https://supabase.com/dashboard.
2. Open **SQL Editor**, create a query, paste all of `supabase/schema.sql`, and run it.
3. Open **Project Settings → API** (or the project's API settings page) and copy the Project URL and the **publishable/anon public key**.
4. Do not put a `service_role` or secret key in any HTML or JavaScript file. The browser must only use the public key; row-level security policies protect the data.
5. Create the first admin user in Supabase Authentication. Then, from a trusted administrative environment, set that user's **app_metadata** to include `{ "role": "admin" }`. Do not use user-editable `user_metadata` for authorization. Never publish an admin/service key in this repository.
6. Configure the client integration in a subsequent step using the Project URL and public key. No credentials are needed in this schema file.

## Database model

- One row per week/section: 12 weeks × 7 sections (Garis Besar + Senin–Sabtu).
- `status`: `draft`, `ready`, or `published`.
- Public visitors can read only rows marked `published`.
- Only authenticated users with `app_metadata.role = admin` can edit any rows or upload/delete media.
- The public `reading-media` bucket is for content intended for all visitors. Do not upload private or confidential files.

## GitHub Pages

Enable Pages for this repository under **Settings → Pages**, using the `main` branch and `/(root)` if that is the selected deployment method. The application URL is typically `https://kobadri.github.io/kaum-beriman/`, but confirm the exact URL shown in the Pages settings.

## Important

This setup is a backend foundation, not a claim that the site is already connected. After the Supabase project is created and the SQL runs successfully, wire the browser client, login/logout, material loading/saving, publication status, and media uploads. Keep all published source text faithful to the supplied FKKP materials; do not invent missing readings.
