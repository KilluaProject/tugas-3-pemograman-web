# SITTA UT — Tugas Praktik 3

Aplikasi web sederhana untuk pengelolaan stok bahan ajar, tracking Delivery Order (DO), dan pemesanan DO baru di Universitas Terbuka. Dibangun dengan **Vue.js 2** dan **Tailwind CSS**, menggunakan data dummy dari file JSON tanpa database.

**Mata kuliah:** STSI4209 Pemrograman Berbasis Web
**Nama:** Raden Agung Prakoso Wibowo
**NIM:** [isi NIM]

## Fitur

- **Login admin** dengan akun hardcode dan sesi `sessionStorage`.
- **Stok Bahan Ajar**
  - Tabel stok dengan harga, jumlah, safety stock, dan status berwarna (Aman / Menipis / Kosong).
  - Tooltip `catatanHTML` pada badge status.
  - Filter UT-Daerah, filter kategori dependent, filter perlu re-order, dan reset filter.
  - Sort berdasarkan judul, stok, atau harga (ascending/descending).
  - Tambah, edit inline, dan hapus data dengan validasi serta modal notifikasi.
- **Tracking DO**
  - Pencarian berdasarkan Nomor DO atau NIM (Enter untuk cari, Esc untuk reset).
  - Riwayat perjalanan dan penambahan progress dengan waktu lokal.
- **Pemesanan DO Baru**
  - Nomor DO otomatis (`DO` + tahun berjalan + urutan tiga digit).
  - Detail isi paket dan total harga otomatis.
  - Validasi NIM, ekspedisi, paket, dan tanggal kirim.

## Teknologi

- Vue.js 2 (CDN)
- Tailwind CSS 4 (CLI)
- JavaScript ES5 (kompatibel browser)
- Data dummy: `data/dataBahanAjar.json`

## Struktur Folder

```text
tugas-3/
├─ index.html
├─ assets/
│  ├─ css/input.css
│  ├─ css/style.css        # hasil build
│  └─ img/logo_ut.png
├─ data/dataBahanAjar.json
├─ js/
│  ├─ app.js
│  ├─ components/
│  └─ services/
├─ templates/
├─ package.json
└─ README.md
```

## Cara Menjalankan

```bash
npm install
npm run build
npm run serve
```

Buka `http://localhost:3000`.

Aplikasi harus dijalankan melalui server HTTP karena template komponen dan data JSON diambil menggunakan `fetch()`.

## Akun Demo

| Username | Password |
|---|---|
| `admin` | `admin123` |

## Catatan

- Data hanya tersimpan di memori, sehingga perubahan kembali ke kondisi awal setelah halaman di-refresh.
- Login bersifat client-side dan hanya untuk latihan alur antarmuka, bukan mekanisme keamanan produksi.
- Vue.js 2 digunakan sesuai ketentuan tugas.
