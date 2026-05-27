<?php

header("Content-Type: application/json");

include "config.php";

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM history WHERE id=?");

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if($row = $result->fetch_assoc()){

  echo json_encode([
    "status" => "success",
    "chat" => $row
  ]);

}else{

  echo json_encode([
    "status" => "error"
  ]);
}
?>