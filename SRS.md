# DUITku — Software Requirements Specification (SRS)

## 1. Informasi Proyek

**Nama Aplikasi:** DUITku  
**Jenis:** Web Expense Tracker  
**Target Pengguna:** Mahasiswa

### 1.1 Tujuan Sistem

DUITku adalah aplikasi web Expense Tracker yang memungkinkan mahasiswa mengelola keuangan pribadi secara sederhana.

Pengguna dapat:

- Membuat akun dan login.
- Menambahkan pemasukan dan pengeluaran.
- Melihat riwayat transaksi.
- Mengubah transaksi.
- Menghapus transaksi.
- Melihat saldo.
- Melihat total pemasukan.
- Melihat total pengeluaran.
- Memiliki session login selama session masih berlaku.
- Menyimpan minimal satu preferensi pengguna menggunakan cookies.

Setiap data transaksi harus terhubung dengan pengguna yang sedang login sehingga pengguna hanya dapat mengakses dan mengelola data miliknya sendiri.

---

# 2. Pembagian Tim Programmer

## 2.1 Struktur Pembagian

| Programmer | Branch | SRS/Modul | Fokus Utama |
|---|---|---|---|
| **Programmer 1** | `feature/auth-session` | Modul A + Modul B | Authentication, Session, Cookie Preference |
| **Programmer 2** | `feature/transactions` | Modul C + Modul D | Transaction CRUD, Transaction History |
| **Programmer 3** | `feature/dashboard-security` | Modul E + Modul F | Dashboard Summary, Data Isolation, Security, Integration |

Setiap programmer memegang minimal 2 modul sehingga pembagian pekerjaan tetap seimbang.

---

## 2.2 Tanggung Jawab Programmer 1

### Branch

```text
feature/auth-session
```

### Modul

- **Modul A — Authentication**
- **Modul B — Session & Cookie Preference**

### Tugas Detail

| ID | Fitur | Detail Pekerjaan | Output |
|---|---|---|---|
| P1-01 | Register | Membuat halaman/form registrasi | Register UI |
| P1-02 | Register Validation | Validasi field wajib, format email/username, password | Validation logic |
| P1-03 | Duplicate Account | Mencegah email/username yang sudah digunakan | Duplicate check |
| P1-04 | Password Hash | Password tidak disimpan plaintext | Password hashing |
| P1-05 | Login | Membuat form dan proses login | Login UI + backend |
| P1-06 | Login Validation | Memvalidasi kredensial | Authentication logic |
| P1-07 | Logout | Menghapus/menginvalidasi session | Logout endpoint/action |
| P1-08 | Session Creation | Membuat session setelah login berhasil | Session mechanism |
| P1-09 | Protected Route Check | Memeriksa user yang sudah login | Auth middleware/guard |
| P1-10 | Session Lifetime | Mempertahankan login selama session berlaku | Session configuration |
| P1-11 | Cookie Preference | Menyimpan minimal satu preferensi pengguna dengan cookie | Cookie mechanism |
| P1-12 | Read Cookie | Membaca dan menerapkan preferensi | Preference handling |
| P1-13 | Default Preference | Menggunakan nilai default jika cookie tidak ada | Default behavior |
| P1-14 | Auth Error Handling | Menampilkan error yang aman dan tidak membocorkan informasi sensitif | Error handling |

### Acceptance Criteria Programmer 1

- User baru dapat melakukan registrasi.
- Akun dengan email/username yang sudah digunakan ditolak.
- Password tersimpan dalam bentuk hash.
- User dengan kredensial benar dapat login.
- User dengan kredensial salah tidak dapat login.
- Session dibuat setelah login berhasil.
- Halaman privat tidak dapat diakses tanpa session valid.
- Logout mengakhiri session.
- Minimal satu preferensi tersimpan melalui cookie.
- Password tidak pernah disimpan dalam cookie.
- Preferensi cookie diterapkan ketika aplikasi dibuka kembali.

### Dependency

Programmer 1 menjadi dasar untuk:

