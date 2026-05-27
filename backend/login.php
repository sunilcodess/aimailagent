<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "cold_email");

if (!$conn) {

    echo json_encode([
        "status" => "error",
        "message" => "Database Connection Failed"
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if (empty($email) || empty($password)) {

    echo json_encode([
        "status" => "error",
        "message" => "Email and Password are required"
    ]);

    exit;
}

$query = "SELECT * FROM users WHERE email='$email'";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {

    $user = mysqli_fetch_assoc($result);

    if (password_verify($password, $user["password"])) {

        echo json_encode([
            "status" => "success",
            "email" => $user["email"],
            "name" => $user["full_name"]
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => "Wrong Password"
        ]);
    }

} else {

    echo json_encode([
        "status" => "error",
        "message" => "User Not Found"
    ]);
}