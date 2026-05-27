<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include("config.php");
session_start(); // Session chalu karein taaki user logged-in rahe

if (isset($_GET['code'])) {
    $code = $_GET['code'];
    
    $params = [
        'code' => $code,
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'grant_type' => 'authorization_code'
    ];

    $ch = curl_init("https://oauth2.googleapis.com/token");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);

    if (isset($data['access_token'])) {
        $info_url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" . $data['access_token'];
        $user_info = json_decode(file_get_contents($info_url), true);

        $email = mysqli_real_escape_string($conn, $user_info['email']);
        $name = mysqli_real_escape_string($conn, $user_info['name']);
        
        // 1. Check user in DB
        $check = mysqli_query($conn, "SELECT id, email, name FROM users WHERE email='$email'");
        
        if(mysqli_num_rows($check) == 0) {
            // Naya user banayein
            mysqli_query($conn, "INSERT INTO users (name, email, plan) VALUES ('$name', '$email', 'free')");
            $user_id = mysqli_insert_id($conn);
        } else {
            $existing_user = mysqli_fetch_assoc($check);
            $user_id = $existing_user['id'];
        }

        // 2. React ke liye session data taiyaar karein
        $user_data = [
            "id" => $user_id,
            "email" => $email,
            "name" => $name
        ];

        // 3. User ko wapas React app (Dashboard) par bhejein
        // Hum data ko URL parameters mein bhej rahe hain taaki React use save kar sake
        $frontend_url = "http://localhost:5173/auth-success?user=" . urlencode(json_encode($user_data));
        header("Location: " . $frontend_url);
        exit();

    } else {
        echo "Token mismatch or expired.";
    }
}
?>