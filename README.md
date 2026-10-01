# SOTO — BPS Kabupaten Lamongan (Kanal 3524)
### Struktur File Modular (HTML, CSS, JS)

Proyek ini telah dipisahkan ke dalam modul-modul terstruktur agar rapi, mudah diedit, dan siap dikembangkan di IDE **Antigravity**.

---

## 📁 Struktur Direktori

```
soto-bps-lamongan/
├── index.html          # Markup terstruktur landing page & pemanggilan aset
├── css/
│   └── style.css       # Definisi tipografi kinetik, inset shadows, dan kelas animasi
├── js/
│   └── main.js         # Engine Three.js 3D, kinetika .wchar font weight, osilasi hero drift, dsb.
└── README.md           # Panduan penggunaan proyek
```

---

## 🌟 Fitur Utama

1. **Struktur Terpisah (Modular)**:
   - File CSS berada di `css/style.css` (bebas kustomisasi glow inset, animasi reveal, dll).
   - Seluruh interaksi JavaScript berada di `js/main.js` (Three.js 3D canvas, mouse proximity typography, observer, parallax bloom).
   - File `index.html` bersih dan terfokus pada konten semantik Satu Data Lamongan.

2. **Kinetika Tipografi SprintForge**:
   - Karakter tajuk (`H1`, `H2`) dibungkus dalam `.wchar` dinamis dengan interaktivitas jarak kursor mouse:
     $$\text{weight} = d < 200\text{px} \;?\; 600 + (1 - d / 200) \times 300 : 600$$
   - Aksen italic elegan menggunakan font **Instrument Serif**.

3. **Three.js 3D WebGL Mesh**:
   - Icosahedron flat-shaded melayang (`0xE34A32`) dengan reposisi responsif ($x = 4.5$ untuk desktop, $x = 0$ untuk mobile).

4. **Floating UI & Stacking Cards**:
   - Tiga kartu ringkasan hero mengambang dinamis dengan formula `Math.sin(t * 1.5 + i * 2) * 6`.
   - Tumpukan 5-lapisan rilis Berita Resmi Statistik (BRS) pada bagian Dark Mode.

---

## 🚀 Cara Menjalankan di Antigravity

1. Ekstrak file zip ini ke folder workspace Anda.
2. Buka folder proyek tersebut di **Antigravity**.
3. Buka `index.html` menggunakan fitur **Live Server** (klik kanan `index.html` -> *Open with Live Server*).
4. Selesai! Halaman akan langsung berjalan dengan lancar tanpa perlu menjalankan perintah `npm install`.
