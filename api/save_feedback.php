<?php
require_once 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if(!$data || empty($data['nama']) || empty($data['email']) || empty($data['pesan'])) {
        die(json_encode(["status" => "error", "message" => "Data tidak lengkap"]));
    }

    $stmt = $conn->prepare("INSERT INTO masukan_saran (nama, email_instansi, pesan) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $data['nama'], $data['email'], $data['pesan']);
    
    if($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Masukan berhasil dikirim"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal mengirim masukan"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
$conn->close();
?>
