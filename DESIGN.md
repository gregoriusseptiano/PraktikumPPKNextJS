# DESIGN.md — DUITku

Arah visual untuk aplikasi expense tracker mahasiswa. Pendamping `SRS.md`.
Dokumen ini adalah direction (data identitas, palet, tipografi, dial), bukan
hasil akhir. Setiap keputusan di bawah punya alasan satu baris (R-31).

> Design Read: aplikasi kas harian untuk mahasiswa Indonesia, dengan bahasa
> visual buku kas kampus yang rapi, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## 1. Dials

- **ENERGY 2 (balanced).** Alasan: menyapa lewat angka saldo yang jelas,
  tapi ini aplikasi utilitas, bukan situs marketing.
- **RHYTHM 2 (konsisten dengan variasi).** Alasan: tiap halaman punya
  komposisi sendiri (auth terpusat, dashboard hero plus ringkasan plus list,
  riwayat berupa tabel), bukan template yang diulang.
- **MOTION 1 (calm).** Alasan: aplikasi uang harus terasa stabil, gerak hanya
  hover dan transisi status, tanpa scroll choreography.

## 2. Identitas dan motif

- **Konsep: buku kas kampus.** Hangat, jujur, tidak seperti dashboard bank.
- **Motif identitas: garis ledger.** Daftar transaksi memakai garis pemisah
  horizontal tipis plus angka rata kanan dengan tabular-nums. Alasan: motif
  ini diulang di dashboard dan riwayat sehingga terasa milik DUITku.
- **Logo: teks "DUITku"** sebagai placeholder sampai ada instruksi logo
  final (R-23). Jangan generate logo gambar atas asumsi sendiri.

## 3. Palet

Inti (2 sampai 3 warna) plus 1 aksen. Netral tidak dihitung (R-29).

| Token        | Nilai     | Pakai untuk                          |
| ------------ | --------- | ------------------------------------ |
| `--paper`    | `#FAF6EE` | Background mode terang               |
| `--ink`      | `#1C1B17` | Teks utama                           |
| `--duit`     | `#1E6B45` | Aksi utama dan angka pemasukan       |
| `--amber`    | `#B45309` | Aksen: satu penekanan per layar      |
| `--expense`  | `#B3261E` | Angka pengeluaran (semantik, bukan inti) |

Mode gelap (wajib berfungsi penuh, R-34):

| Token        | Nilai     | Pakai untuk                          |
| ------------ | --------- | ------------------------------------ |
| `--paper`    | `#141311` | Background mode gelap                |
| `--ink`      | `#F2EFE6` | Teks utama                           |
| `--duit`     | `#6FCF97` | Aksi utama dan angka pemasukan       |
| `--amber`    | `#F0A63C` | Aksen                                |
| `--expense`  | `#E57373` | Angka pengeluaran                    |

Alasan tiap pilihan:

- Kertas hangat, bukan putih steril. Alasan: memberi rasa buku kas dan
  membedakan dari template admin generik.
- Hijau sebagai satu-satunya warna aksi utama. Alasan: asosiasi uang dan
  konsistensi, semua tombol utama selalu hijau.
- Amber hanya untuk satu momen penekanan per layar (angka saldo atau filter
  aktif). Alasan: aksen yang dipakai di mana-mana berhenti jadi aksen.
- Merah hanya untuk angka dan status pengeluaran. Alasan: makna semantik,
  bukan dekorasi.

**Kontras (R-25):** pasangan teks yang direncanakan adalah tinta di atas
kertas, putih di atas hijau duit, dan merah expense di atas kertas. Semua
pasangan wajib diverifikasi dengan contrast checker saat implementasi dengan
target WCAG AA (4.5:1 teks normal, 3:1 teks besar). Nilai heks di atas adalah
titik awal, bukan klaim lolos.

## 4. Tipografi

- **Geist Sans untuk semua teks.** Alasan: sudah dipakai di
  `app/layout.tsx`, jadi tanpa payload font tambahan.
- **Angka uang selalu `tabular-nums` dan rata kanan.** Alasan: kolom nominal
  sejajar sehingga mudah dibandingkan, ini keterbacaan, bukan estetika
  terminal (R-06).
- Heading semibold tanpa uppercase tracking lebar. Alasan: tegas tapi tetap
  santai khas aplikasi kampus.
- Skala: hero saldo 40px semibold (focal point tiap dashboard), judul seksi
  20px, body 15 sampai 16px.

## 5. Radius, elevasi, bayangan

- Kartu 10px, input dan tombol 8px. Alasan: rapi dan konsisten, bukan semua
  elemen pill (R-11). Pengecualian: chip filter memang berbentuk chip karena
  fungsinya sebagai pilihan.
