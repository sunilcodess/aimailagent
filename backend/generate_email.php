<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include("config.php");

// ================= USER DATA =================

$data = json_decode(file_get_contents("php://input"), true);

$userEmail = $data['email'] ?? '';

if (!$userEmail) {
    echo json_encode([
        "success" => false,
        "error" => "User email is required"
    ]);
    exit;
}

// ================= USER CHECK =================

$resultUser = mysqli_query(
    $conn,
    "SELECT tokens_used, plan, last_reset FROM users WHERE email='$userEmail'"
);

$user = mysqli_fetch_assoc($resultUser);

if (!$user) {
    echo json_encode([
        "success" => false,
        "error" => "User not found"
    ]);
    exit;
}

// ================= DAILY RESET =================

$today = date("Y-m-d");

if ($user['last_reset'] != $today) {

    mysqli_query(
        $conn,
        "UPDATE users 
         SET tokens_used = 0, last_reset = '$today' 
         WHERE email = '$userEmail'"
    );

    $user['tokens_used'] = 0;
}

// ================= TOKEN LIMIT =================

$tokensUsed = $user['tokens_used'];

$limit = ($user['plan'] == 'paid') ? 100000 : 10000;

if ($tokensUsed >= $limit) {

    echo json_encode([
        "success" => false,
        "error" => "Limit reached. Upgrade your plan."
    ]);

    exit;
}

// ================= EMAIL DATA =================

$name = htmlspecialchars($data['name'] ?? '');

$purpose = htmlspecialchars($data['purpose'] ?? '');

$tone = htmlspecialchars($data['tone'] ?? 'Professional');

$company = htmlspecialchars($data['company'] ?? '');

$role = htmlspecialchars($data['role'] ?? '');

// ================= PROMPT =================
$prompt = "
Return ONLY the final email.

Do NOT write:
- Here is the email
- Here is the job application
- Notes
- Explanations
- Placeholder text like [number]

Write a complete professional email.

Purpose: {$purpose}
Company: {$company}
Role: {$role}
Tone: {$tone}
Sender Name: {$name}
Date: {$date}
Industry: {$industry}


Rules:
- Human-like writing
- Professional formatting
- Include subject line
- Max 120 words
- Never use placeholders
- Never use [number]
- Never invent fake experience
";
// ================= OPENROUTER API =================

$url = "https://openrouter.ai/api/v1/chat/completions";

$postData = [
    "model" => "openai/gpt-oss-20b",

    "messages" => [
        [
            "role" => "user",
            "content" => $prompt
        ]
    ],

    "max_tokens" => 300
];

// ================= CURL =================

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_setopt($ch, CURLOPT_POST, true);

$env = parse_ini_file('.env');

$apiKey = $env['OPENAI_API_KEY'];


curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",

    //Api key
    "Authorization: Bearer $apiKey",

    "HTTP-Referer: http://localhost",

    "X-Title: Cold Email Generator"
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);

curl_close($ch);

$result = json_decode($response, true);


// ================= RESPONSE =================

if (isset($result['choices'][0]['message']['content'])) {

    $emailContent =
        trim($result['choices'][0]['message']['content']);

    $tokensGenerated =
        $result['usage']['total_tokens'] ?? 0;

    mysqli_query(
        $conn,
        "UPDATE users 
         SET tokens_used = tokens_used + $tokensGenerated 
         WHERE email = '$userEmail'"
    );

    echo json_encode([
        "success" => true,
        "email" => $emailContent
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => $result
    ]);
}
?>