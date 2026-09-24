# DESIGN.md — DUITku

> Design system untuk DUITku, aplikasi pencatat keuangan pribadi berbahasa
> Indonesia untuk mahasiswa. Pendamping `SRS.md`.
> Sumber direction: 3 layar referensi milik pemilik (Beranda, Transaksi
> Terakhir, Laporan Keuangan). Nilai warna dan ukuran diestimasi dari gambar
> referensi. Sesuaikan bila ada file Figma aslinya.

> Design Read: aplikasi kas harian mobile-first untuk mahasiswa Indonesia,
> dengan bahasa visual bersih dan ramah, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## 1. Ringkasan dan Prinsip Desain

**Karakter:** bersih, ramah, tepercaya, dan ringan. Keuangan pribadi sering
terasa membosankan atau menegangkan, jadi UI dibuat cerah, banyak ruang
putih, dan bahasanya santai (contoh: "Hi Kamu", "Uang kamu tersisa").

**Prinsip:**

1. **Satu warna brand, dua warna semantik.** Biru = identitas dan aksi,
   hijau = uang masuk, merah = uang keluar. Jangan menambah warna semantik
   lain.
2. **Angka adalah bintang.** Saldo dan nominal selalu tebal dan paling
   menonjol di layarnya.
3. **Header berwarna plus sheet putih.** Konten utama berada di panel putih
   bersudut membulat yang "naik" dari header biru.
4. **Konsistensi baris transaksi.** Komponen yang sama dipakai di Beranda,
   Daftar Transaksi, dan Laporan.
5. **Bahasa Indonesia natural**, singkat, dan tidak menggurui.

**Dials (alasan satu baris tiap dial, R-31):**

- **ENERGY 2.** Alasan: menyapa lewat saldo dan warna, tapi ini utilitas
  harian, bukan situs marketing.
- **RHYTHM 2.** Alasan: tiga layar berbagi komponen baris transaksi yang
  sama, tapi komposisinya beda (header plus sheet, list polos, chart plus
  sheet).
- **MOTION 1.** Alasan: aplikasi uang harus terasa stabil, gerak hanya
  feedback tap dan transisi kecil (detil di §6).

## 2. Design Tokens

### 2.1 Warna

#### Brand
| Token | Hex | Pemakaian |
|---|---|---|
| `--color-primary` | `#2491DB` | Header, tombol utama, ikon aktif, chip aktif, tile ikon |
| `--color-primary-dark` | `#0F6BFF` | Segmen progress donut (anggaran terpakai atau sisa) |
| `--color-primary-soft` | `#E8F3FC` | Hover atau pressed, background chip tidak aktif |

#### Semantik
| Token | Hex | Pemakaian |
|---|---|---|
| `--color-income` | `#1FB58A` | Nominal pemasukan (`+ 75.000`), ikon panah naik |
| `--color-expense` | `#EF5B63` | Nominal pengeluaran (`- 100.000`), ikon panah turun |
| `--color-danger-arc` | `#EB6B6B` | Segmen donut anggaran yang terpakai (keluarga expense) |

#### Netral
| Token | Hex | Pemakaian |
|---|---|---|
| `--color-surface` | `#FFFFFF` | Kartu, sheet, bottom nav |
| `--color-bg-muted` | `#EBEBEB` | Area chart pada Laporan Keuangan |
| `--color-divider` | `#E6E9ED` | Garis pemisah antar transaksi |
| `--color-text-primary` | `#1C2A39` | Judul, nama transaksi |
| `--color-text-secondary` | `#6B7785` | Tanggal, label sekunder, "Lihat semua" |
| `--color-text-on-primary` | `#FFFFFF` | Teks di atas biru |

#### Palet chart kategori
| Kategori | Token | Hex |
|---|---|---|
| Makan | `--chart-1` | `#2B8FDC` |
| Transportasi | `--chart-2` | `#FF5C8A` |
| Belanja | `--chart-3` | `#FF9016` |
| Lain-lain | `--chart-4` | `#14BF96` |

> Kategori baru: gunakan palet turunan (ungu `#8E6BFF`, kuning `#FFC93C`)
> dan pertahankan urutan agar warna kategori konsisten di seluruh app.

