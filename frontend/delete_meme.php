<?php
require '../backend/db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

if (!isset($_POST['meme_id']) || empty($_POST['meme_id'])) {
    echo json_encode(['success' => false, 'error' => 'No meme ID provided']);
    exit;
}

try {
    $pdo = DB::getConnection();
    $user_id = $_SESSION['user_id'];
    $meme_id = intval($_POST['meme_id']);
    
    $stmt = $pdo->prepare("DELETE FROM meme_history WHERE id = ? AND user_id = ?");
    $stmt->execute([$meme_id, $user_id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Meme deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Meme not found or access denied']);
    }
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>