- Bayangan satu level hanya untuk kartu ringkasan. Alasan: menandai elevasi
  kartu terpenting, daftar transaksi tetap flat memakai garis ledger (R-12).
- Tanpa glassmorphism dan tanpa glow (R-10, R-13).

## 6. Halaman

### 6.1 `/login` dan `/register` (Programmer 1, Modul A)

- Kartu terpusat di atas background kertas, satu kolom, maksimal 400px.
- CTA spesifik: "Masuk" dan "Buat akun". Bukan "Get Started" (R-15).
- Error generik "Email atau sandi salah". Alasan: tidak membocorkan akun
  mana yang terdaftar (SRS P1-14).
- Link silang: "Belum punya akun? Daftar" dan sebaliknya.

### 6.2 `/dashboard` (Programmer 3, Modul E)

- Focal point: angka saldo besar di hero. Alasan: satu hal terpenting per
  layar.
- Di bawahnya dua kartu: total pemasukan (hijau) dan total pengeluaran
  (merah semantik), lalu widget transaksi terbaru.
- Tombol utama "Catat transaksi" (hijau, tanpa panah dekoratif, R-08).
- Zero state: angka 0 plus ajakan "Catat transaksi pertamamu". Alasan:
  memenuhi SRS P3-06 tanpa terlihat rusak.

### 6.3 `/transactions` riwayat (Programmer 2, Modul D)

- Chip filter: Semua, Pemasukan, Pengeluaran. Chip aktif memakai aksen amber.
  Alasan: status fungsi yang nyata, bukan badge dekoratif (R-09).
- Daftar terbaru ke terlama (SRS FR-16), tiap baris: kategori, deskripsi,
  tanggal, nominal tabular rata kanan, aksi edit dan hapus.
- Empty state: "Belum ada transaksi" plus tombol "Catat pemasukan" dan
  "Catat pengeluaran" (SRS P2-11).

### 6.4 Form tambah dan edit (Programmer 2, Modul C)

- Pilihan tipe radio Pemasukan/Pengeluaran, nominal (tolak nol atau negatif,
  SRS P2-03), kategori, deskripsi, tanggal.
- Validasi tampil di bawah field yang salah, bukan alert generik.
- Hapus selalu pakai dialog konfirmasi yang bisa ditutup dengan Escape.

### 6.5 Preferensi tema via cookie (Programmer 1, Modul B)

- Toggle terang/gelap di header, tersimpan di cookie, default terang
  (SRS FR-08, FR-09, P1-13).
- Pilihan diterapkan saat aplikasi dibuka kembali, tanpa flash tema yang
  salah jika memungkinkan.

## 7. States wajib (R-27)

Setiap tampilan data punya tiga states: empty (lihat 6.2 dan 6.3), loading
(skeleton sebaris sederhana), error (pesan plus tombol "Coba lagi"). Pesan
error tidak membocorkan stack trace, query, atau secret (SRS NFR-04).

## 8. Mobile dan aksesibilitas

- Mobile dulu, target 360px tanpa overflow horizontal (R-03).
- Target sentuh minimal 44px untuk semua tombol dan chip.
- Semua interaktif bisa dijangkau Tab dan diaktifkan Enter atau Spasi,
  dialog ditutup Escape, indikator fokus selalu terlihat (R-32).
- Setiap input punya label nyata, bukan hanya placeholder.

## 9. Bahasa

Bahasa Indonesia santai untuk seluruh UI. Contoh yang benar: "Catat
pengeluaran", "Riwayat transaksi", "Saldo bulan ini". Hindari buzzword
(R-16) dan karakter em dash (R-02): pakai koma, titik, atau tanda kurung.

## 10. Larangan spesifik

- Tanpa halaman marketing, tanpa testimoni, tanpa statistik klaim, tanpa FAQ
  (tidak ada di SRS; R-05, R-17, R-18, R-28).
- Tanpa gradien biru ungu, tanpa grid background, tanpa bento grid (R-01,
  R-07, R-05).
- Tanpa ikon generik (sparkle, petir, robot) kecuali benar-benar relevan
  dengan isinya dan relevansinya ditulis (R-04).
- Tanpa meniru tampilan Linear, Vercel, atau Stripe (R-30).
- Tanpa nav ke halaman yang belum ada (R-24).
- Tanpa ilustrasi stok; jika butuh visual, pakai screenshot produk asli atau
  tidak pakai sama sekali (R-22).

## 11. Peta ke branch

| Area              | Branch                          | Catatan                          |
| ----------------- | ------------------------------- | -------------------------------- |
| Auth plus cookie  | `feature/auth-session`          | 6.1 dan 6.5                      |
| Transaksi         | `feature/transactions`          | 6.3 dan 6.4                      |
| Dashboard plus security | `feature/dashboard-security` | 6.2, states 7, verifikasi kontras |
