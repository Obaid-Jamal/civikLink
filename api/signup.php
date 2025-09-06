<?php
// api/signup.php
header('Content-Type: application/json');
require '../backend/db.php';

$data = json_decode(file_get_contents("php://input"));

// --- Basic Validation ---
$required_fields = ['firstName', 'lastName', 'email', 'phone', 'aadhar', 'district', 'location', 'username', 'password'];
foreach ($required_fields as $field) {
    if (!isset($data->$field) || empty($data->$field)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => "Please fill all fields. Missing: $field"]);
        exit();
    }
}

if (strlen($data->password) < 6) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters.']);
    exit();
}

// --- Check for existing user ---
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $data->username, $data->email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['status' => 'error', 'message' => 'Username or email already exists.']);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// --- Create new user ---
$password_hash = password_hash($data->password, PASSWORD_BCRYPT);
$registration_date = date('Y-m-d');

$stmt = $conn->prepare(
    "INSERT INTO users (first_name, last_name, email, phone, aadhar, district, default_location, username, password_hash, registration_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param(
    "ssssssssss",
    $data->firstName,
    $data->lastName,
    $data->email,
    $data->phone,
    $data->aadhar,
    $data->district,
    $data->location,
    $data->username,
    $password_hash,
    $registration_date
);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Registration successful! You can now log in.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An error occurred during registration.']);
}

$stmt->close();
$conn->close();
?>
