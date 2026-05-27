<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data["token"])){

    echo json_encode([
        "status" => "success",
        "email" => "googleuser@gmail.com"
    ]);

}else{

    echo json_encode([
        "status" => "error"
    ]);

}

?>