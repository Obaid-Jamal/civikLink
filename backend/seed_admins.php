<?php
// backend/seed_admins.php

// This script populates the 'admins' table with the initial set of admin users.
// It should only be run once during the initial setup.

// Include the database connection file.
// The 'require' statement will stop the script if the db.php file can't be found.
require 'db.php';

echo "Seeding admin data...\n";

// Array of admin users to be inserted. This data was originally from the script.js file.
$admins = [
    [
        'username' => 'admin_roads', 'password' => 'password', 'email' => 'roads@civiclink.com',
        'first_name' => 'Dept.', 'last_name' => 'Roads', 'phone' => '1111111111',
        'role' => 'admin', 'category' => 'roads', 'created_at' => '2024-01-01'
    ],
    [
        'username' => 'admin_lighting', 'password' => 'password', 'email' => 'lighting@civiclink.com',
        'first_name' => 'Dept.', 'last_name' => 'Lighting', 'phone' => '2222222222',
        'role' => 'admin', 'category' => 'lighting', 'created_at' => '2024-01-01'
    ],
    [
        'username' => 'admin_water', 'password' => 'password', 'email' => 'water@civiclink.com',
        'first_name' => 'Dept.', 'last_name' => 'Water', 'phone' => '3333333333',
        'role' => 'admin', 'category' => 'water', 'created_at' => '2024-01-01'
    ],
    [
        'username' => 'admin_waste', 'password' => 'password', 'email' => 'waste@civiclink.com',
        'first_name' => 'Dept.', 'last_name' => 'Waste', 'phone' => '4444444444',
        'role' => 'admin', 'category' => 'waste', 'created_at' => '2024-01-01'
    ],
    [
        'username' => 'admin_safety', 'password' => 'password', 'email' => 'safety@civiclink.com',
        'first_name' => 'Dept.', 'last_name' => 'Safety', 'phone' => '5555555555',
        'role' => 'admin', 'category' => 'safety', 'created_at' => '2024-01-01'
    ],
    [
        'username' => 'main_admin', 'password' => 'password', 'email' => 'main@civiclink.com',
        'first_name' => 'Main', 'last_name' => 'Admin', 'phone' => '9999999999',
        'role' => 'main_admin', 'category' => 'all', 'created_at' => '2024-01-01'
    ]
];

// SQL statement to insert a new admin. Using prepared statements to prevent SQL injection.
// This is the line that has been corrected.
$sql = "INSERT INTO admins (username, password_hash, email, first_name, last_name, phone, role, category, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Error preparing statement: " . $conn->error);
}

// Loop through each admin in the array and insert them into the database.
foreach ($admins as $admin) {
    // Hash the plain-text password securely using BCRYPT.
    $password_hash = password_hash($admin['password'], PASSWORD_BCRYPT);

    // Bind the parameters to the SQL statement. 's' denotes a string type.
    $stmt->bind_param(
        "sssssssss",
        $admin['username'],
        $password_hash,
        $admin['email'],
        $admin['first_name'],
        $admin['last_name'],
        $admin['phone'],
        $admin['role'],
        $admin['category'],
        $admin['created_at']
    );

    // Execute the statement and check for success or failure.
    if ($stmt->execute()) {
        echo "Successfully seeded admin: " . $admin['username'] . "\n";
    } else {
        echo "Error seeding admin " . $admin['username'] . ": " . $stmt->error . "\n";
    }
}

// Close the statement and the database connection.
$stmt->close();
$conn->close();

echo "Admin seeding complete.\n";

?>

