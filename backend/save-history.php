<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_email = $data['user_email'] ?? '';
$prompt = $data['prompt'] ?? '';
$generated_email = $data['generated_email'] ?? '';

if($user_email && $generated_email){

    $stmt = $conn->prepare(
        "INSERT INTO history (user_email, prompt, generated_email)
         VALUES (?, ?, ?)"
    );

    $stmt->bind_param(
        "sss",
        $user_email,
        $prompt,
        $generated_email
    );

    if($stmt->execute()){

        echo json_encode([
            "status" => "success"
        ]);

    }else{

        echo json_encode([
            "status" => "error"
        ]);
    }

}else{

    echo json_encode([
        "status" => "empty"
    ]);
}
?>