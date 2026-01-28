function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function downloadMeme(memeId) {
    const card = document.querySelector(`[data-meme-id="${memeId}"]`);
    const img = card.querySelector('.meme-image img');
    
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `meme_${memeId}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Мемето е изтеглено! ⬇️');
}

function shareMeme(memeId) {
    const shareUrl = `${window.location.origin}/meme_project/frontend/view_meme.php?id=${memeId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Линкът е копиран! 🔗');
        
        if (confirm('Искате ли да споделите в социалните мрежи?')) {
            openShareDialog(shareUrl, memeId);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Грешка при копиране на линка ❌');
    });
}

function openShareDialog(url, memeId) {
    const shareText = 'Виж това меме от MEME FORGE!';
    
    const dialog = document.createElement('div');
    dialog.className = 'share-dialog';
    dialog.innerHTML = `
        <div class="share-dialog-content">
            <h3>Сподели в:</h3>
            <div class="share-buttons">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" 
                   target="_blank" class="share-btn facebook">
                    📘 Facebook
                </a>
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}" 
                   target="_blank" class="share-btn twitter">
                    🐦 Twitter
                </a>
                <a href="https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}" 
                   target="_blank" class="share-btn whatsapp">
                    💬 WhatsApp
                </a>
            </div>
            <button onclick="closeShareDialog()" class="btn-close">Затвори</button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    const style = document.createElement('style');
    style.textContent = `
        .share-dialog {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        }
        .share-dialog-content {
            background: #1e293b;
            padding: 30px;
            border-radius: 12px;
            border: 2px solid #00f0ff;
            max-width: 400px;
            text-align: center;
        }
        .share-dialog-content h3 {
            color: #00f0ff;
            margin-bottom: 20px;
            font-family: 'Orbitron', sans-serif;
        }
        .share-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }
        .share-btn {
            padding: 12px 20px;
            text-decoration: none;
            color: white;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .share-btn.facebook { background: #1877f2; }
        .share-btn.twitter { background: #1da1f2; }
        .share-btn.whatsapp { background: #25d366; }
        .share-btn:hover { transform: scale(1.05); }
        .btn-close {
            background: transparent;
            border: 2px solid #ff006e;
            color: #ff006e;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        .btn-close:hover {
            background: rgba(255, 0, 110, 0.2);
        }
    `;
    document.head.appendChild(style);
}

function closeShareDialog() {
    const dialog = document.querySelector('.share-dialog');
    if (dialog) {
        dialog.remove();
    }
}

function deleteMeme(memeId) {
    if (!confirm('Сигурни ли сте, че искате да изтриете това меме?')) {
        return;
    }
    
    fetch('delete_meme.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `meme_id=${memeId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const card = document.querySelector(`[data-meme-id="${memeId}"]`);
            card.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                card.remove();
                
                const remaining = document.querySelectorAll('.meme-card').length;
                if (remaining === 0) {
                    location.reload();
                }
            }, 300);
            
            showToast('Мемето е изтрито! 🗑️');
        } else {
            showToast('Грешка при изтриване ❌');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Грешка при свързване със сървъра ❌');
    });
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);