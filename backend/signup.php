<?php

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

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if (empty($name) || empty($email) || empty($password)) {

    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);

    exit;
}

$checkQuery = "SELECT * FROM users WHERE email='$email'";

$checkResult = mysqli_query($conn, $checkQuery);

if (mysqli_num_rows($checkResult) > 0) {

    echo json_encode([
        "status" => "error",
        "message" => "Email already exists"
    ]);

    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$insertQuery = "INSERT INTO users(full_name, email, password)
VALUES('$fullName', '$email', '$hashedPassword')";

$result = mysqli_query($conn, $insertQuery);

if ($result) {

    echo json_encode([
        "status" => "success",
        "message" => "Account Created Successfully"
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Signup Failed"
    ]);
}