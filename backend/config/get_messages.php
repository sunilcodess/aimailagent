<?php
include "db.php";

$chat_id = $_GET['chat_id'];
$result = $conn->query("SELECT * FROM messages WHERE chat_id=$chat_id");

$msgs = [];
while($row = $result->fetch_assoc()){
  $msgs[] = $row;
}
echo json_encode($msgs);
?>