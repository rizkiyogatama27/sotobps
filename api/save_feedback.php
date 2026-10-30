<?php
require_once 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Batas payload input (Maks 5KB untuk pesan masukan)
    $rawInput = file_get_contents("php://input");
    if (strlen($rawInput) > 5000) {
        http_response_code(413);
        echo json_encode(["status" => "error", "message" => "Pesan terlalu panjang."]);
        exit();
    }

    $data = json_decode($rawInput, true);
    
    if (!$data || !is_array($data)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Format JSON tidak valid."]);
        exit();
    }

    // Sanitasi input
    $nama  = isset($data['nama']) ? trim(strip_tags((string)$data['nama'])) : '';
    $email = isset($data['email']) ? trim(filter_var((string)$data['email'], FILTER_SANITIZE_EMAIL)) : '';
    $pesan = isset($data['pesan']) ? trim(strip_tags((string)$data['pesan'])) : '';

    // Validasi kelengkapan & format
    if (empty($nama) || empty($email) || empty($pesan)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Semua kolom wajib diisi."]);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Format email/instansi tidak valid."]);
        exit();
    }

    // Pemotongan panjang maksimum sesuai skema DB
    $nama  = substr($nama, 0, 150);
    $email = substr($email, 0, 150);
    $pesan = substr($pesan, 0, 2000);

    $stmt = $conn->prepare("INSERT INTO masukan_saran (nama, email_instansi, pesan) VALUES (?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal memproses permintaan."]);
        exit();
    }

    $stmt->bind_param("sss", $nama, $email, $pesan);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Terima kasih, masukan Anda berhasil dikirim."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan masukan ke sistem."]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode tidak diizinkan."]);
}
$conn->close();
?>
