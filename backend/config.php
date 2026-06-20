<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

$env = parse_ini_file(__DIR__ . '/../.env');

$apiKey = $env['OPENAI_API_KEY'];

$client_id = $env['GOOGLE_CLIENT_ID'];

$client_secret = $env['GOOGLE_CLIENT_SECRET'];

$redirect_uri = "http://localhost/leavecraft/backend/google-callback.php";

define("RAZORPAY_KEY_ID", $env['RAZORPAY_KEY_ID']);

define("RAZORPAY_SECRET", $env['RAZORPAY_SECRET']);

$conn = mysqli_connect("localhost", "root", "", "cold_email");

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>