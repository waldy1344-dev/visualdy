# Visualdy

Visualdy adalah aplikasi web portofolio dan jasa desain grafis yang dibangun dengan **Next.js**, **React**, **Tailwind CSS**, dan **Supabase**. Aplikasi ini menampilkan portofolio, testimoni klien, halaman review, dan panel admin untuk mengelola konten.

## 🚀 Fitur Utama

- **Beranda modern** dengan hero section, statistik, portofolio unggulan, dan ulasan klien.
- **Halaman Portfolio**: Filter kategori, pencarian, dan tampilan karya desain.
- **Halaman Testimoni**: Menampilkan ulasan klien dan rating rata-rata.
- **Halaman Review**: Form untuk mengirim testimoni baru beserta foto opsional.
- **Admin Dashboard**: Login/register admin Superuser, kelola portofolio, testimonial, dan link sosial.
- **Integrasi Supabase**: Autentikasi dan penyimpanan data menggunakan Supabase.
- **CTA WhatsApp**: Tombol order langsung ke WhatsApp.
- **Responsif**: Tampilan mobile dan desktop yang adaptif.

## 📍 Halaman Utama

- `/` — Beranda utama
- `/portfolio` — Daftar semua karya portofolio dengan filter dan pencarian
- `/testimonial` — Ulasan klien dan ringkasan rating
- `/review` — Form pengiriman testimoni baru
- `/admin/login` — Login atau register admin
- `/admin/dashboard` — Panel admin setelah autentikasi

## 🛠️ Teknologi yang Digunakan

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (database, auth, dan file storage)
- [TypeScript](https://www.typescriptlang.org/)
- [React Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 📦 Installasi Lokal

1. Pastikan **Node.js** terinstal.
2. Clone repositori:
   ```bash
   git clone https://github.com/waldy1344-dev/visualdy.git
   ```
3. Masuk ke direktori proyek:
   ```bash
   cd visualdy
   ```
4. Install dependensi:
   ```bash
   npm install
   ```
5. Buat file `.env.local` dan tambahkan konfigurasi Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
6. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
7. Buka [http://localhost:3000](http://localhost:3000).

## 🔒 Admin Login

Admin dapat mendaftar atau masuk melalui `/admin/login`. Username akan dikonversi menjadi email dalam format `vd.<username>@gmail.com` saat autentikasi.

## 📄 Catatan Supabase

- Pastikan tabel dan kolom Supabase mendukung data `portfolios`, `testimonials`, dan `social_links`.
- Jika halaman /admin/dashboard menggunakan aksi server, konfigurasi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` harus tersedia di environment.

## 📦 Script NPM

- `npm run dev` — Jalankan mode development
- `npm run build` — Build aplikasi untuk production
- `npm run start` — Jalankan server production
- `npm run lint` — Jalankan linter

## 🤝 Lisensi

Hak Cipta © 2026 Visualdy.