> Catatan palet (R-29): palet chrome dibatasi pada biru brand plus hijau
> dan merah semantik. Warna chart di atas adalah encoding data (bukan chrome
> UI): hanya dipakai di irisan chart dan legend, tidak pernah untuk tombol,
> teks aksi, atau dekorasi, dan urutannya tetap di semua layar.

#### Background halaman presentasi
Gradient radial biru muda: `radial-gradient(circle at 30% 60%, #A9D3F3 0%,
#4FA6E4 100%)`. Hanya untuk mockup atau backdrop presentasi, tidak pernah di
dalam app (R-01, tujuan tertulis: backdrop presentasi).

#### Mode gelap (wajib karena SRS butuh preferensi tema via cookie)

SRS FR-08 dan FR-09 mewajibkan minimal satu preferensi via cookie, dan
pilihan pemilik adalah toggle terang atau gelap. Nilai awal di bawah ini
wajib diverifikasi dengan contrast checker saat implementasi (target WCAG AA,
bukan klaim lolos):

| Token | Terang | Gelap |
|---|---|---|
| surface | `#FFFFFF` | `#182230` |
| background | `#F4F7FA` | `#10161F` |
| text-primary | `#1C2A39` | `#EDF2F7` |
| text-secondary | `#6B7785` | `#9AA7B5` |
| divider | `#E6E9ED` | `#2A3542` |
| primary | `#2491DB` | `#5AADE6` |
| income | `#1FB58A` | `#4BD6A5` |
| expense | `#EF5B63` | `#F0838A` |

Cookie `theme` (`light` default, SRS P1-13) mengendalikan atribut
`data-theme` pada `html`, diterapkan saat aplikasi dibuka kembali. Kedua mode
wajib berfungsi penuh (R-34).

### 2.2 Tipografi

**Font:** Montserrat (fallback: `system-ui, -apple-system, "Segoe UI",
sans-serif`). Alasan: sesuai layar referensi pemilik, dan bentuk angkanya
jelas untuk nominal uang (R-06). Muat via `next/font/google`, bukan link
eksternal mentah.

| Role | Ukuran / Line-height | Weight | Contoh |
|---|---|---|---|
| `display` | 20 / 28 | 700 | Saldo `Rp 1.781.273` |
| `title-lg` | 18 / 24 | 700 | "Transaksi Terakhir", "Laporan Keuangan" |
| `title-md` | 16 / 22 | 600 | "Anggaran Pengeluaran", "Transaksi" |
| `amount` | 15 / 20 | 700 | `- 100.000` di baris transaksi |
| `body` | 14 / 20 | 600 | Nama transaksi ("Nonton Endgame") |
| `label` | 13 / 18 | 500 | "Pemasukan", "Kategori", legend chart |
| `link` | 13 / 18 | 500 | "Lihat semua" |
| `caption` | 11 / 14 | 400 | Tanggal transaksi (`12 Januari 2020`) |

**Aturan angka (format, bukan klaim data):**
- Format Rupiah Indonesia: titik sebagai pemisah ribuan (`1.781.273`),
  prefiks `Rp` plus spasi untuk nominal besar. Contoh di dokumen ini adalah
  contoh format, bukan data pengguna (R-17).
- Di daftar transaksi: tanda plus spasi plus angka (`- 100.000`,
  `+ 75.000`), tanpa "Rp".
- Aktifkan `font-variant-numeric: tabular-nums` agar angka sejajar.
  Alasan: kolom nominal mudah dibandingkan (keterbacaan, bukan estetika
  terminal).

> Di referensi, caption tanggal sangat kecil (sekitar 8px). Untuk produksi,
> gunakan **minimal 11px**.

### 2.3 Spacing

Skala basis **4px**.

| Token | Nilai |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |

- Padding horizontal layar: **18-20px**
- Jarak antar baris transaksi: **16px** di atas dan bawah divider
- Jarak antar kartu horizontal: **8-10px**

### 2.4 Radius

| Token | Nilai | Pemakaian |
|---|---|---|
| `--radius-xs` | 4px | Tile ikon transaksi, chip kategori, tombol tanggal |
| `--radius-sm` | 6px | Kartu Pemasukan atau Pengeluaran, kartu anggaran |
| `--radius-xl` | 32px | Sudut atas sheet putih |
| `--radius-full` | 999px | FAB tombol tambah, avatar |