```text
Authentication
    ↓
Session
    ↓
Transaction
    ↓
Dashboard
```

---

## 2.3 Tanggung Jawab Programmer 2

### Branch

```text
feature/transactions
```

### Modul

- **Modul C — Transaction CRUD**
- **Modul D — Transaction History**

### Tugas Detail

| ID | Fitur | Detail Pekerjaan | Output |
|---|---|---|---|
| P2-01 | Transaction Model | Membuat struktur data transaksi | Transaction model/schema |
| P2-02 | Create Transaction | Menambah transaksi income/expense | Create feature |
| P2-03 | Transaction Validation | Validasi tipe, nominal, tanggal, dan field lain | Validation logic |
| P2-04 | User Ownership | Menyimpan transaksi dengan `user_id` dari user login | Ownership relation |
| P2-05 | Read Transaction | Melihat detail transaksi | Detail page/endpoint |
| P2-06 | Update Transaction | Mengubah transaksi milik user | Edit feature |
| P2-07 | Delete Transaction | Menghapus transaksi milik user | Delete feature |
| P2-08 | Transaction List | Menampilkan daftar transaksi user | History list |
| P2-09 | Sorting | Menampilkan transaksi dengan urutan konsisten | Sorting |
| P2-10 | Filter Income/Expense | Filter berdasarkan jenis transaksi | Filter feature |
| P2-11 | Empty State | Tampilan ketika belum memiliki transaksi | Empty-state UI |
| P2-12 | Action Navigation | Tombol/detail/edit/delete dari riwayat | UI actions |
| P2-13 | Unauthorized Resource Handling | Menolak operasi terhadap transaksi user lain | Authorization check |

### Struktur Data Transaksi

Minimal:

| Field | Keterangan |
|---|---|
| `id` | ID transaksi |
| `user_id` | Pemilik transaksi |
| `type` | `income` / `expense` |
| `amount` | Nominal transaksi |
| `category` | Kategori |
| `description` | Deskripsi transaksi |
| `transaction_date` | Tanggal transaksi |
| `created_at` | Waktu dibuat |
| `updated_at` | Waktu diperbarui |

### Acceptance Criteria Programmer 2

- User login dapat menambahkan pemasukan.
- User login dapat menambahkan pengeluaran.
- Nominal kurang dari atau sama dengan 0 ditolak.
- Transaksi tersimpan dengan `user_id` user yang sedang login.
- User dapat melihat transaksi miliknya.
- User dapat mengubah transaksi miliknya.
- User dapat menghapus transaksi miliknya.
- User tidak dapat mengubah atau menghapus transaksi milik user lain.
- Riwayat hanya menampilkan transaksi user aktif.
- Riwayat memiliki sorting yang konsisten.
- Filter income/expense berfungsi.
- Empty state muncul ketika belum ada transaksi.

### Dependency

Programmer 2 bergantung pada:

```text
Programmer 1
Authentication + Session
        ↓
Programmer 2
Transaction CRUD + History
```

---

## 2.4 Tanggung Jawab Programmer 3

### Branch

```text
feature/dashboard-security
```

### Modul

- **Modul E — Dashboard & Financial Summary**
- **Modul F — Data Isolation, Security & Integration**

### Tugas Detail

