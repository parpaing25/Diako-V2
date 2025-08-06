<?php
/**
 * API for event operations: create an event, join/leave an event,
 * list all events, and retrieve attendees. Events are stored in the
 * `events` table and attendees in `event_participants`. This API accepts
 * JSON requests and returns JSON responses.
 */

require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'create') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || empty($data['name']) || empty($data['creator_id']) || empty($data['start_time'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }
    $stmt = $pdo->prepare('INSERT INTO events (name, description, location, start_time, end_time, creator_id, created_at) VALUES (:name, :description, :location, :start_time, :end_time, :creator_id, NOW())');
    $stmt->execute([
        ':name' => $data['name'],
        ':description' => $data['description'] ?? '',
        ':location' => $data['location'] ?? '',
        ':start_time' => $data['start_time'],
        ':end_time' => $data['end_time'] ?? null,
        ':creator_id' => $data['creator_id'],
    ]);
    $eventId = $pdo->lastInsertId();
    // Add creator as participant
    $pdo->prepare('INSERT INTO event_participants (event_id, user_id, joined_at) VALUES (:event_id, :user_id, NOW())')->execute([
        ':event_id' => $eventId,
        ':user_id' => $data['creator_id'],
    ]);
    echo json_encode(['success' => true, 'event_id' => $eventId]);
    exit;
}

if ($action === 'join') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || empty($data['event_id']) || empty($data['user_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing event_id or user_id']);
        exit;
    }
    // Avoid duplicate participation
    $stmt = $pdo->prepare('SELECT id FROM event_participants WHERE event_id = :event_id AND user_id = :user_id');
    $stmt->execute([':event_id' => $data['event_id'], ':user_id' => $data['user_id']]);
    if ($stmt->fetch()) {
        echo json_encode(['error' => 'Already participating']);
        exit;
    }
    $pdo->prepare('INSERT INTO event_participants (event_id, user_id, joined_at) VALUES (:event_id, :user_id, NOW())')->execute([
        ':event_id' => $data['event_id'],
        ':user_id' => $data['user_id'],
    ]);
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'list') {
    $stmt = $pdo->query('SELECT * FROM events ORDER BY start_time DESC');
    $events = $stmt->fetchAll();
    echo json_encode(['events' => $events]);
    exit;
}

if ($action === 'attendees') {
    $eventId = $_GET['event_id'] ?? null;
    if (!$eventId) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing event_id']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT user_id FROM event_participants WHERE event_id = :event_id');
    $stmt->execute([':event_id' => $eventId]);
    $participants = $stmt->fetchAll();
    echo json_encode(['participants' => $participants]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Invalid action']);