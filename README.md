# APAI SELAMAT MOTOR PALABUHANRATU
### Website Resmi Dealer Sepeda Motor Honda Palabuhanratu, Sukabumi

Website landing page dealer sepeda motor Honda modern, mobile-first, dan interaktif yang dibangun menggunakan **HTML, CSS, dan JavaScript Vanilla** (tanpa framework/tanpa proses build) sehingga siap di-hosting langsung di **GitHub Pages**, dengan backend database **Google Firebase (Firestore, Storage, dan Authentication)**.

---

## 🚀 FITUR UTAMA

1. **Tema Merah & Putih Honda**: Desain modern, bersih, tegas, dan responsif (dioptimalkan untuk pengguna smartphone).
2. **Katalog Produk Dinamis**:
   - Filter kategori seri resmi Honda (Semua, ADV Series, Beat Series, PCX Series, Vario Series, Scoopy Series, Stylo Series, Genio Series, Supra Series, Revo Series, CBR Series, CB150 Series, CRF/Off-Road Series, CB Verza Series, Forza Series) dengan penghitung jumlah motor akurat.
   - Pencarian motor secara live berdasarkan nama/tipe.
   - Badge "Cicilan mulai dari Rp..." yang dihitung otomatis dari nilai simulasi terendah.
3. **Modal Detail Produk & Galeri Warna Interaktif**:
   - Pilihan varian warna dengan foto produk yang otomatis berganti saat warna dipilih.
   - Penjelasan spesifikasi/deskripsi ringkas motor.
   - Informasi harga Cash + Asuransi (OTR).
4. **Kalkulator Simulasi Kredit Real-time**:
   - Dropdown pilihan DP (Uang Muka) sesuai data riil dealer.
   - Dropdown pilihan Tenor (11, 17, 23, 29, 35 bulan, dsb).
   - Tampilan nominal angsuran per bulan otomatis.
5. **Pemesanan via WhatsApp**:
   - Integrasi nomor WhatsApp langsung atau link `wa.me/message/...`.
   - Otomatis menyalin template pesan ke clipboard dan memunculkan notifikasi toast konfirmasi.
   - Floating WhatsApp button di sudut kanan bawah dengan efek radar.
6. **Dashboard Admin Lengkap (`/admin/`)**:
   - **Login Admin**: Dilindungi Firebase Authentication (Email & Password).
   - **Kelola Hero & Banner Promo**: Ganti background, ubah banner promo overlay, atau sembunyikan banner promo.
   - **Kelola Produk (CRUD)**: Tambah, edit, dan hapus motor, kelola varian warna + upload foto ke Firebase Storage, serta kelola baris simulasi kredit.
   - **Fitur Import Excel & JSON**:
     - Mendukung import langsung file Excel pricelist (`.xls` / `.xlsx`) via SheetJS di browser.
     - Tombol **1-Klik Inisialisasi 45 Motor**: Otomatis mengupload seluruh 45 model motor dari file pricelist ke Firestore dalam hitungan detik!
   - **Kelola Tentang Kami**: Ubah teks profil dealer dan ganti foto showroom.
   - **Kelola Testimoni**: Tambah, edit, dan hapus ulasan konsumen beserta foto dan rating bintang.
   - **Kelola Kontak & Sosial Media**: Edit alamat, jam buka, nomor WhatsApp, Instagram, TikTok, Facebook, dan Google Maps embed.
   - **Kelola Template WhatsApp**: Edit format pesan pesanan dengan variabel dinamis `{namaMotor}`, `{warna}`, `{dp}`, `{tenor}`, `{cicilan}`, dan `{hargaCash}` dilengkapi live preview.

---

## 📁 STRUKTUR FOLDER PROJECT