| ID | Fitur | Detail Pekerjaan | Output |
|---|---|---|---|
| P3-01 | Dashboard Layout | Membuat struktur halaman dashboard | Dashboard UI |
| P3-02 | Total Income | Menampilkan total pemasukan | Income summary |
| P3-03 | Total Expense | Menampilkan total pengeluaran | Expense summary |
| P3-04 | Balance | Menghitung saldo | Balance summary |
| P3-05 | Recent Transactions | Menampilkan transaksi terbaru | Recent transaction widget |
| P3-06 | Zero State | Dashboard user tanpa transaksi menampilkan 0 | Empty/zero state |
| P3-07 | Auto Refresh Summary | Summary berubah setelah CRUD transaksi | Summary synchronization |
| P3-08 | Data Isolation | Memastikan query berdasarkan user aktif | Query filtering |
| P3-09 | Read Authorization | Mencegah pembacaan data user lain | Authorization |
| P3-10 | Update Authorization | Mencegah update data user lain | Authorization |
| P3-11 | Delete Authorization | Mencegah delete data user lain | Authorization |
| P3-12 | Dashboard Isolation | Dashboard hanya menghitung data user aktif | Dashboard authorization |
| P3-13 | Input Security | Memastikan input tervalidasi | Security validation |
| P3-14 | Error Security | Tidak membocorkan stack trace/query/secret | Secure error handling |
| P3-15 | Integration | Menghubungkan Auth → Transaction → Dashboard | System integration |
| P3-16 | Integration Testing | Pengujian alur antarmodul | Integration tests |

### Perhitungan Dashboard

```text
Total Pemasukan = SUM(amount) untuk type = income

Total Pengeluaran = SUM(amount) untuk type = expense

Saldo = Total Pemasukan - Total Pengeluaran
```

Semua perhitungan hanya boleh menggunakan transaksi milik user yang sedang login.

### Acceptance Criteria Programmer 3

- Dashboard menampilkan total pemasukan.
- Dashboard menampilkan total pengeluaran.
- Dashboard menampilkan saldo.
- Saldo = total pemasukan - total pengeluaran.
- Dashboard menampilkan transaksi terbaru.
- User tanpa transaksi mendapatkan nilai pemasukan 0.
- User tanpa transaksi mendapatkan nilai pengeluaran 0.
- User tanpa transaksi mendapatkan saldo 0.
- Dashboard berubah setelah transaksi ditambah, diubah, atau dihapus.
- Data user lain tidak memengaruhi dashboard.
- User A tidak dapat membaca transaksi user B melalui request langsung.
- User A tidak dapat mengubah transaksi user B.
- User A tidak dapat menghapus transaksi user B.
- Input invalid ditolak.
- Error internal tidak bocor ke pengguna.
- Integrasi antar modul berjalan.

---

# 3. Functional Requirements

## 3.1 Authentication

### FR-01 Registrasi

Sistem harus menyediakan fasilitas registrasi akun.

Data minimal:

- Nama.
- Email/username.
- Password.

Validasi:

- Field wajib tidak boleh kosong.
- Email/username harus valid.
- Email/username tidak boleh sudah terdaftar.
- Password harus memenuhi aturan validasi aplikasi.

### FR-02 Login

Sistem harus menyediakan login menggunakan kredensial yang telah terdaftar.

### FR-03 Logout

Sistem harus menyediakan logout dan mengakhiri session pengguna.

---

## 3.2 Session

### FR-04 Session Login

Setelah login berhasil, sistem membuat session yang mengidentifikasi user.

### FR-05 Protected Access

Halaman privat hanya dapat diakses ketika session valid.

### FR-06 Session Lifetime

Session dipertahankan selama masa berlaku session.

### FR-07 Session Logout

Logout harus menghapus atau menginvalidasi session.

---

## 3.3 Cookie Preference

### FR-08 User Preference Cookie

Sistem harus menggunakan cookies untuk menyimpan minimal satu preferensi pengguna.

Contoh:

- Tema `light/dark`.
- Preferensi tampilan dashboard.

### FR-09 Cookie Retrieval

Sistem harus membaca cookie tersebut dan menerapkan preferensi ketika halaman dibuka.

---

## 3.4 Transaction Management

### FR-10 Create Transaction

Pengguna dapat menambah:

- Income.
- Expense.

Data minimal:

- Type.
- Amount.
- Category.
- Description.
- Date.

### FR-11 Read Transaction

Pengguna dapat melihat transaksi miliknya.

### FR-12 Update Transaction

Pengguna dapat mengubah transaksi miliknya.

### FR-13 Delete Transaction

Pengguna dapat menghapus transaksi miliknya.

### FR-14 Transaction Ownership

Setiap transaksi harus memiliki `user_id`.

