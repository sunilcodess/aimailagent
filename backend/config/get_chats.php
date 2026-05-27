<?php
include "db.php";

$user_id = $_GET['user_id'];
$result = $conn->query("SELECT * FROM chats WHERE user_id=$user_id ORDER BY id DESC");

$chats = [];
while($row = $result->fetch_assoc()){
  $chats[] = $row;
}
echo json_encode($chats);
?>