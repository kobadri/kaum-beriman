# Kaum Beriman (1) — kerangka awal

Aplikasi PWA awal untuk program bacaan 12 pekan.

## Aturan isi
- Tidak ada menu atau judul “Minggu”.
- “Garis Besar” adalah bagian khusus untuk menyiapkan bacaan Senin–Sabtu.
- Ada 12 Garis Besar dan 72 bacaan harian (12 × 6).

## Berkas
- `index.html`: halaman anggota, dengan kontrol ukuran teks A−/A+ pada area bacaan; tata letak utama tetap responsif terhadap layar.
- `admin.html`: kerangka Admin Editor.
- `styles.css`, `app.js`: tampilan dan perilaku halaman anggota.
- `manifest.webmanifest`, `service-worker.js`: fondasi PWA.

## Penting: status saat ini
Ini adalah kerangka frontend untuk memulai proyek, belum aplikasi produksi.
- Konten bacaan belum diimpor.
- Tombol simpan draf menyimpan data teks di browser lokal saja.
- Pemilihan PDF/audio/video hanya memilih berkas di browser; belum mengunggah ke server.
- Pratinjau terbitkan hanya membuka pratinjau, belum menerbitkan ke anggota.
- Login admin, database, penyimpanan media, serta analitik perlu dihubungkan ke backend (misalnya Supabase) sebelum digunakan sungguhan.
- Ukuran teks bacaan dapat diubah melalui A−/A+ tanpa memperbesar seluruh tata letak aplikasi. Zoom bawaan browser tetap tidak diblokir demi aksesibilitas.
- Jangan memasukkan kredensial rahasia ke kode frontend.

## Publikasi GitHub Pages
1. Unggah semua berkas dan folder proyek ini ke root repositori `kobadri/kaum-beriman`.
2. Buka **Settings → Pages**.
3. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/(root)`, lalu tekan **Save**.
5. Tunggu deployment selesai pada tab **Actions**.

## Materi audio
Simpan materi di folder `media/` setelah diunggah, atau gunakan penyimpanan media terpisah. Nama berkas yang sudah ada dapat dipertahankan, misalnya `S_01_Senin.mp3`.
