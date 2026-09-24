# DESIGN.md — DUITku

> Design system untuk DUITku, aplikasi web Expense Tracker (pencatat keuangan pribadi)
> berbahasa Indonesia untuk mahasiswa. Pendamping resmi `SRS.md`.
>
> Design Read: aplikasi web expense tracker berbasis desktop-first responsif
> untuk mahasiswa Indonesia, dengan bahasa visual bersih, modern, dan ramah,
> dial ENERGY 2 / RHYTHM 2 / MOTION 1.

---

## 1. Ringkasan dan Prinsip Desain Web

**Karakter:** bersih, ramah, tepercaya, dan terstruktur rapi. Keuangan pribadi mahasiswa
sering terasa membosankan atau menegangkan, sehingga UI web dirancang cerah, lega di layar
laptop maupun desktop, tidak dikurung dalam batasan frame ponsel sempit, serta memiliki
navigasi yang intuitif di setiap alur transaksi.

**Prinsip Desain Web:**

1. **Satu warna brand, dua warna semantik.** Biru (`#2491DB`) = identitas dan aksi utama,
   hijau (`#1FB58A` / `#12805F`) = uang masuk, merah (`#EF5B63` / `#D02F3C`) = uang keluar.
2. **Angka adalah bintang.** Saldo dan nominal transaksi selalu tebal, menggunakan angka tabular
   (`font-variant-numeric: tabular-nums`) sehingga perbandingan keuangan mudah dipahami.
3. **Arsitektur Web Desktop-First yang Responsif.** Menggunakan Top Web Navigation Bar (Header)
   yang menyatukan branding, tautan Beranda, Transaksi, Laporan, toggle tema, profil, dan logout.
   Tata letak halaman menggunakan kontainer lebar (`max-w-6xl` hingga `max-w-7xl`) dengan grid desktop
   yang memanfaatkan ruang horizontal layar secara optimal.
4. **Navigasi Kembali (Back Button) yang Wajib dan Jelas.** Setiap tampilan transaksi (riwayat,
   detail transaksi, form catat, form ubah, dan laporan) wajib menyediakan tombol kembali ("Kembali")
   dengan ikon panah kiri agar pengguna web tidak pernah tersesat atau terjebak.
5. **Konsistensi Komponen Transaksi.** Komponen baris transaksi dan kartu metrik yang seragam
   digunakan di Beranda, Riwayat Transaksi, dan Laporan Keuangan. Baris transaksi dapat diklik
   untuk langsung membuka detail transaksi.
6. **Bahasa Indonesia natural**, ringkas, dan bersahabat bagi mahasiswa.

**Dials (alasan satu baris tiap dial, R-31):**

- **ENERGY 2.** Alasan: menyapa lewat saldo dan warna kontras, tapi merupakan utilitas kerja web harian, bukan halaman pemasaran produk.
- **RHYTHM 2.** Alasan: halaman-halaman berbagi komponen transaksi dan kartu yang sama, namun komposisi desktopnya bervariasi (banner ringkasan 3 kolom, grid 2 kolom, dan form kartu web).
- **MOTION 1.** Alasan: aplikasi pencatatan uang harus terasa stabil dan cepat diakses di browser web; animasi hanya untuk feedback klik, transisi menu, dan interaksi form.

---

## 2. Design Tokens

### 2.1 Warna

#### Brand
| Token | Hex | Pemakaian |
|---|---|---|
| `--color-primary` | `#2491DB` | Tombol utama, logo, tab aktif, ikon fokus, tile kategori |
| `--color-primary-dark` | `#0F6BFF` | Hover tombol utama, segmen progress donut |
| `--color-primary-soft` | `#E8F3FC` | Background menu aktif, hover baris transaksi |
| `--color-header` | `#1A76B8` | Gradient banner dashboard, aksen web header |
| `--color-on-header` | `#FFFFFF` | Teks dan ikon di atas background header |

#### Semantik
| Token | Hex | Pemakaian |
|---|---|---|
| `--color-income` | `#1FB58A` | Nominal pemasukan display (`+ Rp 75.000`), badge pemasukan |
| `--color-income-deep` | `#12805F` | Teks pemasukan ukuran normal untuk memenuhi kontras WCAG AA |
| `--color-expense` | `#EF5B63` | Nominal pengeluaran display (`- Rp 100.000`), badge pengeluaran |
| `--color-expense-deep` | `#D02F3C` | Teks pengeluaran ukuran normal untuk memenuhi kontras WCAG AA |
| `--color-danger-arc` | `#EB6B6B` | Busur pengeluaran pada donut chart |

