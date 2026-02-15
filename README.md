# Finance Tracker 💰

Aplikasi web Finance Tracker untuk mengelola keuangan pribadi dengan mudah. Semua data disimpan secara lokal di browser Anda menggunakan LocalStorage.

## 🚀 Cara Menggunakan

### Membuka Aplikasi

1. **Langsung dari browser:**
   - Buka file `index.html` dengan double-click, atau
   - Drag & drop file `index.html` ke browser

2. **Menggunakan local server (opsional):**
   ```bash
   # Menggunakan Python
   python -m http.server 8000
   
   # Atau menggunakan npx
   npx serve
   ```
   Kemudian buka `http://localhost:8000` di browser

## ✨ Fitur Utama

### 1. Tambah Transaksi
- Isi formulir dengan tanggal, tipe (pemasukan/pengeluaran), kategori, nominal, dan catatan
- Klik tombol "Tambah Transaksi"
- Transaksi otomatis tersimpan di LocalStorage browser

### 2. Filter & Pencarian
- **Filter Bulan:** Pilih bulan dan tahun untuk melihat transaksi periode tertentu
- **Pencarian Real-time:** Ketik keyword untuk mencari berdasarkan kategori, catatan, atau nominal

### 3. Edit & Hapus Transaksi
- Klik tombol ✏️ untuk mengedit transaksi
- Klik tombol 🗑️ untuk menghapus transaksi (dengan konfirmasi)

### 4. Export Data

#### Excel (.xlsx)
- Klik tombol "Export Excel"
- File akan otomatis terdownload dengan nama: `Laporan_Keuangan_[Bulan]_[Tahun].xlsx`
- Berisi ringkasan dan detail transaksi

#### Word (.docx)
- Klik tombol "Export Word"
- File akan otomatis terdownload dengan nama: `Laporan_Keuangan_[Bulan]_[Tahun].docx`
- Dokumen profesional dengan tabel transaksi

### 5. Backup & Restore

#### Backup
- Klik tombol "Backup JSON"
- Semua data akan di-export ke file JSON
- Simpan file ini sebagai backup

#### Import
- Klik tombol "Import JSON"
- Pilih file backup JSON yang sudah di-export sebelumnya
- Pilih apakah ingin menggabungkan atau mengganti data yang ada

### 6. Reset Data
- Klik tombol "Reset Data"
- Konfirmasi 2x untuk menghapus semua data
- **Perhatian:** Data yang dihapus tidak dapat dikembalikan!

## 📱 Mobile-Friendly

Aplikasi ini didesain dengan pendekatan mobile-first dan responsif:
- Tampilan otomatis menyesuaikan ukuran layar
- Touch-friendly buttons
- Optimized untuk penggunaan di smartphone

## 🎨 Fitur UI/UX

- **Desain Modern:** Glassmorphism dengan gradien purple-blue
- **Animasi Halus:** Micro-animations untuk pengalaman yang lebih interaktif
- **Toast Notifications:** Feedback visual untuk setiap aksi
- **Empty States:** Pesan helpful saat belum ada data

## 💾 Penyimpanan Data

- Data disimpan di **LocalStorage** browser
- **Tidak ada server** - semua data tetap di perangkat Anda
- **Private & Secure** - data tidak dikirim ke server manapun
- Kapasitas: ~5-10MB tergantung browser

## ⚠️ Catatan Penting

1. **Backup Rutin:** Lakukan backup JSON secara berkala untuk menghindari kehilangan data
2. **Clear Browser Data:** Jika Anda clear browser data/cache, semua transaksi akan hilang
3. **Multi-Device:** Data tidak sync antar device - gunakan backup/import untuk pindah device
4. **Browser Support:** Aplikasi ini bekerja di semua browser modern (Chrome, Firefox, Safari, Edge)

## 🔧 Teknologi

- **HTML5** - Struktur semantik
- **CSS3** - Styling modern dengan custom properties
- **Vanilla JavaScript** - Tanpa framework, ringan dan cepat
- **SheetJS (xlsx)** - Library untuk export Excel
- **docx.js** - Library untuk export Word

## 📄 Lisensi

Free to use untuk keperluan pribadi dan komersial.

---

**Selamat mengelola keuangan! 💵**
