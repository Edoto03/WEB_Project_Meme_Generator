<?php
require '../backend/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$pdo = DB::getConnection();
$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();
$username = $user ? $user['username'] : $_SESSION['username'];

$stmt = $pdo->prepare("
    SELECT id, image_data, top_text, bottom_text, template_url, created_at 
    FROM meme_history 
    WHERE user_id = ? 
    ORDER BY created_at DESC
");
$stmt->execute([$user_id]);
$memes = $stmt->fetchAll(PDO::FETCH_ASSOC);

$total_memes = count($memes);

include 'templates/history.html';
?>