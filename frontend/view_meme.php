<?php
require '../backend/db.php';
session_start();

// Get meme ID from URL
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: history.php");
    exit;
}

$meme_id = intval($_GET['id']);

try {
    $pdo = DB::getConnection();
    
    // Fetch the meme
    $stmt = $pdo->prepare("
        SELECT m.id, m.image_data, m.top_text, m.bottom_text, m.created_at, u.username 
        FROM meme_history m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
    ");
    $stmt->execute([$meme_id]);
    $meme = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$meme) {
        header("Location: history.php");
        exit;
    }
    
} catch (PDOException $e) {
    die('Database error: ' . $e->getMessage());
}

// Include the HTML template
include 'templates/view_meme.html';
?>