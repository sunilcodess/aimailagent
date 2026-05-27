<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"));
$user_id = $data->user_id;
$chat_id = $data->chat_id;
$message = $data->message;

// check plan
$user = $conn->query("SELECT plan FROM users WHERE id=$user_id")->fetch_assoc();

$usage = $conn->query("SELECT * FROM usage WHERE user_id=$user_id")->fetch_assoc();

$today = date("Y-m-d");

// reset daily
if($usage['last_reset'] != $today){
  $conn->query("UPDATE usage SET message_count=0, last_reset='$today' WHERE user_id=$user_id");
  $usage['message_count'] = 0;
}

// limit check
if($user['plan'] == "free" && $usage['message_count'] >= 20){
  echo json_encode(["error" => "limit"]);
  exit;
}

// save message
$conn->query("INSERT INTO messages (chat_id, sender, message) VALUES ($chat_id, 'user', '$message')");

// update usage
$conn->query("UPDATE usage SET message_count = message_count + 1 WHERE user_id=$user_id");

echo json_encode(["status" => "ok"]);
?>