Alasan variasi: radius kecil untuk komponen rapat khas aplikasi, radius
besar hanya untuk gesture "sheet naik" yang menjadi motif identitas (R-11).

### 2.5 Elevasi

Desain sangat datar, hampir tidak ada shadow.

| Token | Nilai | Pemakaian |
|---|---|---|
| `--shadow-nav` | `0 -2px 8px rgba(0,0,0,0.06)` | Bottom navigation |
| `--shadow-card` | `0 1px 2px rgba(0,0,0,0.04)` | Kartu di atas header biru (opsional) |

Alasan: satu-satunya elevasi menandai nav yang melayang dan kartu yang
menempel di header, daftar transaksi tetap flat memakai divider (R-12).

## 3. Komponen

### 3.1 Header Biru
- Background `--color-primary`, teks putih.
- Berisi status bar, sapaan, dan konten ringkasan.
- Ujung bawah tertutup oleh sheet putih (`border-radius: 32px 32px 0 0`)
  yang overlap sekitar 24px. Alasan: gesture "sheet naik" adalah motif
  identitas yang diulang di semua layar utama.

### 3.2 Kartu Ringkasan (Pemasukan / Pengeluaran)
- Dua kartu berdampingan, lebar sama (`flex: 1`), gap 8px.
- Background putih, radius 6px, padding 12-14px.
- Baris atas: label (`label`) plus ikon panah (naik hijau untuk pemasukan,
  turun merah untuk pengeluaran). Alasan panah: indikator semantik arah uang,
  bukan dekorasi tombol (R-08).
- Baris bawah: nominal `Rp x.xxx.xxx` (`title-md`, 700) dengan warna
  semantik.

### 3.3 Kartu Anggaran (Donut)
- Kartu putih persegi sekitar 92x88px, radius 6px.
- Donut chart tebal 8-10px: busur biru (`--color-primary-dark`) = sisa,
  busur merah (`--color-danger-arc`) = terpakai.
- Ikon kategori di tengah donut, warna biru.
- Ditaruh di **scroll horizontal** dengan snap; kartu terakhir sengaja
  terpotong sebagai petunjuk bisa digeser.

### 3.4 Baris Transaksi (Transaction Item)
```
[ Tile ikon 36x36 ]  Judul transaksi (body)              - 100.000 (amount, merah)
                     12 Januari 2020 (caption)
--------------------------------------------------------------------
```
- Tile ikon: background `--color-primary`, ikon putih 18px, radius 4px.
- Kolom kiri rata kiri; nominal rata kanan, sejajar dengan judul.
- Divider 1px `--color-divider`, tidak menyentuh tepi layar (mengikuti
  padding horizontal).
- Nominal: merah dengan prefiks `-`, hijau dengan prefiks `+`.
- Seluruh baris bisa di-tap untuk membuka detail transaksi (tinggi minimal
  64px agar area sentuh lega).

### 3.5 Header Section
- Kiri: judul (`title-md` atau `title-lg`), kanan: tautan "Lihat semua"
  (`link`, `--color-text-secondary`).

### 3.6 Chip Kategori (Filter)
- Scroll horizontal, tinggi 26px (tambah hit-area padding hingga 44px,
  lihat §8), padding horizontal 14px, radius 4px.
- **Aktif:** background biru, teks putih, weight 600.
- **Tidak aktif:** background putih, border 1px biru, teks biru.
  Alasan: status fungsi filter yang nyata, bukan badge dekoratif (R-09).
- Chip terakhir terpotong di tepi layar untuk menandakan bisa digeser.

### 3.7 Date Picker Trigger
- Tombol outline: ikon kalender plus label bulan (`Januari 2020`), border
  1px biru, radius 4px, tinggi 26-28px (tambah hit-area hingga 44px).
- Di header biru (Laporan): versi terbalik (background biru lebih terang,
  teks putih).
- Tap membuka month picker.

### 3.8 Segmented Control (Pemasukan | Pengeluaran)
- Lebar penuh, tinggi 44px, di dalam header biru, border putih 1px.
- Segmen aktif: background putih, teks biru.
- Segmen tidak aktif: transparan, teks putih.
- Mengganti data chart dan daftar transaksi di bawahnya.

