-- Struktur Database SOTO BPS
CREATE DATABASE IF NOT EXISTS sotobps;
USE sotobps;

-- 1. Tabel Statistik Vital & Hero
CREATE TABLE IF NOT EXISTS `statistik_umum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_name` varchar(50) NOT NULL,
  `stat_value` varchar(255) DEFAULT NULL,
  `stat_label1` varchar(255) DEFAULT NULL,
  `stat_label2` varchar(255) DEFAULT NULL,
  `stat_badge` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Awal untuk Statistik (Default)
INSERT IGNORE INTO `statistik_umum` (`key_name`, `stat_value`, `stat_label1`, `stat_label2`, `stat_badge`) VALUES
('hero1', '> 1.1 Juta Ton Padi', 'Lumbung Pangan Utama Jatim', '', ''),
('hero2', '75.29', 'Indeks Pembangunan Manusia', '(Kategori Tinggi)', ''),
('hero3', '27 Kecamatan • 474 Desa', 'Cakupan Wilayah Lamongan', '', ''),
('pill1', '1.38', 'Juta Jiwa', 'Jumlah Penduduk Terdata', 'SP2020 Sensus'),
('pill2', '4.68%', 'Laju PDRB', 'Pertumbuhan Ekonomi Positif', 'ADHK Kontinu'),
('pill3', '100%', 'Terverifikasi', 'Metadata Standar SDI', 'ISO/SNI 2026');

-- 2. Tabel Masukan & Saran (Partisipasi Publik)
CREATE TABLE IF NOT EXISTS `masukan_saran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(150) NOT NULL,
  `email_instansi` varchar(150) NOT NULL,
  `pesan` text NOT NULL,
  `tanggal` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Permintaan Data (Mockup)
CREATE TABLE IF NOT EXISTS `permintaan_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_pemohon` varchar(150) NOT NULL,
  `instansi` varchar(150) NOT NULL,
  `topik_data` varchar(200) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Menunggu',
  `tanggal` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
