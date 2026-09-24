# DUITku - Aplikasi Pencatat Keuangan Harian

Aplikasi pencatat keuangan pribadi berbahasa Indonesia untuk mahasiswa, dibangun dengan Next.js dan Supabase.

## Fitur

- **Autentikasi** - Registrasi, login, dan logout dengan Supabase Auth
- **Dashboard** - Ringkasan saldo, pemasukan, pengeluaran, dan transaksi terakhir
- **Transaksi** - CRUD transaksi (pemasukan/pengeluaran) dengan filter dan riwayat
- **Laporan** - Ringkasan bulanan berdasarkan kategori
- **Dark Mode** - Tema terang dan gelap dengan preferensi tersimpan di cookie

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js Server Actions, Supabase
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Authentication
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- npm atau yarn
- Supabase account

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

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

### 4. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Project Structure

```
app/
├── (auth)/          # Halaman login dan register
├── api/             # API routes
├── dashboard/       # Halaman dashboard
├── transactions/    # Halaman CRUD transaksi
├── reports/         # Halaman laporan
└── layout.tsx       # Root layout

lib/
├── auth/            # Server actions untuk autentikasi
├── dashboard/       # Data access layer dashboard
└── supabase/        # Supabase client configuration

components/
├── duitku/          # Komponen UI DUITku
└── transactions/    # Komponen transaksi
```

## Akun Demo

Untuk testing, gunakan akun berikut:

- **Email**: `test@duitku.id`
- **Password**: `test123`

## Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build production
- `npm run start` - Jalankan production server
- `npm run lint` - Jalankan ESLint

## Deployment

Deploy ke [Vercel Platform](https://vercel.com):

1. Push kode ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy

## License

MIT
