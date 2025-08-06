<?php
/*
 * Handle image uploads for posts, profiles, groups, events and other assets.
 * This script expects a multipart/form-data POST request with a file field
 * named `image` and optionally a `user_id` or `post_id` to associate the
 * uploaded image with a database entry. The image is stored in the
 * `uploads/` directory on the server, and a corresponding record is
 * inserted into the `images` table.
 *
 * Security considerations:
 * - Only allow specific MIME types (PNG, JPG, JPEG, GIF).
 * - Limit file size to prevent resource exhaustion.
 * - Generate a unique file name to avoid collisions.
 */

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

// Ensure the uploads directory exists
$uploadDir = __DIR__ . '/uploads';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

// Check if a file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No image uploaded or upload error']);
    exit;
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unsupported file type']);
    exit;
}

// Limit file size (e.g. 10 MB)
$maxSize = 10 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File size exceeds limit']);
    exit;
}

// Generate a unique file name
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$uniqueName = bin2hex(random_bytes(16)) . '.' . $ext;
$destination = $uploadDir . '/' . $uniqueName;

// Move the uploaded file
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file']);
    exit;
}

// Insert into database
$stmt = $pdo->prepare('INSERT INTO images (user_id, post_id, filename, created_at) VALUES (:user_id, :post_id, :filename, NOW())');
$stmt->execute([
    ':user_id' => $_POST['user_id'] ?? null,
    ':post_id' => $_POST['post_id'] ?? null,
    ':filename' => $uniqueName,
]);

echo json_encode(['success' => true, 'filename' => $uniqueName]);