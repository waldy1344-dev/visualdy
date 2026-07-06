# Visualdy

Visualdy adalah aplikasi web modern yang dibangun menggunakan **Next.js**, **React**, dan **Tailwind CSS**, dengan **Supabase** sebagai basis datanya. Aplikasi ini dirancang untuk menampilkan portofolio, ulasan klien (testimonial), serta dilengkapi dengan panel admin untuk mengelola konten secara dinamis.

## 🚀 Fitur Utama

- **Halaman Portofolio**: Menampilkan proyek-proyek terbaru dengan filter kategori.
- **Halaman Testimonial**: Menampilkan ulasan dari klien.
- **Panel Admin**: Dashboard khusus (dilindungi autentikasi) untuk menambah, mengedit, dan menghapus data portofolio dan testimonial.
- **Integrasi Supabase**: Menggunakan Supabase untuk autentikasi dan database real-time.
- **Responsif**: Desain yang elegan dan menyesuaikan dengan semua ukuran layar.

## 🛠️ Teknologi yang Digunakan

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Database & Auth)
- [TypeScript](https://www.typescriptlang.org/)

## 📦 Panduan Instalasi Lokal

1. Pastikan **Node.js** sudah terinstal di sistem Anda.
2. Lakukan *clone* (unduh) repositori ini:
   ```bash
   git clone https://github.com/waldy1344-dev/visualdy.git
   ```
3. Masuk ke dalam direktori proyek:
   ```bash
   cd visualdy
   ```
4. Instal dependensi yang dibutuhkan:
   ```bash
   npm install
   ```
5. Salin file `.env.example` ke `.env.local` (jika ada) dan isi kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
6. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
7. Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000).

## 📄 Lisensi

Hak Cipta © 2024 Visualdy.
