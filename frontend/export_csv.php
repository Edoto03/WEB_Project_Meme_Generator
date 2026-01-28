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
$username = $user ? $user['username'] : 'user';

$stmt = $pdo->prepare("
    SELECT id, top_text, bottom_text, template_url, created_at 
    FROM meme_history 
    WHERE user_id = ? 
    ORDER BY created_at DESC
");
$stmt->execute([$user_id]);
$memes = $stmt->fetchAll(PDO::FETCH_ASSOC);

$filename = "meme_history_{$username}_" . date('Y-m-d_His') . ".csv";
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w');

fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

fputcsv($output, ['ID', 'Top Text', 'Bottom Text', 'Template URL', 'Created Date']);

foreach ($memes as $meme) {
    fputcsv($output, [
        $meme['id'],
        $meme['top_text'],
        $meme['bottom_text'],
        $meme['template_url'] ?? 'Custom Upload',
        $meme['created_at']
    ]);
}

fclose($output);
exit;
?>