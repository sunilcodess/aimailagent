<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include("config.php");

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if (empty($email) || empty($password)) {

    echo json_encode([
        "status" => "error",
        "message" => "Email and Password required"
    ]);

    exit;
}

$result = mysqli_query(
    $conn,
    "SELECT * FROM users WHERE email='$email'"
);

if (mysqli_num_rows($result) == 0) {

    echo json_encode([
        "status" => "error",
        "message" => "User not found"
    ]);

    exit;
}

$user = mysqli_fetch_assoc($result);

if (password_verify($password, $user["password"])) {

    echo json_encode([
        "status" => "success",
        "email" => $user["email"],
        "name" => $user["name"]
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Invalid password"
    ]);
}
?>