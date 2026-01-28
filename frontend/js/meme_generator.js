const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const topTextInput = document.getElementById('top_text');
const bottomTextInput = document.getElementById('bottom_text');
const fileInput = document.getElementById('upload');
const downloadButton = document.getElementById('downloadButton');
const saveButton = document.getElementById('saveButton');

const topColorInput = document.getElementById('top_color');
const bottomColorInput = document.getElementById('bottom_color');
const topFontSelect = document.getElementById('top_font');
const bottomFontSelect = document.getElementById('bottom_font');
const topSizeInput = document.getElementById('top_size');
const bottomSizeInput = document.getElementById('bottom_size');

let selectedImage = null;
let currentTemplateUrl = null;

document.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected'));
        item.classList.add('selected');
        fileInput.value = '';
        
        const img = item.querySelector('img');
        currentTemplateUrl = img.src; 
        
        selectedImage = new Image();
        selectedImage.src = img.src;
        selectedImage.crossOrigin = "Anonymous"; 
        
        selectedImage.onload = () => {
            updatePreview();
            downloadButton.style.display = 'inline-block';
            saveButton.style.display = 'inline-block';
        };
    });
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        currentTemplateUrl = null; 
        
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImage = new Image();
            selectedImage.src = e.target.result;
            selectedImage.onload = () => {
                document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected'));
                updatePreview();
                downloadButton.style.display = 'inline-block';
                saveButton.style.display = 'inline-block';
            };
        };
        reader.readAsDataURL(file);
    }
});

topTextInput.addEventListener('input', updatePreview);
bottomTextInput.addEventListener('input', updatePreview);
topColorInput.addEventListener('input', updatePreview);
bottomColorInput.addEventListener('input', updatePreview);
topFontSelect.addEventListener('change', updatePreview);
bottomFontSelect.addEventListener('change', updatePreview);
topSizeInput.addEventListener('input', updatePreview);
bottomSizeInput.addEventListener('input', updatePreview);

function updatePreview() {
    if (!selectedImage) {
        canvas.width = 600;
        canvas.height = 400;
        ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f0ff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('▶ ИЗБЕРИ ШАБЛОН', canvas.width / 2, canvas.height / 2);
        downloadButton.style.display = 'none';
        saveButton.style.display = 'none';
        return;
    }

    canvas.width = selectedImage.width;
    canvas.height = selectedImage.height;
    ctx.drawImage(selectedImage, 0, 0);

    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    const topText = topTextInput.value.toUpperCase();
    if (topText) {
        const topSize = parseInt(topSizeInput.value);
        const topFont = topFontSelect.value;
        const topColor = topColorInput.value;
        
        ctx.font = `bold ${topSize}px ${topFont}`;
        ctx.fillStyle = topColor;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.floor(topSize / 4);
        ctx.textBaseline = 'top';
        
        const y = topSize * 0.5;
        ctx.strokeText(topText, canvas.width / 2, y);
        ctx.fillText(topText, canvas.width / 2, y);
    }

    const bottomText = bottomTextInput.value.toUpperCase();
    if (bottomText) {
        const bottomSize = parseInt(bottomSizeInput.value);
        const bottomFont = bottomFontSelect.value;
        const bottomColor = bottomColorInput.value;
        
        ctx.font = `bold ${bottomSize}px ${bottomFont}`;
        ctx.fillStyle = bottomColor;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.floor(bottomSize / 4);
        ctx.textBaseline = 'bottom';
        
        const y = canvas.height - bottomSize * 0.5;
        ctx.strokeText(bottomText, canvas.width / 2, y);
        ctx.fillText(bottomText, canvas.width / 2, y);
    }
}

downloadButton.addEventListener('click', downloadMeme);

function downloadMeme() {
    if (!selectedImage) {
        alert('Моля, изберете шаблон или качете снимка.');
        return;
    }
    
    const dataUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = `meme_${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessMessage('Мемето е изтеглено! ⬇️');
}

saveButton.addEventListener('click', saveMemeToHistory);

function saveMemeToHistory() {
    if (!selectedImage) {
        alert('Моля, изберете шаблон или качете снимка.');
        return;
    }
    
    const dataUrl = canvas.toDataURL('image/png');
    const topText = topTextInput.value;
    const bottomText = bottomTextInput.value;
    
    fetch('save_meme.php', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `image_data=${encodeURIComponent(dataUrl)}&top_text=${encodeURIComponent(topText)}&bottom_text=${encodeURIComponent(bottomText)}&template_url=${encodeURIComponent(currentTemplateUrl || '')}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage('Мемето е запазено в историята! 💾');
        } else {
            showSuccessMessage('Грешка при запазване: ' + data.error, true);
        }
    })
    .catch(error => {
        console.error('Error saving meme:', error);
        showSuccessMessage('Грешка при запазване! ❌', true);
    });
}

function showSuccessMessage(message, isError = false) {
    const existingToast = document.querySelector('.save-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'save-toast';
    toast.textContent = message;
    
    const bgColor = isError 
        ? 'linear-gradient(135deg, #ff006e, #bf00ff)' 
        : 'linear-gradient(135deg, #00f0ff, #bf00ff)';
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: Arial, sans-serif;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

updatePreview();