<?php
include("config.php");
$keyId = "rzp_test_SYFTP1SXWQN77T";
$keySecret = "fGzFZ4q4RnqNKwwOOdYYkGCw";

$amount = 29900; // ₹299 (paise me)

$data = [
    "amount" => $amount,
    "currency" => "INR",
    "receipt" => "order_rcptid_11"
];

$ch = curl_init("https://api.razorpay.com/v1/orders");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, "$keyId:$keySecret");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>