<?php
require '../backend/db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

if (!isset($_POST['image_data']) || empty($_POST['image_data'])) {
    echo json_encode(['success' => false, 'error' => 'No image data']);
    exit;
}

try {
    $pdo = DB::getConnection();
    
    $user_id = $_SESSION['user_id'];
    $image_data = $_POST['image_data']; 
    $top_text = isset($_POST['top_text']) ? trim($_POST['top_text']) : '';
    $bottom_text = isset($_POST['bottom_text']) ? trim($_POST['bottom_text']) : '';
    $template_url = isset($_POST['template_url']) ? trim($_POST['template_url']) : null;
    
    $stmt = $pdo->prepare("
        INSERT INTO meme_history (user_id, image_data, top_text, bottom_text, template_url) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([$user_id, $image_data, $top_text, $bottom_text, $template_url]);
    
    $meme_id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Meme saved successfully!',
        'meme_id' => $meme_id
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>