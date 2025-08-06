<?php
/**
 * Endpoint to log simple analytics events. This API accepts POST
 * requests with an `event` name and optional metadata. Events are
 * stored in the `analytics` table. You can extend this to record
 * user actions such as posts created, groups joined, etc.
 */

require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || empty($data['event'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing event name']);
    exit;
}

$stmt = $pdo->prepare('INSERT INTO analytics (event_name, user_id, metadata, created_at) VALUES (:event_name, :user_id, :metadata, NOW())');
$stmt->execute([
    ':event_name' => $data['event'],
    ':user_id' => $data['user_id'] ?? null,
    ':metadata' => isset($data['metadata']) ? json_encode($data['metadata']) : null,
]);

echo json_encode(['success' => true]);