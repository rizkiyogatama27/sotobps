# Arsitektur Sistem & Spesifikasi Teknis
# SOTO 3524: Sistem Observasi & Transparansi Online
### Badan Pusat Statistik Kabupaten Lamongan

---

## 1. Ikhtisar Arsitektur (*High-Level Architecture*)

Portal **SOTO 3524** dibangun dengan pola **Jamstack / Modular Static Hybrid** yang menggabungkan kecepatan pengiriman halaman statis (edge CDN via Vercel) dengan kemampuan pengelolaan dinamis lokal (Laragon PHP/MySQL) dan fallback *client-side persistence* (localStorage & sessionStorage).

```
┌─────────────────────────────────────────────────────────────────┐
│                       Pengguna Publik                           │
│              (Masyarakat, OPD Lamongan, Akademisi)              │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS Request
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│               Frontend Presentation Layer (Vercel CDN)          │
│  - index.html (Semantic HTML5, Accessible WCAG AA)              │
│  - css/style.css (Design tokens, Kinetic typography, Glassmorphism)│
│  - js/main.js (Observer, ScrollSpy, Parallax, Modal Lightbox)   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
          ┌─────────────────────┴─────────────────────┐
          ▼                                           ▼
┌───────────────────────────────┐           ┌────────────────────────────────┐
│   Backend Layer (Localhost)   │           │   Edge Fallback / Serverless   │
│  - Laragon PHP 8.x Environment│           │  - LocalStorage Stats Cache    │
│  - MySQL Database (sotobps)   │           │  - SessionStorage Auth Token   │
│  - api/get_stats.php          │           │  - Static Asset Delivery       │
│  - api/get_feedback.php       │           └────────────────────────────────┘
└───────────────────────────────┘
```

---

## 2. Struktur Modul & Berkas Proyek

```
soto-bps-lamongan/
├── index.html            # Halaman utama publik (Single Page Application - SPA anchors)
├── admin.html            # Dashboard terintegrasi administrator BPS Satker 3524
├── DESIGN.md             # Panduan desain sistem, palet warna, tipografi, dan dial antislop
├── ARCHITECTURE.md       # Dokumentasi arsitektur sistem, modul JS, skema data & API
├── CLAUDE.md             # Konfigurasi agen AI & aturan filter antislop
├── README.md             # Petunjuk instalasi dan ringkasan fitur
├── vercel.json           # Konfigurasi routing dan deployment Vercel Edge
├── sotobps.sql           # Skema database MySQL (tabel pengguna, statistik makro, umpan balik)
│
├── api/                  # Endpoint PHP Backend (Laragon/Production)
│   ├── db.php            # Koneksi PDO MySQL aman dengan exception handling
│   ├── get_stats.php     # API pembaca metrik indikator makro hero & statistik daerah
│   ├── update_stats.php  # API mutasi metrik dari dashboard admin
│   └── get_feedback.php  # API rekapitulasi data survei & masukan pengguna
│
├── css/
│   └── style.css         # Variabel desain, keyframe animasi, scrollbar, modal transition
│
├── js/
│   └── main.js           # Engine interaktivitas modular tanpa framework berat
│
└── assets/
    └── images/
        ├── hero-bg.webp  # Foto panorama tim BPS Lamongan terkompresi (WebP retina-ready)
        └── logo-bps.png  # Aset logo resmi Badan Pusat Statistik
```

---

## 3. Komponen Frontend Utama (`js/main.js`)

Frontend sengaja dibangun tanpa framework berat (React/Vue/Angular) untuk mempertahankan waktu muat di bawah 0.5 detik (*Zero Bundle Overhead*), menggunakan JavaScript Vanilla modular:

1. **`initVariableFontProximity()`**:
   - Mendeteksi posisi kursor pointer dan menyesuaikan bobot rupa huruf secara kinetik (600 ke 900 pada radius `< 200px`).
   - Menggerakkan efek mouse-parallax foto panorama `scale(1.02)` secara halus tanpa lag GPU.
2. **`initNavScrollSpy()`**:
   - Memantau posisi scroll pengguna terhadap section target (`#hero`, `#layanan`, `#pustaka`, `#konsultasi`, `#qna`) dan otomatis memperbarui sorotan aktif (*active pill*) di navbar.
3. **`initHeroDrift()`**:
   - Menjalankan osilasi harmonik sinusoida `Math.sin(t * 1.5 + i * 2) * 6` pada 3 kartu metrik utama.
4. **`initTeamPhotoModal()`**:
   - Lightbox modal aksesibel (bisa ditutup dengan tombol `Escape`, klik backdrop, atau tombol `X`). Menjaga fokus keyboard dan mengunci scroll latar saat aktif.
5. **`loadCustomStats()`**:
   - Mekanisme **Smart Fallback**: Mencoba menarik data metrik langsung dari `api/get_stats.php`. Jika dihosting di Vercel (tanpa server PHP lokal), otomatis membaca cache `localStorage` secara transparan.

---

## 4. Keamanan & Autentikasi Admin (`admin.html`)

- **Autentikasi Berbasis Sesi**: Menggunakan guard token `soto_admin_logged_in` di dalam `sessionStorage`.
- **Proteksi Rute Klien**: Jika pengguna mencoba mengakses langsung halaman `admin.html` tanpa kredensial valid, skrip otomatis me-redirect ke `index.html` dan memunculkan modal login SSO BPS.
- **Formulir Pengaturan Dinamis**: Dashboard admin memungkinkan perubahan nilai metrik indikator makro (Padi, IPM, Wilayah) secara real-time yang langsung tercermin pada halaman muka.

---

## 5. Pipeline Deployment & Otomatisasi

- **Source Control**: GitHub Repository (`https://github.com/rizkiyogatama27/sotobps.git` pada branch `main`).
- **Continuous Deployment**: Terhubung langsung ke **Vercel** (`sotobps-lamongan.vercel.app`). Setiap commit yang di-push ke branch `main` secara otomatis memicu build dan deploy instan dalam 15–30 detik.
