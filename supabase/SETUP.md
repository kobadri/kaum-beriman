# Supabase backend — Penyegaran Pagi FKKP

GitHub Pages hosts the static PWA; Supabase provides PostgreSQL, Auth, and Storage. The integration code is prepared, but no live Supabase project is connected until you create one and configure its public URL/key.

## 1. Create the Supabase project

1. Open https://supabase.com/dashboard and create a project. Save the database password somewhere safe; do not send it in chat.
2. In the new project's **SQL Editor**, open a new query and run the full contents of this repository's [schema.sql](./schema.sql). Wait for the query to finish successfully before proceeding.
3. Open the project's **Connect** dialog or **Settings → API Keys** and copy the **Project URL** and **publishable key** (or legacy anon public key).
4. In the repository root (the same level as `index.html` and `app.js`), create a new file named exactly `supabase-config.js`. Copy the template from [config.example.js](./config.example.js) and replace its two placeholder values:
   - `url`: your Project URL, for example `https://YOUR-PROJECT-REF.supabase.co`
   - `anonKey`: your publishable key (or legacy anon public key)
5. Commit `supabase-config.js` to the `main` branch. The public/publishable key is designed for browser use when Row Level Security (RLS) and policies are configured correctly.
6. Never put a `service_role` key or any secret key in HTML, JavaScript, GitHub, or chat.

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

## 3. Publish and store content

- Each material is one row in `reading_materials`: 12 weeks × 7 sections (Garis Besar + Senin–Sabtu).
- Save as **Draf**, **Siap ditinjau**, or **Terbit**. Only published materials are visible on the public home page.
- New files must be uploaded through Admin **Pusat unggah file**. First select week, day/section and type (text, audio or video); the date is calculated from the program start date, and the app generates a folder pattern and collision-resistant filename. The `reading_assets` table records original name, generated name, date, type, status and path. Files upload to the `reading-media` bucket.
- The `reading-media` bucket is private. Published assets receive temporary signed links (valid for one hour) when a reader opens the app. Do not upload confidential personal files.
- Upload limit is 100 MB per file. Text/document accepts TXT, Markdown, PDF, DOC, DOCX, RTF, ODT and HTML; audio accepts MP3, M4A, AAC, OGG and WAV; video accepts MP4 and WebM. Executables and arbitrary binary files are intentionally not accepted.
- Directly adding files to GitHub manually bypasses this intake workflow. Files committed directly to the repository are not automatically registered in `reading_assets`.

## 4. GitHub Pages

Enable Pages under repository **Settings → Pages**, selecting the `main` branch and `/(root)` if using branch deployment. The typical project URL is `https://kobadri.github.io/kaum-beriman/`; use the URL shown in GitHub Pages settings.

In Supabase **Authentication → URL Configuration**, add the actual GitHub Pages URL to the allowed site URLs if required. The app uses email/password authentication and does not require an OAuth callback for this login flow.

## Current limitations

- The backend cannot be verified until the Supabase project is created, the SQL succeeds, and the root `supabase-config.js` file contains the correct public URL/key.
- Public visits/analytics are not recorded yet.
