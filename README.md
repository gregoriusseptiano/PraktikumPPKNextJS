# DUITku: Aplikasi Web Expense Tracker

Aplikasi web pencatat keuangan pribadi berbahasa Indonesia untuk mahasiswa, dibangun menggunakan Next.js dan Supabase dengan arsitektur desktop-first yang responsif sesuai [SRS.md](file:///c:/Users/Legion/OneDrive/Documents/Kuliah/Semester%205/PraktikumPPK/project-ppk%20NextJS/SRS.md) dan [DESIGN.md](file:///c:/Users/Legion/OneDrive/Documents/Kuliah/Semester%205/PraktikumPPK/project-ppk%20NextJS/DESIGN.md).

## Fitur Utama

- **Autentikasi & Sesi (Modul A & B)**: Registrasi, login, logout berbasis session server yang aman dengan Supabase Auth.
- **Preferensi Tema Cookie (Modul B)**: Mode terang (light) dan gelap (dark) tersimpan otomatis dalam cookie pengguna dan diterapkan konsisten saat kembali membuka web.
- **Manajemen Transaksi (Modul C & D)**:
  - Pencatatan pemasukan dan pengeluaran secara terstruktur.
  - Riwayat transaksi berurutan (terbaru ke terlama) dengan filter jenis (Semua, Pemasukan, Pengeluaran).
  - Tampilan detail transaksi, pengubahan (edit), dan penghapusan (delete) dengan konfirmasi.
  - Navigasi kembali (back button) yang jelas di setiap halaman transaksi.
- **Dashboard & Analisis Keuangan (Modul E & F)**:
  - Ringkasan metrik saldo saat ini, total pemasukan, dan total pengeluaran.
  - Daftar transaksi terbaru yang dapat diklik langsung untuk melihat detail.
  - Distribusi pengeluaran per kategori bulan berjalan.
  - Isolasi data per pengguna (*Data Isolation & Security*).
- **Laporan Keuangan (Modul E & F)**:
  - Visualisasi SVG Pie Chart proporsional dengan legenda nominal dan persentase per kategori.
  - Pemilih bulan interaktif dan switcher jenis transaksi.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Server Components)
- **UI Library**: React 19, Tailwind CSS 4
- **Tipografi**: Montserrat via `next/font/google`
- **Ikon**: Lucide React
- **Database & Auth**: Supabase PostgreSQL dengan Row-Level Security (RLS)
- **Manajemen Tema**: Cookie-based SSR theme switcher

## Prerequisites

- Node.js 18+
- npm, pnpm, atau yarn
- Akun Supabase (PostgreSQL Database)

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/gregoriusseptiano/PraktikumPPKNextJS.git
cd PraktikumPPKNextJS
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat berkas `.env.local` pada direktori root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

### 4. Setup Database Supabase

Jalankan script skema SQL yang ada di direktori `supabase/`:
- `supabase/schema.sql`: Membuat tabel `profiles`, tabel `transactions`, kebijakan RLS (*Row Level Security*), serta fungsi pemicu registrasi pengguna.

### 5. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Proyek

```text
app/
├── (auth)/                  # Layout dan halaman masuk (/login) serta daftar (/register)
├── api/                     # Endpoint API backend (dashboard, reports, auth callback)
├── dashboard/               # Halaman utama dashboard (/dashboard) dan loading skeleton
├── reports/                 # Halaman laporan keuangan bulanan (/reports)
├── transactions/            # Halaman riwayat (/transactions)
│   ├── [id]/                # Detail transaksi (/transactions/[id])
│   │   └── edit/            # Form ubah transaksi (/transactions/[id]/edit)
│   └── new/                 # Form catat transaksi baru (/transactions/new)
├── globals.css              # Konfigurasi token tema CSS dan Tailwind v4
└── layout.tsx               # Root layout dengan pembacaan cookie tema

components/
├── duitku/                  # Komponen antarmuka utama (Navbar web, TransactionRow, CategoryIcon)
├── transactions/            # Komponen transaksi (TransactionList, TransactionForm, FilterChips, dll)
├── LogoutButton.tsx         # Tombol logout sesi
└── ThemeToggle.tsx          # Pengubah tema terang/gelap (cookie-backed)

lib/
├── auth/                    # Server actions autentikasi
├── dashboard/               # Data access layer (DAL) dashboard dan laporan
├── supabase/                # Inisialisasi klien Supabase (server, client, middleware)
├── theme.ts                 # Konstanta dan utilitas cookie tema
└── transactions/            # Validasi form, query data, dan actions transaksi

docs/
├── SRS.md                   # Software Requirements Specification
└── DESIGN.md                # Design System dan arsitektur UI Web
```

## Akun Demo & Pengujian Multi-User

Untuk keperluan pengujian fitur, terutama pembuktian isolasi data (*Data Isolation & Security* antar-pengguna sesuai SRS Modul F), akun pengujian berikut dapat digunakan:

| Pengguna | Nama | Email | Kata Sandi | Tujuan Pengujian |
|---|---|---|---|---|
| **User 1 (Utama)** | Budi Santoso | `test@duitku.id` | `test123` | Pengujian ringkasan transaksi & dashboard utama |
| **User 2 (Pembanding)** | Siti Rahma | `user2@duitku.id` | `test123` | Verifikasi bahwa transaksi User 2 tidak muncul pada User 1 |
| **User 3 (User Baru)** | Dimas Mahasiswa | `user3@duitku.id` | `test123` | Pengujian zero state (tampilan awal saat belum ada transaksi) |

> **Panduan Pengujian Multi-User:**
> 1. Akun dapat didaftarkan langsung melalui menu **/register** (*Buat akun*) menggunakan email dan kata sandi di atas (atau akun uji coba lainnya).
> 2. Masuk bergantian dengan User 1 dan User 2 untuk memastikan bahwa transaksi, saldo, dan laporan keuangan masing-masing pengguna sepenuhnya terisolasi dan tidak saling bocor (memenuhi SRS NFR-02 & Section 4.2).
> 3. Masuk dengan User 3 untuk memvalidasi zero-state tampilan dashboard (`saldo = 0`, ringkasan kosong, dan pesan transaksi awal).

## Perintah Kerja (Scripts)

- `npm run dev`: Menjalankan development server lokal
- `npm run build`: Memeriksa tipe TypeScript dan membangun bundle produksi Next.js
- `npm run start`: Menjalankan server Next.js mode produksi
- `npm run lint`: Menjalankan pemeriksaan ESLint

## Deployment

Deploy ke [Vercel](https://vercel.com):

1. Hubungkan repositori GitHub ke Vercel.
2. Tambahkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY`).
3. Jalankan deploy.
