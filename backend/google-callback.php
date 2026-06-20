<?php

header("Access-Control-Allow-Origin: *");

include("config.php");

session_start();

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

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));

    $response = curl_exec($ch);

    curl_close($ch);

    $data = json_decode($response, true);

    if (isset($data['access_token'])) {

        $info_url =
            "https://www.googleapis.com/oauth2/v1/userinfo?access_token="
            . $data['access_token'];

        $user_info =
            json_decode(file_get_contents($info_url), true);

        $email =
            mysqli_real_escape_string($conn, $user_info['email']);

        $name =
            mysqli_real_escape_string($conn, $user_info['name']);

        $check =
            mysqli_query(
                $conn,
                "SELECT * FROM users WHERE email='$email'"
            );

        if (mysqli_num_rows($check) == 0) {

            mysqli_query(
                $conn,
                INSERT INTO users
                (
                name,
                email,
                password,
                created_at,
                tokens_used,
                total_cost,
                plan,
                last_reset
                )

               VALUES
              (
             '$name',
             '$email',
             '$hashedPassword',
             'free',
             0,
             0,
             CURDATE()
             )
            );

            $user_id = mysqli_insert_id($conn);

        } else {

            $existing_user = mysqli_fetch_assoc($check);

            $user_id = $existing_user['id'];
        }

        $_SESSION['user_email'] = $email;

        $_SESSION['user_name'] = $name;

        $user_data = [
            "id" => $user_id,
            "email" => $email,
            "name" => $name
        ];

        $frontend_url =
            "http://localhost:5173/auth-success?user="
            . urlencode(json_encode($user_data));

        header("Location: " . $frontend_url);

        exit();

    } else {

        echo "Google Login Failed";
    }
}
?>