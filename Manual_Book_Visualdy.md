# WEB APLIKASI VISUALDY

---

## SAMPUL
*(Halaman Sampul Manual Book Web Aplikasi Visualdy)*

---

## HALAMAN JUDUL
**MANUAL BOOK PENGGUNAAN WEB APLIKASI VISUALDY**
*Sistem Manajemen Konten Portofolio Dinamis*
<br/>
<br/>
Halaman: i

---

## HALAMAN REVISI

| Tanggal | Versi | Deskripsi Revisi | Disetujui Oleh |
|---|---|---|---|
| 02 Mei 2026 | 1.0 | Rilis Dokumen Pertama | Tim Pengembang |

<br/>
Halaman: ii

---

## DAFTAR ISI

- [BAB 1: PENDAHULUAN](#bab-1-pendahuluan)
  - [1.1 Tentang Aplikasi](#11-tentang-aplikasi)
  - [1.2 Tujuan Manual](#12-tujuan-manual)
  - [1.3 Prasyarat Sistem](#13-prasyarat-sistem)
  - [1.4 Struktur Website Publik](#14-struktur-website-publik)
- [BAB 2: MEMULAI CEPAT](#bab-2-memulai-cepat)
  - [2.1 Login Pertama Kali](#21-login-pertama-kali)
  - [2.2 Navigasi Dasar](#22-navigasi-dasar)
- [BAB 3: PANDUAN FITUR](#bab-3-panduan-fitur)
  - [3.1 Dashboard](#31-dashboard)
  - [3.2 Manajemen Data](#32-manajemen-data)
  - [3.3 Laporan](#33-laporan)
  - [3.4 Pengaturan](#34-pengaturan)
- [BAB 4: ADMINISTRASI](#bab-4-administrasi)
  - [3.1 Manajemen Pengguna](#41-manajemen-pengguna)
  - [3.2 Backup & Restore](#42-backup--restore)
- [BAB 5: TROUBLESHOOTING & FAQ](#bab-5-troubleshooting--faq)
  - [5.1 Troubleshooting](#51-troubleshooting)
  - [5.2 FAQ](#52-faq)
- [BAB 6: LAMPIRAN](#bab-6-lampiran)
  - [6.1 Glosarium](#61-glosarium)
  - [6.2 Kontak Dukungan](#62-kontak-dukungan)

<br/>
Halaman: iii

---

## BAB 1: PENDAHULUAN

### 1.1 Tentang Aplikasi
Web Aplikasi Visualdy adalah platform sistem manajemen konten (CMS) berbasis *web* yang dirancang khusus untuk mengelola konten website portofolio dinamis Visualdy. Aplikasi ini dibangun dengan Next.js dan Supabase, memungkinkan administrator untuk memperbarui portofolio proyek, testimoni klien, dan kontak (termasuk integrasi prospek via WhatsApp) dengan mudah tanpa perlu keahlian pemrograman kode.

### 1.2 Tujuan Manual
Buku manual ini disusun untuk memberikan panduan komprehensif bagi pengguna (administrator dan staf) dalam mengoperasikan Web Aplikasi Visualdy. Manual ini mencakup instruksi langkah demi langkah dari proses masuk (login) hingga manajemen data tingkat lanjut.

### 1.3 Prasyarat Sistem
Untuk pengalaman penggunaan yang optimal, sistem ini membutuhkan prasyarat berikut:
1. **Perangkat**: Komputer, laptop, atau perangkat seluler pintar.
2. **Web Browser**: Versi terbaru dari Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari.
3. **Konektivitas**: Koneksi internet yang stabil untuk memastikan sinkronisasi data yang mulus dengan basis data utama (Supabase).

### 1.4 Struktur Website Publik
Bagian *front-end* (halaman publik yang diakses pengunjung) terhubung secara dinamis dan otomatis (real-time) dengan data yang Anda kelola melalui Admin CMS. Bagian utamanya meliputi:
- **Halaman Beranda**: Menampilkan profil singkat Visualdy, layanan utama, serta menyoroti beberapa karya dan testimoni unggulan.
- **Galeri Portofolio**: Halaman dinamis yang menampilkan daftar karya Anda. Setiap gambar dan teks deskripsi pada halaman ini sepenuhnya ditarik dari data yang diinputkan pada menu "Manajemen Data > Portofolio".
- **Integrasi Lead WhatsApp**: Pengunjung dapat menghubungi Anda secara langsung melalui tombol WhatsApp. Nomor tujuan tombol ini tidak terpasang kaku (hardcoded), melainkan dikendalikan secara fleksibel melalui menu "Pengaturan" di Admin CMS.

<br/>
*(Halaman 1 - 4)*

---

## BAB 2: MEMULAI CEPAT

### 2.1 Login Pertama Kali
1. Buka web browser Anda dan ketikkan alamat URL admin Visualdy (misalnya: `https://visualdy.com/login` atau URL yang telah diberikan).
2. Di halaman login, masukkan **Alamat Email** yang telah didaftarkan di sistem.
3. Masukkan **Kata Sandi (Password)** Anda dengan benar.
4. Klik tombol **Masuk (Login)**. Jika kredensial valid, Anda akan langsung diarahkan ke halaman *Dashboard* utama.

### 2.2 Navigasi Dasar
Tata letak aplikasi Visualdy menggunakan antarmuka modern yang ramah pengguna.
- **Sidebar Kiri**: Merupakan pusat navigasi tempat Anda dapat mengakses seluruh modul seperti Dashboard, Portofolio, Testimoni, dan Pengaturan.
- **Header Atas**: Menampilkan profil pengguna yang sedang aktif, opsi pengaturan akun, dan tombol keluar (Log Out).
- **Area Konten (Tengah)**: Tempat di mana Anda akan melihat rincian data dan formulir isian untuk setiap menu yang Anda pilih di Sidebar.

<br/>
*(Halaman 4 - 7)*

---

## BAB 3: PANDUAN FITUR

### 3.1 Dashboard
Halaman Dashboard adalah pusat informasi cepat. Di sini Anda akan melihat statistik umum tentang situs web portofolio Anda, seperti total proyek yang telah diunggah, jumlah total testimoni, dan akses pintas *(Quick Actions)* untuk segera menambahkan data baru.

### 3.2 Manajemen Data
Modul ini adalah fungsi inti untuk mengendalikan apa yang dilihat publik di website Visualdy.
- **Portofolio**:
  - Untuk menambahkan, tekan tombol **Tambah Proyek Baru**. Isi formulir judul, kategori, deskripsi, dan unggah gambar utama (tersimpan secara aman di Supabase Storage).
  - Anda dapat melakukan Edit atau Hapus pada data proyek lama menggunakan ikon aksi yang tersedia di tabel proyek.
- **Testimoni**:
  - Masukkan ulasan klien yang puas untuk meningkatkan kredibilitas di beranda website. Tambahkan nama klien, isi pesan, dan foto profil mereka.

### 3.3 Laporan
*(Catatan: Menyesuaikan implementasi yang ada)*
Menu laporan menyajikan rekap data dalam bentuk tabel dari aktivitas pembaruan CMS, termasuk status publikasi proyek dan ringkasan data lain yang berguna untuk evaluasi tim manajemen.

### 3.4 Pengaturan
Di halaman Pengaturan, Anda dapat menyesuaikan konfigurasi umum:
- Memperbarui tautan media sosial (Instagram, LinkedIn, dll).
- Mengubah nomor tujuan integrasi WhatsApp untuk fitur *Lead Generation* di website.

<br/>
*(Halaman 8 - 34)*

---

## BAB 4: ADMINISTRASI

### 4.1 Manajemen Pengguna
Fasilitas ini dikhususkan bagi *Super Administrator*.
- Memungkinkan pendaftaran akun baru untuk staf manajemen konten.
- Mengubah kata sandi pengguna atau mencabut akses untuk akun yang sudah tidak berlaku guna menjaga keamanan sistem CMS.

### 4.2 Backup & Restore
Semua data teks maupun media yang diunggah dikelola oleh database PostgreSQL di backend Supabase.
- Pencadangan (Backup) dilakukan secara otomatis oleh platform cloud.
- Jika ada indikasi masalah fatal atau ketidaksengajaan penghapusan massal, pemulihan (Restore) harus dikoordinasikan langsung melalui konsol teknis Supabase oleh pengembang sistem.

<br/>
*(Halaman 35 - 47)*

---

## BAB 5: TROUBLESHOOTING & FAQ

### 5.1 Troubleshooting
- **Gagal Login**: Pastikan tidak ada salah ketik pada email atau sandi. Pastikan juga status koneksi internet perangkat Anda aktif.
- **Gagal Unggah Gambar (Error Upload)**: Pastikan format gambar adalah JPG, PNG, atau WebP. Pastikan ukuran gambar tidak melebihi batas wajar (misal: lebih kecil dari 2MB), dan pastikan konfigurasi RLS (Row-Level Security) akses Storage telah dibuka oleh pengembang.
- **Website Publik Belum Update**: Cobalah merefresh browser website *(Ctrl + F5 / Cmd + Shift + R)* untuk menghapus cache lokal browser.

### 5.2 FAQ
**Tanya (T)**: Apakah saya harus paham *coding* untuk menggunakan admin ini?
**Jawab (J)**: Tidak perlu. CMS ini sudah dirancang berbasis UI (User Interface) layaknya mengisi formulir sosial media biasa.

**T**: Apakah fitur ini aman dari peretasan?
**J**: Sistem ini menggunakan autentikasi sisi peladen (Server-Side Authentication) berbasis *token* modern, yang mencegah modifikasi tanpa izin akses login yang valid.

<br/>
*(Halaman 48 - 54)*

---

## BAB 6: LAMPIRAN

### 6.1 Glosarium
- **CMS (Content Management System)**: Perangkat lunak untuk membuat, mengelola, dan memodifikasi konten digital.
- **CRUD**: *Create, Read, Update, Delete*, adalah empat fungsi dasar untuk database.
- **PostgreSQL**: Sistem basis data relasional kuat dan canggih (digunakan oleh Supabase).
- **Prospek (Lead)**: Potensi pelanggan yang menghubungi layanan via WhatsApp.

### 6.2 Kontak Dukungan
Untuk bantuan lebih lanjut terkait teknis aplikasi yang di luar kendali buku manual ini, silakan hubungi:
- **Tim Pengembang Web Visualdy**
- **Email Support**: support@visualdy.com
- **WhatsApp IT Support**: (Nomor Admin Teknis / Developer)

<br/>
*(Halaman 55 - 57)*
