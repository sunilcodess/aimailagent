<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "cold_email";

$conn = mysqli_connect($host,$user,$password,$database);
$conn = mysqli_connect("localhost", "root", "chatapp");

if(!$conn){
 echo json_encode([
 "status"=>"error",
 "message"=>"Connection failed: ".mysqli_connect_error()
 ]);
 exit;
}

?>