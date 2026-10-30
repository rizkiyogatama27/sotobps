<?php
require_once 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validasi Sederhana Token Admin / Secret Header (jika ada)
    $authHeader = isset($_SERVER['HTTP_X_ADMIN_AUTH']) ? $_SERVER['HTTP_X_ADMIN_AUTH'] : '';
    $expectedSecret = getenv('ADMIN_SECRET') ?: 'bps_lamongan_3524';

    if ($authHeader !== $expectedSecret && !empty($expectedSecret)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Akses ditolak. Sesi tidak valid."]);
        exit();
    }

    $rawInput = file_get_contents("php://input");
    if (strlen($rawInput) > 10000) { // Batas payload 10KB
        http_response_code(413);
        echo json_encode(["status" => "error", "message" => "Ukuran payload terlalu besar."]);
        exit();
    }

    $data = json_decode($rawInput, true);
    if (!$data || !is_array($data)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Format data JSON tidak valid."]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE statistik_umum SET stat_value=?, stat_label1=?, stat_label2=?, stat_badge=? WHERE key_name=?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal menyiapkan query."]);
        exit();
    }

    // Fungsi bantuan sanitasi & update
    function updateStat($key, $val, $l1, $l2, $badge, $stmt) {
        $val = isset($val) ? substr(trim((string)$val), 0, 255) : '';
        $l1  = isset($l1) ? substr(trim((string)$l1), 0, 255) : '';
        $l2  = isset($l2) ? substr(trim((string)$l2), 0, 255) : '';
        $badge = isset($badge) ? substr(trim((string)$badge), 0, 255) : '';
        
        $stmt->bind_param("sssss", $val, $l1, $l2, $badge, $key);
        $stmt->execute();
    }

    if (isset($data['p1_val'])) updateStat('pill1', $data['p1_val'], $data['p1_l1'] ?? '', $data['p1_l2'] ?? '', $data['p1_badge'] ?? '', $stmt);
    if (isset($data['p2_val'])) updateStat('pill2', $data['p2_val'], $data['p2_l1'] ?? '', $data['p2_l2'] ?? '', $data['p2_badge'] ?? '', $stmt);
    if (isset($data['p3_val'])) updateStat('pill3', $data['p3_val'], $data['p3_l1'] ?? '', $data['p3_l2'] ?? '', $data['p3_badge'] ?? '', $stmt);
    
    if (isset($data['hero1_val'])) updateStat('hero1', $data['hero1_val'], $data['hero1_l1'] ?? '', '', '', $stmt);
    if (isset($data['hero2_val'])) updateStat('hero2', $data['hero2_val'], $data['hero2_l1'] ?? '', $data['hero2_sub'] ?? '', '', $stmt);
    if (isset($data['hero3_val'])) updateStat('hero3', $data['hero3_val'], $data['hero3_l1'] ?? '', '', '', $stmt);

    $stmt->close();
    echo json_encode(["status" => "success", "message" => "Data statistik berhasil diperbarui"]);
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode tidak diizinkan"]);
}
$conn->close();
?>
