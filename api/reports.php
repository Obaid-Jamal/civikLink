<?php
// api/reports.php
session_start();
header('Content-Type: application/json');
require '../backend/db.php';

// --- Authentication Check ---
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'You must be logged in to perform this action.']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // --- Create a new Report ---
    $description = $_POST['description'] ?? '';
    $category = $_POST['category'] ?? '';
    $priority = $_POST['priority'] ?? '';
    $location_text = $_POST['location'] ?? '';
    $latitude = $_POST['lat'] ?? null;
    $longitude = $_POST['lng'] ?? null;

    if (empty($description) || empty($category) || empty($priority) || empty($location_text)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required report data.']);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare(
        "INSERT INTO reports (user_id, description, category, priority, location_text, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("isssssd", $user_id, $description, $category, $priority, $location_text, $latitude, $longitude);

    if ($stmt->execute()) {
        $report_id = $stmt->insert_id;
        // Handle photo uploads here if needed
        echo json_encode(['status' => 'success', 'message' => 'Report submitted successfully!', 'report_id' => $report_id]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save report.']);
    }
    $stmt->close();

} elseif ($method === 'GET') {
    // --- Fetch Reports ---
    $reports = [];
    $sql = "";

    if ($_SESSION['role'] === 'user') {
        // Citizen gets their own reports
        $sql = "SELECT r.*, u.username FROM reports r JOIN users u ON r.user_id = u.id WHERE r.user_id = ? ORDER BY r.date_submitted DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $_SESSION['user_id']);
    } else { // Admin or Main Admin
        if ($_SESSION['role'] === 'main_admin') {
            // Main admin gets all reports
             $sql = "SELECT r.*, u.username FROM reports r JOIN users u ON r.user_id = u.id ORDER BY r.date_submitted DESC";
             $stmt = $conn->prepare($sql);
        } else {
            // Department admin gets reports of their category
            $sql = "SELECT r.*, u.username FROM reports r JOIN users u ON r.user_id = u.id WHERE r.category = ? ORDER BY r.date_submitted DESC";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $_SESSION['category']);
        }
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    while($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }
    $stmt->close();

    echo json_encode($reports);
}

$conn->close();
?>
