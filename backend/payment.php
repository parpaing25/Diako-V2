<?php
/**
 * Simulated payment processing for Mobile Money services in Madagascar.
 * This endpoint expects a POST request containing user_id, amount, and
 * service (orange, mvola, airtel). In a production environment you
 * would integrate with the respective payment APIs (Orange Money,
 * Mvola, Airtel Money). Here we simply mark the payment as successful
 * and optionally award credits.
 */

require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || empty($data['user_id']) || empty($data['amount']) || empty($data['service'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

// Accept only supported services
$service = strtolower($data['service']);
if (!in_array($service, ['orange', 'mvola', 'airtel'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Unsupported service']);
    exit;
}

// In a real implementation, call the payment gateway API here and handle
// success/failure accordingly. We'll assume success and award credits
// equal to the amount for demonstration purposes.
$amount = floatval($data['amount']);
if ($amount <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amount']);
    exit;
}

// Update the user's credits.  In the client UI 1 credit is displayed as
// equivalent to 5 Ariary, so we convert the paid amount (in Ariary) to
// credits by dividing by 5 and rounding down.  For example a payment
// of 10 000 Ar will yield 2 000 credits.  This prevents users from
// receiving fractional credits.
$credits = (int) floor($amount / 5);
if ($credits > 0) {
    $pdo->prepare('UPDATE users SET credits = credits + :credits WHERE id = :id')->execute([
        ':credits' => $credits,
        ':id' => $data['user_id'],
    ]);
}

// Log payment
$pdo->prepare('INSERT INTO payments (user_id, amount, service, status, created_at) VALUES (:user_id, :amount, :service, :status, NOW())')->execute([
    ':user_id' => $data['user_id'],
    ':amount' => $amount,
    ':service' => $service,
    ':status' => 'success',
]);

echo json_encode(['success' => true]);