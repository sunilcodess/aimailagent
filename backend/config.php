<?php

$env = parse_ini_file(__DIR__ . '/../.env');

$apiKey = $env['OPENAI_API_KEY'];

$google_client_id = $env['GOOGLE_CLIENT_ID'];

$google_client_secret = $env['GOOGLE_CLIENT_SECRET'];

?>