#### Netral
| Token | Hex | Pemakaian |
|---|---|---|
| `--color-surface` | `#FFFFFF` | Kartu putih, modal dialog, background baris transaksi |
| `--color-background` | `#F4F7FA` | Background halaman web (canvas utama) |
| `--color-muted` | `#EBEBEB` | Background kontrol segmented, area chart |
| `--color-divider` | `#E6E9ED` | Garis batas kartu, pemisah baris transaksi, border |
| `--color-ink` | `#1C2A39` | Teks judul utama, isi tabel, nilai nominal |
| `--color-subtle` | `#6B7785` | Tanggal, deskripsi sekunder, placeholder input |
| `--color-on-primary` | `#FFFFFF` | Teks di atas tombol dan tile biru |

#### Palet Chart Kategori (Encoding Data)
| Kategori | Token | Hex |
|---|---|---|
| Makan | `--color-chart-1` | `#2B8FDC` |
| Transportasi | `--color-chart-2` | `#FF5C8A` |
| Belanja | `--color-chart-3` | `#FF9016` |
| Lain-lain | `--color-chart-4` | `#14BF96` |
| Pendidikan / Hiburan | `--color-chart-5` | `#8E6BFF` |
| Kos / Kesehatan | `--color-chart-6` | `#FFC93C` |

#### Mode Gelap (Dark Mode via Cookie, SRS FR-08 & FR-09)
Preferensi tema disimpan menggunakan cookie `theme` (`light` default per SRS P1-13). Mode gelap dikontrol oleh atribut `data-theme="dark"` pada elemen `html` dan wajib memenuhi kontras WCAG AA:

| Token | Terang | Gelap |
|---|---|---|
| surface | `#FFFFFF` | `#182230` |
| background | `#F4F7FA` | `#10161F` |
| ink | `#1C2A39` | `#EDF2F7` |
| subtle | `#6B7785` | `#9AA7B5` |
| divider | `#E6E9ED` | `#2A3542` |
| primary | `#2491DB` | `#5AADE6` |
| primary-soft | `#E8F3FC` | `#1E2E3F` |
| income | `#1FB58A` | `#4BD6A5` |
| expense | `#EF5B63` | `#F0838A` |

### 2.2 Tipografi