```
APAYSELAMATMOTOR/
├── index.html                   # Landing page utama
├── css/
│   └── style.css                # Stylesheet utama tema merah-putih
├── js/
│   ├── firebase-config.js       # Konfigurasi & inisialisasi Firebase modular
│   ├── main.js                  # Render data landing page dari Firestore
│   └── product-detail.js        # Logic modal, kalkulator simulasi kredit & WA
├── data/
│   ├── default-settings.json    # Data default hero, about, kontak, dan WA template
│   ├── seed-products.json       # 45 motor lengkap dengan simulasi dari pricelist
│   └── seed-testimonials.json   # 8 testimoni konsumen Honda Palabuhanratu
├── assets/
│   ├── img/
│   │   ├── logo/                # Logo resmi Honda & dealer (transparan & solid)
│   │   ├── hero/                # Background hero & banner promo overlay
│   │   ├── about/               # Foto showroom / dealer
│   │   └── testimonials/        # Foto konsumen testimoni
│   └── products/                # Foto varian warna motor Honda
├── admin/
│   ├── login.html               # Halaman login khusus admin
│   ├── index.html               # Dashboard single page admin
│   ├── css/
│   │   └── admin.css            # Stylesheet dashboard admin
│   └── js/
│       ├── admin-auth.js        # Proteksi login & logout Firebase Auth
│       ├── admin-products.js    # CRUD motor, kredit, & import Excel/JSON
│       ├── admin-hero.js        # Kelola hero & banner promo
│       ├── admin-about.js       # Kelola profil tentang kami
│       ├── admin-testimonials.js# Kelola testimoni konsumen
│       └── admin-contact.js     # Kelola kontak, sosmed & template WA
├── scripts/
│   ├── parse_excel.py           # Script Python pembaca file Excel pricelist
│   └── prepare_assets.py        # Script pengorganisasian aset lokal
├── firestore.rules              # Aturan keamanan database Firestore
├── storage.rules                # Aturan keamanan file upload Firebase Storage
├── .gitignore                   # Konfigurasi ignore file Git
└── README.md                    # Dokumentasi lengkap proyek
```

---

## 🌐 PANDUAN DEPLOY KE GITHUB PAGES

### Langkah 1: Push Project ke GitHub Repository
Buka terminal (PowerShell atau Git Bash) di folder project:
```bash
git init
git add .
git commit -m "Initial commit: Website Dealer Honda Apai Selamat Motor"
git branch -M main
git remote add origin https://github.com/<USERNAME-GITHUB-ANDA>/<NAMA-REPO>.git
git push -u origin main
```

### Langkah 2: Aktifkan Fitur GitHub Pages
1. Buka repository Anda di GitHub melalui browser.
2. Klik tab **Settings** di menu atas repo.
3. Di bilah menu kiri, klik **Pages** (di bawah bagian *Code and automation*).
4. Pada bagian **Build and deployment**:
   - **Source**: pilih `Deploy from a branch`.
   - **Branch**: pilih `main` dan folder `/ (root)`.
5. Klik **Save**.
6. Tunggu sekitar 1-2 menit, URL website dealer Anda akan aktif di format:
   `https://<username>.github.io/<nama-repo>/`

---

## 🔒 CARA SETTING FIREBASE CONSOLE

### 1. Buat Akun Admin Pertama Kali
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Pilih project: `apayselamatmotor`.
3. Di menu sebelah kiri, buka **Build** → **Authentication**.
4. Pastikan tab **Sign-in method** sudah mengaktifkan **Email/Password**.
5. Buka tab **Users**, klik tombol **Add user**.
6. Masukkan email admin (contoh: `admin@apayselamatmotor.com`) dan password pilihan Anda.
7. Sekarang Anda dapat login ke halaman admin di: `https://<domain-anda>/admin/login.html`.

### 2. Pasang Security Rules Firestore
1. Di Firebase Console, buka **Build** → **Firestore Database**.
2. Klik tab **Rules**.
3. Hapus isi yang lama dan tempelkan aturan berikut:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
4. Klik **Publish**.

### 3. Pasang Security Rules Storage
1. Di Firebase Console, buka **Build** → **Storage**.
2. Klik tab **Rules**.
3. Hapus isi yang lama dan tempelkan aturan berikut:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
4. Klik **Publish**.

---

## 📥 CARA IMPORT DATA AWAL KE FIRESTORE

Setelah login pertama kali ke Dashboard Admin (`/admin/`):

1. Masuk ke tab **Kelola Motor & Kredit**.
2. Klik tombol hijau **Import File**.
3. Di jendela pop-up, klik tombol merah **"Upload Semua 45 Motor ke Firestore Sekarang"**.
4. Tunggu beberapa detik hingga proses upload selesai (100%).
5. Selesai! Seluruh 45 varian motor Honda beserta ribuan data simulasi kredit (DP & Tenor) resmi sudah masuk ke database Firestore Anda dan langsung tampil di landing page!
6. Anda juga dapat mengimpor file Excel baru sewaktu-waktu menggunakan form file upload yang tersedia.

---

## 📞 KONTAK DEALER
- **Dealer**: APAI SELAMAT MOTOR PALABUHANRATU
- **Lokasi**: Palabuhanratu, Kab. Sukabumi, Jawa Barat
- **WhatsApp**: [Chat Sales via WhatsApp](https://wa.me/message/U3EXD46A5L7PM1)
