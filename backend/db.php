<?php
// backend/db.php

// --- Database Configuration ---
// Replace these with your actual database credentials.
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'civiclink');

// --- Establish Connection ---
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// --- Check Connection ---
if ($conn->connect_error) {
    // If connection fails, stop the script and display an error.
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Set the character set to utf8mb4 for full Unicode support.
$conn->set_charset("utf8mb4");

?>
