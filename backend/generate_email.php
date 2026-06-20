<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

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
$date = date("d-m-y");
$industry = htmlspecialchars($data['industry'] ?? '');

$userMode = htmlspecialchars($data['userMode'] ?? '');
$studentSubPurpose = htmlspecialchars($data['studentSubPurpose'] ?? '');
$leaveReason = htmlspecialchars($data['leaveReason'] ?? '');
$emailType = htmlspecialchars($data['emailType'] ?? '');
$startDate = htmlspecialchars($data['startDate'] ?? '');
$endDate = htmlspecialchars($data['endDate'] ?? '');

// ================= PROMPT =================
$prompt = "
Rules:

1. If Sub Purpose = Leave Application:
   - Generate a realistic leave application.
   - Mention the exact leave reason.
   - Mention leave duration if provided.
   - Use proper student or employee format.
   - Do not use generic placeholders like [Recipient's Name].
   - Use 'Respected Sir/Madam' if recipient is unknown.

2. For Student Leave Applications:
   - Write to school, college, university, principal, HOD, or teacher.
   - Mention academic context naturally.
   - Keep tone respectful.

3. Make every email unique and realistic.
   - Avoid generic AI phrases.
   - Do not write 'I hope this message finds you well'.

User Details:
Name: $name
Purpose: $purpose
User Mode: $userMode
Sub Purpose: $studentSubPurpose
Leave Reason: $leaveReason
Email Type: $emailType
Institution: $company
Course/Class: $role
Tone: $tone
Start Date: $startDate
End Date: $endDate

For Job Application:

- Write a professional job application email.
- Use the company name provided.
- Use the role/service provided.
- Mention the applicant name.
- Keep email between 150-250 words.
- Add a professional subject line.
- End with:

Best regards,
{Name}

Do not use placeholders like:
[Your Phone Number]
[Your Email Address]

Do not generate leave applications unless purpose is Leave Application.

For Job purpose, generate only a job application email.

Return only the final email.
";
// ================= OPENROUTER API =================
$url = "https://openrouter.ai/api/v1/chat/completions";
$postData = [
    "model" => "meta-llama/llama-3.2-3b-instruct",
    "messages" => [
        [
            "role" => "user",
            "content" => $prompt
        ]
    ],
    "max_tokens" => 800
];
// ================= CURL =================
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
$env = parse_ini_file(__DIR__ . '/../.env');
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

if (curl_errno($ch)) {
    echo json_encode([
        "success" => false,
        "error" => curl_error($ch)
    ]);
    exit;
}

curl_close($ch);

$result = json_decode($response, true);

// ================= RESPONSE =================

$emailContent = '';

if (
    isset($result['choices'][0]['message']['content']) &&
    !empty(trim($result['choices'][0]['message']['content']))
) {
    $emailContent = trim($result['choices'][0]['message']['content']);
}

if (!empty($emailContent)) {

    $tokensGenerated = $result['usage']['total_tokens'] ?? 0;

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
    exit;
}

echo json_encode([
    "success" => false,
    "error" => $result
]);
exit;