### 3.9 Pie Chart + Legend
- Pie chart (bukan donut) di atas background `--color-bg-muted`, diameter
  sekitar 150px.
- Legend di kanan: bullet 16px bulat plus nama kategori (`label`, 600),
  jarak vertikal 14px. Legend memuat nominal atau persentase agar tidak
  bergantung pada warna saja (§8).
- Urutan legend = urutan irisan searah jarum jam dari atas.

### 3.10 Bottom Navigation
- Tinggi 56px plus safe area, background putih, `--shadow-nav`.
- Slot: **Beranda, Transaksi, (+) Tambah, Laporan**. Hanya route yang ada
  yang tampil (R-24). "Notifikasi" dan "Profil" dari referensi di luar scope
  SRS sehingga tidak dirender sampai halamannya benar-benar ada.
- Ikon outline 24px; **aktif = biru terisi**, tidak aktif = biru outline
  atau abu.
- Tombol tengah (+) berupa **FAB bulat 32-36px**, biru, ikon `+` putih;
  aksi utama "Tambah transaksi".
- Tidak ada label teks (ikon saja), jadi wajib punya `aria-label`.

### 3.11 Avatar dan Sapaan
- Avatar bulat 52px di kanan atas header. Sampai ada foto profil dari
  pengguna, pakai placeholder inisial nama, bukan foto asumsi (R-23).
- Sapaan: `Hi Kamu` (label putih), lalu `Uang kamu tersisa` (caption), lalu
  saldo (`display`).

## 4. Layout Layar dan Peta ke SRS

Frame referensi: sekitar 328x710 (rasio sekitar 9:19.5). Bangun responsif
dengan lebar 360-412dp sebagai target utama, tanpa overflow horizontal
(R-03).

### 4.1 Auth: `/login` dan `/register` (Programmer 1, Modul A)

Tidak ada di referensi, jadi didefinisikan konsisten dengan sistem: kartu
terpusat satu kolom maksimal 400px di atas background netral, tombol utama
biru berlabel "Masuk" dan "Buat akun" (bukan CTA generik, R-15). Error login
generik "Email atau sandi salah" agar tidak membocorkan akun yang terdaftar
(SRS P1-14).

### 4.2 Beranda = `/dashboard` (Programmer 3, Modul E)
1. Status bar
2. Header biru: sapaan plus avatar plus saldo (focal point layar)
3. Dua kartu Pemasukan dan Pengeluaran (SRS P3-02, P3-03)
4. Section **Anggaran Pengeluaran** mengarah ke carousel kartu donut
   (pengayaan di luar SRS minimum, datanya tetap dari tabel `transactions`)
5. Sheet putih: **Transaksi Terakhir** plus "Lihat semua" ke 3-4 baris
   terbaru (SRS P3-05)
6. Bottom nav (tab Beranda aktif)
7. Zero state: angka 0 plus ajakan "Catat transaksi pertamamu" (SRS P3-06)

### 4.3 Transaksi Terakhir = `/transactions` (Programmer 2, Modul D)
1. Judul halaman (background putih, tanpa header biru)
2. Baris filter: label **Kategori** plus date picker (kanan)
3. Chip kategori horizontal (SRS P2-10, FR-17)
4. Daftar transaksi terbaru ke terlama (SRS P2-09, FR-16), dikelompokkan per
   tanggal bila memungkinkan, tiap baris punya aksi edit dan hapus
   (SRS P2-12)
5. Empty state: "Belum ada transaksi bulan ini" plus tombol "Tambah
   transaksi" (SRS P2-11)
6. Bottom nav

### 4.4 Laporan Keuangan = `/reports` (pengayaan, di luar SRS minimum)
1. Header biru: judul plus segmented control Pemasukan atau Pengeluaran
2. Date picker bulan (di perbatasan header dan area abu-abu)
3. Area abu-abu: pie chart plus legend
4. Sheet putih: **Transaksi** plus "Lihat semua"
5. Bottom nav (tab Laporan aktif)

> Layar ini tidak dituntut SRS, tapi diizinkan sebagai pengayaan karena
> memakai data dan komponen yang sama. Kalau scope harus ketat ke SRS,
> layar ini yang pertama dipotong.

