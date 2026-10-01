<?php
require_once 'koneksi.php';

$sql = "SELECT key_name, stat_value, stat_label1, stat_label2, stat_badge FROM statistik_umum";
$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $key = $row['key_name'];
        // Format to match JS expectactions (e.g., p1_val)
        if (strpos($key, 'pill') === 0) {
            $num = substr($key, 4);
            $data["p{$num}_val"] = $row['stat_value'];
            $data["p{$num}_l1"] = $row['stat_label1'];
            $data["p{$num}_l2"] = $row['stat_label2'];
            $data["p{$num}_badge"] = $row['stat_badge'];
        } else if (strpos($key, 'hero') === 0) {
            $num = substr($key, 4);
            $data["hero{$num}_val"] = $row['stat_value'];
            $data["hero{$num}_l1"] = $row['stat_label1'];
            if ($num == 2) {
                $data["hero2_sub"] = $row['stat_label2'];
            }
        }
    }
}

echo json_encode(["status" => "success", "data" => $data]);
$conn->close();
?>