**Font Keluarga:** Montserrat (fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`).
Alasan: keterbacaan angka finansial sangat tajam dan proporsional untuk dashboard web mahasiswa.

| Role | Ukuran / Line-height | Weight | Pemakaian |
|---|---|---|---|
| `display` | 28-36px / 36-44px | 700-800 | Saldo utama di dashboard, nominal di detail transaksi |
| `title-lg` | 22-24px / 28-32px | 700 | Judul halaman ("Riwayat Transaksi", "Laporan Keuangan") |
| `title-md` | 16-18px / 22-26px | 600-700 | Judul section kartu ("Transaksi Terakhir", "Pengeluaran Bulan Ini") |
| `amount` | 15-18px / 22-24px | 700 | Nominal transaksi tabular (`+ Rp 75.000` / `- Rp 100.000`) |
| `body` | 14-15px / 20-22px | 500-600 | Nama kategori, teks input form, teks tombol |
| `label` | 12-13px / 18px | 500-600 | Label field form, status badge, label navigasi |
| `caption` | 11-12px / 16px | 400-500 | Tanggal transaksi, timestamp pencatatan, catatan kaki |

**Format Rupiah:**
- Saldo dan kartu ringkasan: menggunakan prefiks `Rp` dan pemisah ribuan titik (contoh: `Rp 1.781.273`).
- Baris transaksi: tanda plus/minus diikuti format rupiah (`+ Rp 75.000` atau `- 100.000`).
- Mengaktifkan `font-variant-numeric: tabular-nums` pada seluruh angka nominal.

### 2.3 Layout Spacing dan Kontainer Web

- **Kontainer Web Utama:** `max-w-6xl` (1152px) atau `max-w-7xl` (1280px) terpusat di tengah layar desktop (`mx-auto`).
- **Padding Halaman:** `px-4 sm:px-6 lg:px-8` secara horizontal dan `py-8` secara vertikal.
- **Grid Jarak (Gaps):**
  - Antar kartu ringkasan keuangan: 20px (`gap-5`).
  - Antar kolom grid desktop: 24-32px (`gap-6` hingga `gap-8`).
  - Antar field dalam form: 16-20px (`space-y-4` hingga `space-y-5`).

---

## 3. Komponen Web Utama

### 3.1 Web Navigation Bar (Header Web)
- Dipasang tetap di bagian atas halaman (`sticky top-0 z-40`).
- Background permukaan dengan efek blur lembut (`bg-surface/95 backdrop-blur-md border-b border-divider`).
- **Sisi Kiri:**
  - Logo DUITku dengan ikon dompet (`Wallet`) dan tautan ke `/dashboard`.
  - Menu navigasi desktop: **Beranda** (`/dashboard`), **Riwayat Transaksi** (`/transactions`), dan **Laporan Keuangan** (`/reports`). Item aktif ditandai dengan background `primary-soft` dan teks `primary`.
- **Sisi Kanan:**
  - Tombol aksi cepat: `+ Catat Transaksi` (`/transactions/new`).
  - `ThemeToggle` (pengubah tema terang/gelap).
  - Avatar inisial pengguna dengan nama sapaan.
  - Tombol `LogoutButton` ("Keluar").
- **Dukungan Mobile / Tablet:** Tombol toggle hamburger menu yang membuka panel navigasi ketika dibuka di layar kecil tanpa horizontal overflow.

### 3.2 Tombol Navigasi Kembali (Back Button)
- **Komponen Kritis:** Setiap subhalaman transaksi dan laporan menyediakan tombol navigasi kembali di bagian atas konten.
- **Tampilan:**
  - Ikon panah kiri (`ArrowLeft`), teks jelas ("Kembali ke Beranda", "Kembali ke Riwayat Transaksi", atau "Kembali ke Detail").
  - Target sentuh/klik yang lega dengan efek hover dan focus outline yang jelas.
  - Breadcrumb pendukung untuk memudahkan navigasi hierarkis (misal: `Beranda / Transaksi / Detail`).

### 3.3 Kartu Ringkasan Metrik Keuangan (Metric Cards)
- Tiga kartu sejajar di desktop (`grid grid-cols-1 md:grid-cols-3 gap-5`):
  1. **Saldo Saat Ini**: nominal saldo bersih (`balance`), ikon dompet, keterangan status.
  2. **Total Pemasukan**: nominal pemasukan akumulatif (`income`), ikon `TrendingUp`, warna hijau.
  3. **Total Pengeluaran**: nominal pengeluaran akumulatif (`expense`), ikon `TrendingDown`, warna merah.
- Memiliki efek elevasi ringan dan hover shadow yang halus.

### 3.4 Baris Transaksi Web (Transaction Row)
- Komponen baris yang interaktif: seluruh baris dapat diklik (dibungkus `Link` ke `/transactions/[id]`).
- Dilengkapi ikon kategori Lucide dalam tile berwarna biru berukuran 36-40px.
- Menampilkan nama kategori tebal, catatan deskripsi, tanggal transaksi terformat, dan nominal uang dengan warna semantik sesuai jenis transaksi.
- Memberikan feedback visual saat kursor diarahkan (hover transition).

### 3.5 Filter Chips Jenis Transaksi
- Pilihan filter tab: **Semua**, **Pemasukan**, **Pengeluaran** (SRS FR-17).
- Tab aktif menggunakan background biru brand dengan teks putih (`bg-primary text-white`).
- Tab tidak aktif menggunakan border halus dengan teks netral.

### 3.6 Form Transaksi Web
- Layout form kartu terstruktur (`max-w-2xl mx-auto rounded-xl border border-divider bg-surface p-6 sm:p-8`).
- Segmented/radio card untuk memilih jenis: Pemasukan atau Pengeluaran.
- Input nominal numerik dengan prefiks `Rp`, penolakan otomatis angka nol atau negatif (SRS P2-03).
- Datalist saran kategori (Makan, Transportasi, Kos, Belanja, Hiburan, dll.).
- Textarea deskripsi transaksi opsional.
- Date picker tanggal transaksi.
- Tombol aksi form: Batal (membatalkan ke halaman sebelumnya) dan Simpan Transaksi.

---

## 4. Struktur Halaman Web dan Integrasi SRS

### 4.1 Autentikasi: `/login` dan `/register` (Modul A)
- Layout web terpusat di tengah layar (`min-h-screen flex items-center justify-center`).
- Header branding DUITku dan toggle tema di pojok atas.
- Kartu form rapi dengan validasi pesan error yang aman tanpa membocorkan stack trace (SRS P1-14).

### 4.2 Beranda: `/dashboard` (Modul E & F)
1. **Web Navigation Bar** (Header utama).
2. **Banner Sapaan:** ucapan selamat datang personal ("Halo, [Nama]!"), ringkasan singkat, dan tombol aksi "+ Catat Transaksi" serta "Riwayat".
3. **Kartu Metrik 3 Kolom:** Saldo, Total Pemasukan, Total Pengeluaran (SRS P3-02, P3-03, P3-04).
4. **Grid Konten Desktop 2 Kolom:**
   - **Kolom Kiri (2/3 lebar):** Kartu "Transaksi Terakhir" dengan daftar transaksi terbaru yang dapat diklik ke detail, serta link "Lihat semua riwayat". Jika kosong, menampilkan zero state dengan tombol tambah (SRS P3-05, P3-06).
   - **Kolom Kanan (1/3 lebar):** Kartu "Pengeluaran Bulan Ini" (distribusi persentase per kategori) dan "Aksi Cepat" (pemasukan cepat, pengeluaran cepat, analisis laporan).

### 4.3 Riwayat Transaksi: `/transactions` (Modul D)
1. **Web Navigation Bar**.
2. **Tombol Kembali:** `← Kembali ke Beranda`.
3. **Header Halaman:** Judul "Riwayat Transaksi", deskripsi, dan tombol aksi utama "+ Catat Transaksi".
4. **Baris Filter:** Filter chips (Semua, Pemasukan, Pengeluaran) dan indikator jumlah catatan.
5. **Daftar Transaksi Web:** Setiap transaksi menampilkan ikon kategori, nama, deskripsi, tanggal, nominal, serta tombol aksi baris: **Detail**, **Ubah**, dan **Hapus** (dengan dialog konfirmasi).
6. **Empty State:** Muncul jika filter atau data belum memiliki catatan transaksi (SRS P2-11).

### 4.4 Detail Transaksi: `/transactions/[id]` (Modul C)
1. **Web Navigation Bar**.
2. **Navigasi Kembali & Breadcrumb:** Tombol `← Kembali ke Riwayat Transaksi` dan breadcrumb `Beranda / Transaksi / Detail`.
3. **Kartu Detail Transaksi:**
   - Ikon kategori besar dan status badge jenis transaksi.
   - Nominal transaksi berukuran display dengan warna semantik.
   - Deskripsi lengkap catatan keuangan.
   - Informasi metadata tanggal transaksi dan waktu pencatatan.
   - Tombol aksi: "Ubah Transaksi" dan "Hapus Transaksi" (dialog modal yang dapat ditutup dengan tombol Batal atau tombol Escape keyboard).

### 4.5 Catat & Ubah Transaksi: `/transactions/new` dan `/transactions/[id]/edit` (Modul C)
1. **Web Navigation Bar**.
2. **Tombol Kembali:** `← Kembali ke Riwayat Transaksi` (pada form baru) atau `← Kembali ke Detail Transaksi` (pada form ubah).
3. **Kartu Form Transaksi Web:** Field lengkap dengan validasi visual di bawah input yang salah.

### 4.6 Laporan Keuangan: `/reports` (Modul E & F)
1. **Web Navigation Bar**.
2. **Tombol Kembali:** `← Kembali ke Beranda`.
3. **Header Kontrol:** Judul laporan, pemilih bulan (bulan sebelumnya, nama bulan, bulan berikutnya), dan switcher Pemasukan/Pengeluaran.
4. **Banner Ringkasan Bulanan:** Total nominal dan frekuensi transaksi pada bulan yang dipilih.
5. **Grid Desktop 2 Kolom:**
   - **Kolom Kiri:** Visualisasi SVG Pie Chart yang proporsional, dilengkapi legenda kategori dengan nominal rupiah dan persentase pangsa pengeluaran/pemasukan. Dilengkapi tabel alternatif untuk screen reader (aksesibilitas).
   - **Kolom Kanan:** Daftar transaksi yang terjadi pada bulan tersebut dengan link detail.

---

## 5. Aksesibilitas dan Standar Antislop

- **Kontras Warna (WCAG AA):** Teks normal memiliki rasio kontras minimal 4.5:1 terhadap background. Teks kecil pada pemasukan menggunakan `--color-income-deep` (`#12805F`) dan pada pengeluaran menggunakan `--color-expense-deep` (`#D02F3C`).
- **Navigasi Keyboard:** Seluruh tautan, tombol, input, dan aksi dapat diakses menggunakan tombol `Tab` dan diaktifkan dengan `Enter`/`Space`. Dialog modal konfirmasi hapus dapat ditutup dengan tombol `Escape`.
- **Indikator Fokus:** Indikator fokus yang jelas (`outline-primary`, `outline-offset-2`) tersedia pada semua elemen interaktif.
- **Bukan Hanya Warna:** Perbedaan pemasukan dan pengeluaran tidak hanya mengandalkan warna hijau/merah, melainkan selalu disertai simbol penanda (`+` atau `-`), ikon arah (`TrendingUp` atau `TrendingDown`), dan teks badge yang eksplisit.
- **Responsif Tanpa Overflow:** Tampilan web dirancang responsif, mengalir rapi dari resolusi desktop besar (1440px+), laptop (1024px-1366px), tablet (768px), hingga perangkat mobile tanpa terjadi pemotongan konten horizontal yang rusak (R-03).
