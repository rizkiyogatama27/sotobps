<?php
require_once 'koneksi.php';

$sql = "SELECT * FROM masukan_saran ORDER BY tanggal DESC";
$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode(["status" => "success", "data" => $data]);
$conn->close();
?>
