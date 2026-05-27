<?php
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "cold_email");

$email = $_GET['email'];

$result = mysqli_query($conn, "SELECT tokens_used, plan FROM users WHERE email='$email'");
$user = mysqli_fetch_assoc($result);

echo json_encode([
    "tokens_used" => $user['tokens_used'],
    "plan" => $user['plan']
]);
?>