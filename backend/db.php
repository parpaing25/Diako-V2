<?php
// Database connection helper
// Update these credentials to match your o2switch MySQL database.

$host = 'localhost';        // e.g. localhost or 127.0.0.1
$dbname = 'diako_db';       // database name
$username = 'db_user';      // database username
$password = 'db_password';  // database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}