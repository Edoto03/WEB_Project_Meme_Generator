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
?>
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Меме от <?php echo htmlspecialchars($meme['username']); ?> - MEME FORGE</title>
    <link rel="stylesheet" href="./css/view_meme.css">
</head>
<body>
    <nav class="top-nav">
        <div class="nav-buttons">
            <?php if (isset($_SESSION['user_id'])): ?>
                <a href="welcome.php">⬅ НАЧАЛО</a>
                <a href="meme_generator.php">⚡ ГЕНЕРАТОР</a>
                <a href="history.php">📜 ИСТОРИЯ</a>
                <a href="logout.php">◆ ИЗХОД</a>
            <?php else: ?>
                <a href="index.php">⬅ НАЧАЛО</a>
                <a href="login.php">▶ ВЛИЗАНЕ</a>
                <a href="register.php">◆ РЕГИСТРАЦИЯ</a>
            <?php endif; ?>
        </div>
    </nav>

    <div class="container">
        <div class="meme-display">
            <div class="meme-header">
                <h1>📸 СПОДЕЛЕНО МЕМЕ</h1>
                <p class="creator">Създадено от: <strong><?php echo htmlspecialchars($meme['username']); ?></strong></p>
                <p class="date">📅 <?php echo date('d.m.Y H:i', strtotime($meme['created_at'])); ?></p>
            </div>
            
            <div class="meme-image-container">
                <img src="<?php echo htmlspecialchars($meme['image_data']); ?>" alt="Meme" id="memeImage">
            </div>
            
            <?php if (!empty($meme['top_text']) || !empty($meme['bottom_text'])): ?>
                <div class="meme-info">
                    <?php if (!empty($meme['top_text'])): ?>
                        <p><strong>Горен текст:</strong> <?php echo htmlspecialchars($meme['top_text']); ?></p>
                    <?php endif; ?>
                    <?php if (!empty($meme['bottom_text'])): ?>
                        <p><strong>Долен текст:</strong> <?php echo htmlspecialchars($meme['bottom_text']); ?></p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <div class="action-buttons">
                <button class="btn btn-download" onclick="downloadMeme()">
                    <span>⬇</span>
                    <span>ИЗТЕГЛИ</span>
                </button>
                <button class="btn btn-share" onclick="copyShareLink()">
                    <span>🔗</span>
                    <span>КОПИРАЙ ЛИНК</span>
                </button>
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="meme_generator.php" class="btn btn-create">
                        <span>⚡</span>
                        <span>СЪЗДАЙ СВОЕ</span>
                    </a>
                <?php else: ?>
                    <a href="register.php" class="btn btn-create">
                        <span>◆</span>
                        <span>РЕГИСТРИРАЙ СЕ</span>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="toast"></div>

    <script>
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        function downloadMeme() {
            const img = document.getElementById('memeImage');
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `meme_<?php echo $meme_id; ?>_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('Мемето е изтеглено! ⬇️');
        }

        function copyShareLink() {
            const shareUrl = window.location.href;
            
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast('Линкът е копиран в клипборда! 🔗');
            }).catch(err => {
                console.error('Failed to copy:', err);
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast('Линкът е копиран в клипборда! 🔗');
                } catch (err) {
                    showToast('Грешка при копиране на линка ❌');
                }
                document.body.removeChild(textArea);
            });
        }
    </script>
</body>
</html>