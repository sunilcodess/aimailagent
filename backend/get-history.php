<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "config.php";

$user_email = $_GET['email'] ?? '';

$stmt = $conn->prepare(
    "SELECT * FROM history
     WHERE user_email = ?
     ORDER BY id DESC"
);

$stmt->bind_param("s", $user_email);

$stmt->execute();

$result = $stmt->get_result();

$history = [];

while($row = $result->fetch_assoc()){
    $history[] = $row;
}

echo json_encode($history);

?>