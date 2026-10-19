# Supabase backend — Penyegaran Pagi FKKP

GitHub Pages hosts the static PWA; Supabase provides PostgreSQL, Auth, and Storage. The repository contains the integration code, but no live Supabase project is created or connected yet.

## 1. Create the Supabase project

1. Open https://supabase.com/dashboard and create a project.
2. In **SQL Editor**, run the full contents of [schema.sql](./schema.sql).
3. Open the project's **Connect** dialog or **Settings → API Keys** and copy the Project URL and **publishable key** (or legacy anon public key).
4. Edit `supabase-config.js` in the repository and replace `YOUR-PROJECT-REF` and `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` with those values. The publishable/anon key is intended for the browser only when RLS is enabled.
5. Never put a `service_role` or secret key in HTML, JavaScript, GitHub, or chat.

## 2. Create an admin account securely

1. In Supabase **Authentication → Users**, create the admin user.
2. Set the user's **app_metadata** to include `{ "role": "admin" }`. In the Supabase SQL Editor, run this after replacing the email with the exact admin account email:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'admin@example.com';
```

Check that exactly one row was updated. Do not use user-editable `user_metadata` for authorization. The browser editor checks this role and database RLS independently enforces it. After changing app metadata, sign out and sign in again so the session token is refreshed.
3. Open `/admin.html`, sign in with the admin email and password.
4. If the user lacks the role, the editor signs out and refuses access.

Do not share admin passwords or secret keys.

## 3. Publish and store content

- Each material is one row in `reading_materials`: 12 weeks × 7 sections (Garis Besar + Senin–Sabtu).
- Save as **Draf**, **Siap ditinjau**, or **Terbit**. Only published materials are visible on the public home page.
- PDF, audio, and video files upload to the `reading-media` bucket; the database stores their public URLs.
- The configured bucket is public because these materials are intended for all visitors. Do not upload confidential files.
- Upload limit is 100 MB per file. The current editor accepts PDF, audio, MP4, and WebM.
- Content is sanitized on the public page before rendering. Still only paste trusted source material.

## 4. GitHub Pages

Enable Pages under repository **Settings → Pages**, selecting the `main` branch and `/(root)` if using branch deployment. The typical project URL is `https://kobadri.github.io/kaum-beriman/`; use the URL shown in GitHub Pages settings.

If you use Supabase Auth redirect allow-lists, add the actual GitHub Pages URL (and local test URL if needed) in Supabase **Authentication → URL Configuration**. The app uses email/password authentication and does not require an OAuth callback for this login flow.

## Current limitations

- Backend connection cannot be verified until you create the Supabase project, run the SQL, and configure the public URL/key.
- This setup does not fabricate FKKP source text; no original reading/audio files were found in `media/` during repository inspection.
- Public visits/analytics are not recorded yet.
