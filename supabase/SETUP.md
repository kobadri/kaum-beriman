# Supabase backend — Penyegaran Pagi FKKP

GitHub Pages hosts the static PWA; Supabase provides PostgreSQL, Auth, and Storage. The code is being prepared for a reusable, multi-book archive. A live backend is not connected until you create a Supabase project and configure its public URL/key.

## 1. Create the Supabase project

1. Open https://supabase.com/dashboard and create a project. Save the database password somewhere safe; do not send it in chat.
2. In the new project's **SQL Editor**, run the full contents of [schema.sql](./schema.sql).
3. **Wait before running the multi-book migration.** The migration file is staged at [migrations/20261019_multi_book_support.sql](./migrations/20261019_multi_book_support.sql), but the public and admin screens must first be updated to select and manage books. Do not run that migration yet; applying it before the screen update would make the current single-book editor incompatible with the new database constraints. Once the screen update is committed, follow the updated instructions here.
4. Open the project's **Connect** dialog or **Settings → API Keys** and copy the **Project URL** and **publishable key** (or legacy anon public key).
5. In the repository root (the same level as `index.html` and `app.js`), create a file named exactly `supabase-config.js`. Copy the template from [config.example.js](./config.example.js) and replace its two placeholder values:
   - `url`: your Project URL
   - `anonKey`: your publishable key (or legacy anon public key)
6. Commit `supabase-config.js` to the `main` branch. The public/publishable key is designed for browser use when Row Level Security (RLS) and policies are configured correctly.
7. Never put a `service_role` key or any secret key in HTML, JavaScript, GitHub, or chat.

## 2. Create an admin account securely

1. In Supabase **Authentication → Users**, create the admin user.
2. Grant the exact user's email the role through **app_metadata**. In the Supabase SQL Editor, replace the email below with the exact admin email, then run:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'admin@example.com';
```

3. Check that exactly one row was updated. Do not use user-editable `user_metadata` for authorization. After changing app metadata, sign out and sign in again so the session token is refreshed.
4. Open `/admin.html` on the published site and sign in with that admin email and password. If the user lacks the role, the editor signs out and refuses access.

Do not share admin passwords or secret keys.

## 3. Multi-book content model

- The `reading_books` catalog stores each book/program's title, unique slug, number of weeks, start date, status, and description.
- The existing *Kaum Beriman (1)* program is retained as a 12-week entry starting 5 October 2026. The migration associates existing materials and files with that entry; it does not delete old records or files.
- Each book can have its own week count (from 1 to 104). Each week has Garis Besar and Monday–Saturday sections.
- Book status can be draft, active, or archived. Archived books remain available for reading and historical reference.
- Materials are stored in `reading_materials`; uploaded file metadata is stored in `reading_assets`; the actual files remain in the private `reading-media` Storage bucket.
- New files should be uploaded through Admin **Pusat unggah file** so the selected book, week, day/section, type, date, generated name, and storage path remain associated.
- Upload limit is 100 MB per file. Text/document accepts TXT, Markdown, PDF, DOC, DOCX, RTF, ODT and HTML; audio accepts MP3, M4A, AAC, OGG and WAV; video accepts MP4 and WebM.
- Directly adding files to GitHub manually bypasses the intake workflow. Files committed directly to the repository are not automatically registered in `reading_assets`.

## 4. GitHub Pages

Enable Pages under repository **Settings → Pages**, selecting the `main` branch and `/(root)` if using branch deployment. The typical project URL is `https://kobadri.github.io/kaum-beriman/`; use the URL shown in GitHub Pages settings.

In Supabase **Authentication → URL Configuration**, add the actual GitHub Pages URL to the allowed site URLs if required. The app uses email/password authentication and does not require an OAuth callback for this login flow.

## Storage growth and long-term retention

- Keep metadata in PostgreSQL and file bytes in object storage; do not put large PDFs/audio/video blobs into database rows.
- Preserve old books by default. Archive rather than delete.
- Track file sizes and storage totals before setting retention rules. A later improvement can add a per-book storage report and an admin-only archive/export workflow.
- If usage grows, consider moving infrequently accessed old media to an external object-storage/archive tier, or offering download/export before any deletion. Supabase Storage objects cannot simply be moved to cold storage by changing a database row; an actual copy/migration and link update would be required.
- Public visits/analytics are not recorded yet.

## Current limitations

The multi-book SQL migration is prepared but must not be run until the book selector and book-management interface are committed and these instructions are updated. The backend cannot be verified until a Supabase project is created, the required SQL files are run successfully, and the root `supabase-config.js` file contains the correct public URL/key.
