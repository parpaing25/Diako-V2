<?php
/**
 * API for group operations: create a group, join a group, list groups, and
 * retrieve posts within a group. Groups are stored in the `groups` table and
 * memberships in `group_members`. Posts within groups are stored in
 * `group_posts`. This API accepts JSON requests and returns JSON responses.
 */

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

// Determine the action: create, join, list, posts
$action = $_GET['action'] ?? '';

if ($action === 'create') {
    // Create a new group
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || empty($data['name']) || empty($data['creator_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing group name or creator']);
        exit;
    }
    $stmt = $pdo->prepare('INSERT INTO groups (name, description, creator_id, created_at) VALUES (:name, :description, :creator_id, NOW())');
    $stmt->execute([
        ':name' => $data['name'],
        ':description' => $data['description'] ?? '',
        ':creator_id' => $data['creator_id'],
    ]);
    $groupId = $pdo->lastInsertId();
    // Add creator as member
    $pdo->prepare('INSERT INTO group_members (group_id, user_id, joined_at) VALUES (:group_id, :user_id, NOW())')->execute([
        ':group_id' => $groupId,
        ':user_id' => $data['creator_id'],
    ]);
    echo json_encode(['success' => true, 'group_id' => $groupId]);
    exit;
}

if ($action === 'join') {
    // Join a group
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || empty($data['group_id']) || empty($data['user_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing group_id or user_id']);
        exit;
    }
    // Check if already a member
    $stmt = $pdo->prepare('SELECT id FROM group_members WHERE group_id = :group_id AND user_id = :user_id');
    $stmt->execute([':group_id' => $data['group_id'], ':user_id' => $data['user_id']]);
    if ($stmt->fetch()) {
        echo json_encode(['error' => 'Already a member']);
        exit;
    }
    $pdo->prepare('INSERT INTO group_members (group_id, user_id, joined_at) VALUES (:group_id, :user_id, NOW())')->execute([
        ':group_id' => $data['group_id'],
        ':user_id' => $data['user_id'],
    ]);
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'list') {
    // List groups the user belongs to or all groups
    $userId = $_GET['user_id'] ?? null;
    if ($userId) {
        $stmt = $pdo->prepare('SELECT g.* FROM groups g INNER JOIN group_members m ON g.id = m.group_id WHERE m.user_id = :user_id');
        $stmt->execute([':user_id' => $userId]);
    } else {
        $stmt = $pdo->query('SELECT * FROM groups');
    }
    $groups = $stmt->fetchAll();
    echo json_encode(['groups' => $groups]);
    exit;
}

if ($action === 'posts') {
    // Get posts within a group
    $groupId = $_GET['group_id'] ?? null;
    if (!$groupId) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing group_id']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT p.* FROM group_posts p WHERE p.group_id = :group_id ORDER BY p.created_at DESC');
    $stmt->execute([':group_id' => $groupId]);
    $posts = $stmt->fetchAll();
    echo json_encode(['posts' => $posts]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Invalid action']);