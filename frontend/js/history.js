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
    const pathParts = window.location.pathname.split('/');
    const projectIndex = pathParts.findIndex(part => part.includes('WEB_Project') || part === 'frontend');
    const basePath = pathParts.slice(0, projectIndex + 2).join('/'); // includes project/frontend
    const shareUrl = `${window.location.origin}${basePath}/view_meme.php?id=${memeId}`;
    
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
            showToast('Линкът е копиран в клипборда!');
        } catch (err) {
            showToast('Грешка при копиране на линка');
        }
        document.body.removeChild(textArea);
    });
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