<?php
// api/login.php
session_start();
header('Content-Type: application/json');

require '../backend/db.php';

// Get the posted data.
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Username and password are required.']);
    exit();
}

$username = $conn->real_escape_string($data->username);
$password = $data->password;

// --- Check Admins Table First ---
$stmt = $conn->prepare("SELECT id, username, password_hash, role, category FROM admins WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user_data = $result->fetch_assoc();
$user_type = 'admin';

// --- If not an admin, check Users Table ---
if (!$user_data) {
    $stmt->close(); // Close previous statement
    $stmt = $conn->prepare("SELECT id, username, password_hash FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user_data = $result->fetch_assoc();
    $user_type = 'user';
}

if ($user_data && password_verify($password, $user_data['password_hash'])) {
    // Password is correct, start the session
    $_SESSION['user_id'] = $user_data['id'];
    $_SESSION['username'] = $user_data['username'];
    $_SESSION['role'] = ($user_type === 'admin') ? $user_data['role'] : 'user';
    if ($user_type === 'admin') {
        $_SESSION['category'] = $user_data['category'];
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful.',
        'user' => [
            'username' => $_SESSION['username'],
            'role' => $_SESSION['role']
        ]
    ]);
} else {
    // Invalid credentials
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
}

$stmt->close();
$conn->close();
?>
