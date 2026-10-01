<?php
require_once 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if(!$data) {
        die(json_encode(["status" => "error", "message" => "Tidak ada data yang dikirim"]));
    }

    $stmt = $conn->prepare("UPDATE statistik_umum SET stat_value=?, stat_label1=?, stat_label2=?, stat_badge=? WHERE key_name=?");
    
    // Fungsi bantuan untuk update
    function updateStat($key, $val, $l1, $l2, $badge, $stmt) {
        $stmt->bind_param("sssss", $val, $l1, $l2, $badge, $key);
        $stmt->execute();
    }

    updateStat('pill1', $data['p1_val'], $data['p1_l1'], $data['p1_l2'], $data['p1_badge'], $stmt);
    updateStat('pill2', $data['p2_val'], $data['p2_l1'], $data['p2_l2'], $data['p2_badge'], $stmt);
    updateStat('pill3', $data['p3_val'], $data['p3_l1'], $data['p3_l2'], $data['p3_badge'], $stmt);
    
    updateStat('hero1', $data['hero1_val'], $data['hero1_l1'], '', '', $stmt);
    updateStat('hero2', $data['hero2_val'], $data['hero2_l1'], $data['hero2_sub'], '', $stmt);
    updateStat('hero3', $data['hero3_val'], $data['hero3_l1'], '', '', $stmt);

    echo json_encode(["status" => "success", "message" => "Data berhasil disimpan"]);
} else {
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
$conn->close();
?>