### 4.5 Form tambah dan edit (Programmer 2, Modul C)
- Bottom sheet "Tambah transaksi" naik dari bawah saat FAB di-tap.
- Pilihan tipe Pemasukan atau Pengeluaran, nominal (tolak nol atau negatif,
  SRS P2-03), kategori, deskripsi, tanggal.
- Validasi tampil di bawah field yang salah, bukan alert generik.
- Hapus selalu pakai dialog konfirmasi yang bisa ditutup dengan Escape.

## 5. Ikonografi

- Gaya: **outline, stroke 1.5-2px, sudut membulat**, ukuran 18px (dalam tile)
  atau 24px (nav).
- Set: Lucide. Alasan: gurat outline-nya cocok dengan stroke referensi, dan
  setiap ikon dipilih dari pemetaan kategori di bawah (relevansi tertulis,
  R-04).
- Pemetaan kategori ke ikon:

| Kategori | Ikon |
|---|---|
| Hiburan | film / clapperboard |
| Kopi / Ngopi | cangkir kopi |
| Hutang | uang / banknote |
| Makan | garpu dan sendok |
| Transportasi | mobil |
| Belanja pasar | keranjang / pasar |
| Pakaian | kaos |
| Cukur / perawatan | gunting dan sisir |

## 6. Interaksi dan Motion

| Interaksi | Perilaku |
|---|---|
| Tap baris transaksi | Ripple `--color-primary-soft`, buka detail |
| Tap chip kategori | Filter daftar, chip aktif berpindah (150ms ease-out) |
| Ganti Pemasukan atau Pengeluaran | Slide indikator plus crossfade chart (200ms) |
| Pie chart muncul | Irisan tumbuh searah jarum jam (400ms ease-out) |
| Donut anggaran | Busur terisi dari 0 ke nilai akhir (500ms) |
| Tap FAB (+) | Bottom sheet "Tambah transaksi" naik dari bawah |
| Pull to refresh | Indikator putih di atas header biru |

Alasan motion: setiap animasi memberi feedback aksi atau menjelaskan
perubahan data, tidak ada animasi hiasan halaman (R-19, MOTION 1).

Hormati `prefers-reduced-motion`: matikan animasi chart dan slide.

## 7. State dan Konten Khusus

- **Kosong:** ilustrasi sederhana plus "Belum ada transaksi bulan ini" plus
  tombol "Tambah transaksi".
- **Loading:** skeleton abu muda pada baris transaksi dan kartu;
  pertahankan header biru.
- **Error:** banner merah muda di atas daftar dengan tombol "Coba lagi".
  Pesan error tidak membocorkan stack trace, query, atau secret
  (SRS NFR-04).
- **Anggaran melebihi batas:** busur donut penuh merah plus badge kecil
  "Melebihi" (badge fungsional, R-09).
- **Saldo negatif:** tampilkan dengan warna `--color-expense` dan awalan
  `-`.

## 8. Aksesibilitas

- **Kontras:** teks putih di biru `#2491DB` sekitar 3.4:1 (hanya lolos untuk
  teks besar atau bold). Untuk teks kecil di header, gunakan biru lebih
  gelap (`#1B7CC0`, sekitar 4.6:1) atau naikkan weight atau ukuran. Merah
  `#EF5B63` di atas putih sekitar 3.5:1; pakai `#D93F4A` untuk teks kecil
  bila perlu lolos AA. Semua pasangan wajib dicek ulang dengan contrast
  checker (R-25).
- **Jangan hanya mengandalkan warna:** nominal sudah punya tanda `+` atau
  `-`; pada chart, tambahkan persentase atau nominal di legend agar tidak
  bergantung pada warna irisan saja.
- Target sentuh minimal **44x44px** (chip dan date picker di referensi
  terlalu pendek, tambahkan hit-area padding).
- Ikon nav tanpa label wajib memiliki `aria-label`.
- Sediakan tabel data alternatif untuk pie chart (screen reader).
- Semua interaktif bisa dijangkau keyboard, dialog ditutup Escape, indikator
  fokus selalu terlihat (R-32).

## 9. Implementasi

