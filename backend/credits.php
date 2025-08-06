<?php
/**
 * API to manage user credits: add, subtract and retrieve credit balance.
 * Credits are stored in the `users` table. When adding or deducting
 * credits, an entry is also recorded in the `credit_transactions` table
 * for audit purposes.
 */

require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'get') {
    $userId = $_GET['user_id'] ?? null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing user_id']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT credits FROM users WHERE id = :id');
    $stmt->execute([':id' => $userId]);
    $credits = $stmt->fetchColumn();
    echo json_encode(['credits' => (int)$credits]);
    exit;
}

if ($action === 'add' || $action === 'subtract') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || empty($data['user_id']) || !isset($data['amount'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing user_id or amount']);
        exit;
    }
    $amount = (int)$data['amount'];
    if ($action === 'subtract') {
        $amount = -abs($amount);
    }
    // Update user's credits
    $stmt = $pdo->prepare('UPDATE users SET credits = credits + :amount WHERE id = :id');
    $stmt->execute([
        ':amount' => $amount,
        ':id' => $data['user_id'],
    ]);
    // Log transaction
    $pdo->prepare('INSERT INTO credit_transactions (user_id, amount, reason, created_at) VALUES (:user_id, :amount, :reason, NOW())')->execute([
        ':user_id' => $data['user_id'],
        ':amount' => $amount,
        ':reason' => $data['reason'] ?? '',
    ]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Invalid action']);