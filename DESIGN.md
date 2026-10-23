# Panduan Desain Sistem & Identitas Visual
# SOTO 3524: Sistem Observasi & Transparansi Online
### Badan Pusat Statistik Kabupaten Lamongan (Kanal 3524)

---

## 1. Visi & Filosofi Produk

**SOTO 3524** dirancang sebagai portal layanan publik terpadu (*Single Window Portal*) yang menghubungkan masyarakat, akademisi, dan Organisasi Perangkat Daerah (OPD) dengan layanan statistik BPS Kabupaten Lamongan berstandar Satu Data Indonesia.

### Nilai Karakter Desain (*Brand Mood*):
- **Otoritatif & Terpercaya**: Menampilkan citra instansi pembina data statistik nasional dengan standar integritas Wilayah Bebas dari Korupsi (WBK/WBBM).
- **Megilan (Lokal & Bangga)**: Menyerap semangat keterbukaan dan identitas lokal Kabupaten Lamongan yang tangguh dan dinamis.
- **Humanis & Melayani**: Menghadirkan wajah asli petugas dan kantor pelayanan terbuka, ramah, dan bebas hambatan birokrasi.

### Indikator Dial (*Antislop Calibration*):
- **ENERGY**: `2 (Balanced)` — Berwibawa khas instansi pemerintah, namun hidup dan modern.
- **RHYTHM**: `2 (Consistent with Varied Beats)` — Ritme teratur dengan variasi kartu floating, modal interaktif, dan akordeon QnA.
- **MOTION**: `2 (Scroll-Reveal & Micro-Transitions)` — Transisi lembut, mouse proximity, dan osilasi kartu tanpa membebani GPU.

---

## 2. Palet Warna (*Color Palette System*)

Sistem warna mematuhi aturan rasio kontras WCAG AA (minimal 4.5:1 untuk teks normal dan 3:1 untuk teks besar).

### Warna Inti (*Core Palette*):
| Nama Token | Kode HEX | Peran & Penggunaan |
| :--- | :--- | :--- |
| **BPS Royal Blue** | `#0266B3` | Identitas resmi BPS, tombol aksi primer, tautan aktif, badge satker. |
| **Deep Blue Navy** | `#005BAC` | Status hover tombol primer, teks judul pekat, aksen fokus. |
| **Megilan Terracotta**| `#E34A32` | Aksen khas Lamongan, kata *Megilan*, indikator pulsa, seleksi teks. |
| **Charcoal Carbon** | `#171719` | Warna tipografi utama (H1, H2, judul kartu) untuk ketajaman baca maksimal. |
| **Subtle Slate** | `#55575c` | Teks keterangan, paragraf sekunder, label formulir pendukung. |
| **Soft Base Shell** | `#F4F5F5` | Latar belakang kanvas luar dan kartu frosted glass. |
| **Pristine White** | `#FFFFFF` | Latar kartu konten, modal popup, dan navbar mengambang. |

### Warna Status & Validasi (*Functional Accents*):
- **Emerald WBK** (`#10B981` / `#059669`): Badge Zona Integritas, status tarif Rp 0 (Gratis), dan konfirmasi sukses.
- **Blue Tint** (`#EFF6FF` / `#DBEAFE`): Background badge Kanal 3524 dan highlight tombol sekunder.

---

## 3. Sistem Tipografi (*Typography Scale*)

Tipografi menggabungkan ketegasan geometris modern dengan keanggunan editorial klasik.

| Peran | Rupa Huruf (*Font Family*) | Bobot (*Weight*) | Karakter & Catatan |
| :--- | :--- | :--- | :--- |
| **Teks Dasar & UI** | `Plus Jakarta Sans` / `Inter` | 400, 500, 600, 700 | Font sans-serif yang tajam pada layar monitor maupun smartphone. |
| **Aksen Editorial** | `Instrument Serif` | 400 (Italic) | Digunakan khusus pada aksen kata *"Megilan"* di tajuk utama Hero. |
| **Data Kinetik** | Variable Font (`.wchar`) | Dynamic 600–900 | Bobot menebal halus saat kursor mouse mendekati tajuk. |

---

## 4. Struktur Antarmuka & Layanan Utama

### 4.1. Navigasi Atas (*Sticky Glass Header*)
- **Brand Anchor**: Logo resmi BPS + teks Satker Kanal 3524 (berfungsi sebagai tombol kembali ke Beranda).
- **Trilogi Menu Inti**:
  1. **PST Center** (`#layanan`): Tiga pilar utama pelayanan terpadu.
  2. **Pustaka** (`#pustaka`): Katalog publikasi data digital.
  3. **Konsultasi** (`#konsultasi`): Alur konsultasi statistik tatap muka dan online.
  4. **QnA** (`#qna`): Pertanyaan umum terkait layanan dan data.
- **Aksi Cepat**: Tombol *Login Admin* untuk pengelola internal Satker 3524.

### 4.2. Hero Section: *Cinematic Asymmetric Panorama*
- **Latar Belakang**: Foto panorama asli beresolusi tinggi jajaran pegawai BPS Kabupaten Lamongan di depan Gedung Pelayanan Statistik Terpadu (PST), Jl. Veteran No. 12.
- **Komposisi Kiri**:
  - Badge identitas sistem (`SOTO: Sistem Observasi & Transparansi Online`).
  - Tajuk utama H1 dengan aksen serif Megilan.
  - Penjelas ringkas terintegrasi standar Satu Data Indonesia.
  - Sepasang Call to Action: *Eksplorasi Layanan PST* dan *Katalog Publikasi Data*.
  - Dilapisi kartu kaca lembut (*backdrop blur*) dengan kontras tinggi tanpa menutupi jajaran petugas.
- **Komposisi Kanan**:
  - Kartu akrilik Zona Integritas WBK / WBBM.
  - Ringkasan jam operasional resmi PST (*Senin–Kamis 08.00–15.30 WIB*) dan tarif Rp 0.
  - Tombol aksi popup Lightbox: *Lihat Foto Gedung & Tim BPS* (2560px resolusi penuh).
- **Kartu Metrik Melayang (*Drift Tiles*)**:
  - Metrik 1: Lumbung Pangan (> 1.1 Juta Ton Padi) • *Sumber: BPS Jatim 2024*.
  - Metrik 2: Indeks Pembangunan Manusia (75.29 Kategori Tinggi) • *Sumber: BRS IPM BPS Lamongan*.
  - Metrik 3: Cakupan Wilayah (27 Kecamatan, 474 Desa) • *Kode Satker 3524*.

---

## 5. Pedoman Komponen & Aksesibilitas

1. **Aksesibilitas Keyboard & Fokus**:
   - Seluruh tombol dan tautan memiliki indikator fokus tampak jelas (`focus-visible:outline-2 focus-visible:outline-[#0266B3]`).
   - Modal popup dapat ditutup menggunakan tombol `Escape` maupun klik backdrop.
2. **Tanpa Data Fiktif (*Anti-Slop C-5 & R-17*)**:
   - Seluruh statistik, jam pelayanan, nomor kontak resmi (`0851-1138-3218`), dan tautan merujuk pada data dan portal resmi BPS.
3. **Bahasa Manusiawi (*Anti-Slop R-02*)**:
   - Bebas dari penggunaan karakter em dash (`—`) otomatis; digantikan dengan titik dua (`:`), tanda pisah standar, atau tanda kurung.