Proyek ini memakai Tailwind CSS v4 (token via `@theme` di CSS, bukan
`tailwind.config.js`) plus `next/font`. Token di bawah ini yang dipakai saat
implementasi.

### CSS Variables dan `@theme` (Tailwind v4, di `app/globals.css`)
```css
:root {
  /* Brand */
  --color-primary: #2491DB;
  --color-primary-dark: #0F6BFF;
  --color-primary-soft: #E8F3FC;

  /* Semantic */
  --color-income: #1FB58A;
  --color-expense: #EF5B63;
  --color-danger-arc: #EB6B6B;

  /* Neutral */
  --color-surface: #FFFFFF;
  --color-bg-muted: #EBEBEB;
  --color-divider: #E6E9ED;
  --color-text-primary: #1C2A39;
  --color-text-secondary: #6B7785;
  --color-text-on-primary: #FFFFFF;

  /* Chart */
  --chart-1: #2B8FDC;
  --chart-2: #FF5C8A;
  --chart-3: #FF9016;
  --chart-4: #14BF96;

  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-xl: 32px;
  --radius-full: 999px;

  /* Font */
  --font-sans: "Montserrat", system-ui, -apple-system, "Segoe UI", sans-serif;
}

@theme inline {
  --color-primary: var(--color-primary);
  --color-income: var(--color-income);
  --color-expense: var(--color-expense);
  --font-sans: var(--font-sans);
}
```

### Font Montserrat (`app/layout.tsx`)
```tsx
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });
```

### Helper Format Rupiah
```js
const rupiah = (n, { prefix = true, sign = false } = {}) => {
  const abs = Math.abs(n).toLocaleString("id-ID");
  const s = sign ? (n < 0 ? "- " : "+ ") : "";
  return `${s}${prefix ? "Rp " : ""}${abs}`;
};
// rupiah(1781273) -> "Rp 1.781.273"
// rupiah(-100000, { prefix: false, sign: true }) -> "- 100.000"
```

## 10. Do dan Don't

| Do | Don't |
|---|---|
| Pakai biru hanya untuk identitas dan aksi | Pakai biru untuk menandai uang masuk atau keluar |
| Tampilkan tanda `+` atau `-` di setiap nominal | Membedakan pemasukan atau pengeluaran hanya dengan warna |
| Pertahankan urutan dan warna kategori di semua chart | Mengacak warna kategori antar layar |
| Biarkan elemen terakhir carousel terpotong | Menyembunyikan scroll horizontal tanpa petunjuk |
| Gunakan ruang putih lega di dalam sheet | Menumpuk shadow tebal dan gradient di dalam app |

## 11. Resolusi konflik direction vs antislop (R-37)

Direction pemilik di atas, jadi keputusan pemilik menang dan dicatat satu
baris tiap poin:

1. Gradient radial (§2.1): R-01, dipertahankan hanya untuk backdrop
   presentasi, tidak pernah di dalam app.
2. Palet chart 4-6 warna (§2.1): R-29, dikecualikan sebagai encoding data
   dengan urutan tetap, tidak dipakai sebagai chrome UI.
3. Set ikon Lucide (§5): R-04, dipilih karena stroke-nya cocok dengan
   referensi, tiap ikon wajib relevan per tabel pemetaan.
4. Nav 5 slot referensi (§3.10): R-24, Notifikasi dan Profil tidak dirender
   sampai halamannya ada.
5. Caption kecil dan chip pendek di referensi (§2.2, §8): R-03 dan R-25,
   dinaikkan ke minimal 11px dan hit-area 44px.
6. Contoh angka rupiah (§2.2, §9): R-17, hanya contoh format, bukan data
   pengguna.
7. Avatar (§3.11): R-23, placeholder inisial sampai ada foto asli.

## 12. Peta ke branch

| Area | Branch | Catatan |
|---|---|---|
| Auth | `feature/auth-session` | §4.1 dan cookie tema §2.1 |
| Transaksi | `feature/transactions` | §4.3, §4.5, baris transaksi §3.4 |
| Dashboard plus security | `feature/dashboard-security` | §4.2, states §7, verifikasi kontras §8 |
| Laporan (pengayaan) | `feature/dashboard-security` | §4.4, chart §3.9, opsional bila scope ketat |