`user_id` harus diambil dari identitas pengguna yang sedang login, bukan dipercaya dari input client.

---

## 3.5 Transaction History

### FR-15 Transaction List

Sistem menampilkan riwayat transaksi pengguna.

### FR-16 Sorting

Riwayat memiliki urutan transaksi yang konsisten.

Default yang disarankan:

```text
Terbaru → Terlama
```

### FR-17 Filtering

Minimal menyediakan filter:

```text
Income
Expense
```

### FR-18 Empty History

Jika belum ada transaksi, tampilkan empty state.

---

## 3.6 Dashboard

### FR-19 Financial Summary

Dashboard harus menampilkan:

- Saldo.
- Total pemasukan.
- Total pengeluaran.

### FR-20 Recent Transactions

Dashboard dapat menampilkan transaksi terbaru.

### FR-21 Summary Calculation

```text
saldo = total pemasukan - total pengeluaran
```

### FR-22 User-Specific Summary

Semua angka dashboard harus berasal dari transaksi user yang sedang login.

---

# 4. Non-Functional Requirements

## 4.1 Security

### NFR-01 Password Security

Password wajib disimpan menggunakan password hashing.

### NFR-02 Authorization

Session valid tidak berarti user boleh mengakses semua resource.

Setiap transaksi harus tetap diverifikasi kepemilikannya.

### NFR-03 Input Validation

Semua input dari pengguna harus divalidasi.

### NFR-04 Error Handling

Error kepada pengguna tidak boleh membocorkan:

- Password hash.
- Secret.
- Query database.
- Stack trace.
- Informasi internal server.

---

## 4.2 Data Isolation

Semua data keuangan harus terisolasi berdasarkan user.

Contoh:

```text
User A
├── Transaction A1
├── Transaction A2
└── Transaction A3

User B
├── Transaction B1
└── Transaction B2
```

User A tidak boleh dapat mengakses Transaction B1/B2.

---

# 5. Relasi Antar Modul

```text
┌───────────────────────┐
│ Authentication        │
│ Programmer 1          │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Session & Cookie      │
│ Programmer 1          │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Transaction CRUD      │
│ Programmer 2          │
└───────────┬───────────┘
            │
       ┌────┴─────┐
       ▼          ▼
┌─────────────┐ ┌────────────────────┐
│ Transaction │ │ Dashboard Summary  │
│ History     │ │ Programmer 3       │
│ Programmer2 │ └─────────┬──────────┘
└─────────────┘           │
                          ▼
                ┌──────────────────────┐
                │ Security &           │
                │ Data Isolation       │
                │ Programmer 3         │
                └──────────────────────┘
```

---

# 6. Pembagian Ownership File/Modul

Struktur yang disarankan:

```text
DUITku/
├── docs/
│   └── SRS.md
├── auth/
│   └── Programmer 1
├── session/
│   └── Programmer 1
├── transactions/
│   └── Programmer 2
├── history/
│   └── Programmer 2
├── dashboard/
│   └── Programmer 3
└── security/
    └── Programmer 3
```

Pembagian tersebut dapat disesuaikan dengan framework yang digunakan.

---

# 7. Branch Strategy

## 7.1 Branch Utama

Disarankan menggunakan:

```text
main
```

atau:

```text
develop
```

sebagai branch integrasi.

## 7.2 Branch Programmer

```text
feature/auth-session
feature/transactions
feature/dashboard-security
```

## 7.3 Alur Kerja

```text
main/develop
      │
      ├── feature/auth-session
      │        └── PR → main/develop
      │
      ├── feature/transactions
      │        └── PR → main/develop
      │
      └── feature/dashboard-security
               └── PR → main/develop
```

### Aturan

- Jangan langsung melakukan pekerjaan pada `main`.
- Setiap programmer bekerja pada branch miliknya.
- Commit harus menjelaskan perubahan.
- Pull Request harus menyebut SRS/module yang dikerjakan.
- Sebelum merge, lakukan pengujian feature.
- Perubahan schema/database harus dikoordinasikan.

