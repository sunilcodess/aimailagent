<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"));
$user_id = $data->user_id;
$title = "New Chat";

$conn->query("INSERT INTO chats (user_id, title) VALUES ($user_id, '$title')");
echo json_encode(["chat_id" => $conn->insert_id]);
?>