<?php
/**
 * Endpoint to handle account verification via national ID (CIN). The client
 * submits basic details and optionally uploads a scanned image of the ID.
 * On the server, this script records the verification request and stores
 * the uploaded file. In a production system, this would integrate with
 * a verification service or manual review; here it simply marks the
 * account as pending verification.
 */

require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Validate inputs
$userId = $_POST['user_id'] ?? null;
$cinNumber = $_POST['cin_number'] ?? null;
if (!$userId || !$cinNumber) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user_id or cin_number']);
    exit;
}

// Handle optional ID scan upload
$scanFilename = null;
if (isset($_FILES['cin_scan']) && $_FILES['cin_scan']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['cin_scan'];
    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!in_array($file['type'], $allowed)) {
        http_response_code(400);
        echo json_encode(['error' => 'Unsupported scan file type']);
        exit;
    }
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $scanFilename = bin2hex(random_bytes(16)) . '.' . $ext;
    $destination = __DIR__ . '/uploads/' . $scanFilename;
    move_uploaded_file($file['tmp_name'], $destination);
}

// Insert verification request
$stmt = $pdo->prepare('INSERT INTO verifications (user_id, cin_number, scan_file, status, created_at) VALUES (:user_id, :cin_number, :scan_file, :status, NOW())');
$stmt->execute([
    ':user_id' => $userId,
    ':cin_number' => $cinNumber,
    ':scan_file' => $scanFilename,
    ':status' => 'pending',
]);

echo json_encode(['success' => true]);