---

# 8. Dependency dan Urutan Pengerjaan

| Prioritas | Modul | Programmer | Dependency |
|---|---|---|---|
| 1 | Authentication | P1 | Tidak ada |
| 2 | Session & Cookie | P1 | Authentication |
| 3 | Transaction CRUD | P2 | Authentication + Session |
| 4 | Transaction History | P2 | Transaction CRUD |
| 5 | Dashboard Summary | P3 | Transaction CRUD + Session |
| 6 | Security & Data Isolation | P3 | Authentication + Transaction + Dashboard |
| 7 | Integration Testing | P3 | Semua modul |

---

# 9. Database Requirement

## 9.1 User

Minimal:

| Field | Type/Deskripsi |
|---|---|
| `id` | Primary key |
| `name` | Nama pengguna |
| `email` / `username` | Identitas login, unique |
| `password_hash` | Password hasil hashing |
| `created_at` | Waktu pembuatan |
| `updated_at` | Waktu perubahan |

## 9.2 Transaction

Minimal:

| Field | Type/Deskripsi |
|---|---|
| `id` | Primary key |
| `user_id` | Foreign key ke User |
| `type` | `income` / `expense` |
| `amount` | Nilai transaksi |
| `category` | Kategori |
| `description` | Deskripsi |
| `transaction_date` | Tanggal transaksi |
| `created_at` | Waktu dibuat |
| `updated_at` | Waktu diubah |

---

# 10. End-to-End User Flow

```text
User membuka DUITku
        ↓
   Belum Login?
    /         \
  Ya           Tidak
  ↓              ↓
Register/Login   Dashboard
  ↓              ↓
Session dibuat   Lihat Summary
  ↓              ↓
Dashboard         ├── Tambah transaksi
  ↓               ├── Lihat history
Lihat Summary     ├── Edit transaksi
  ↓               └── Hapus transaksi
Transactions
  ↓
Data disimpan berdasarkan user_id
  ↓
Dashboard diperbarui
  ↓
Logout
  ↓
Session berakhir
```

---

# 11. Definition of Done

Sistem dianggap memenuhi SRS apabila:

- Registrasi berfungsi.
- Login berfungsi.
- Logout berfungsi.
- Session login berfungsi.
- Cookie minimal satu preferensi berfungsi.
- User dapat menambah transaksi.
- User dapat melihat transaksi.
- User dapat mengubah transaksi.
- User dapat menghapus transaksi.
- Riwayat transaksi berfungsi.
- Dashboard menampilkan saldo.
- Dashboard menampilkan total pemasukan.
- Dashboard menampilkan total pengeluaran.
- Seluruh transaksi memiliki relasi user.
- User hanya dapat mengakses data miliknya.
- Password tidak disimpan plaintext.
- Input divalidasi.
- Error sensitif tidak dibocorkan.
- Integrasi antar 3 branch berhasil.
- Pengujian utama untuk authentication, transaction, dashboard, dan authorization berhasil.

---

# 12. Ringkasan Pembagian Kerja

| Programmer | Branch | Modul 1 | Modul 2 | Fokus |
|---|---|---|---|---|
| **Programmer 1** | `feature/auth-session` | Authentication | Session & Cookie | Akun, login, logout, session, preferensi |
| **Programmer 2** | `feature/transactions` | Transaction CRUD | Transaction History | Tambah, lihat, edit, hapus, history |
| **Programmer 3** | `feature/dashboard-security` | Dashboard & Summary | Security & Data Isolation | Saldo, summary, ownership, authorization, integrasi |

## Output Akhir Tiap Programmer

| Programmer | Output Minimum |
|---|---|
| **P1** | Register, Login, Logout, Session, Protected Route, Cookie Preference |
| **P2** | Transaction Model, Create, Read, Update, Delete, History, Filter, Sorting |
| **P3** | Dashboard, Income/Expense/Balance Summary, Recent Transactions, Authorization, Data Isolation, Security, Integration Test |
