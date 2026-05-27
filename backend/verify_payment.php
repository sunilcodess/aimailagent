<?php
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];

$conn = mysqli_connect("localhost", "root", "", "cold_email");

// user ko paid bana do
mysqli_query($conn, "UPDATE users SET plan='paid', tokens_used=0 WHERE email='$email'");

echo json_encode(["success" => true]);
?>