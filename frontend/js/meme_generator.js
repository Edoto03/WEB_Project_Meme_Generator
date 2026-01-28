const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const topTextInput = document.getElementById('top_text');
const bottomTextInput = document.getElementById('bottom_text');
const fileInput = document.getElementById('upload');
const downloadButton = document.getElementById('downloadButton');

// Променливи за състоянието
let selectedImage = null;
let currentTemplateUrl = null; // Добавено: пази URL на избрания шаблон

// 1. Логика за избор на шаблон
document.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
        // Премахване на селекцията от другите
        document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected'));
        
        item.classList.add('selected');
        
        // Ресет на полето за качване на файл
        fileInput.value = '';
        
        const img = item.querySelector('img');
        
        // ЗАПАЗВАМЕ URL НА ШАБЛОНА ЗА БАЗАТА ДАННИ
        currentTemplateUrl = img.src; 
        
        selectedImage = new Image();
        selectedImage.src = img.src;
        // Трябва да позволим крос-ориджин за правилно експортиране на canvas
        selectedImage.crossOrigin = "Anonymous"; 
        
        selectedImage.onload = () => {
            updatePreview();
            downloadButton.style.display = 'block';
        };
    });
});

// 2. Логика за качване на собствен файл
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        // АКО КАЧВАМЕ СОБСТВЕН ФАЙЛ, НЯМАМЕ TEMPLATE URL
        currentTemplateUrl = null; 
        
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImage = new Image();
            selectedImage.src = e.target.result;
            selectedImage.onload = () => {
                document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected'));
                updatePreview();
                downloadButton.style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    }
});

// Listener-и за писане на текст
topTextInput.addEventListener('input', updatePreview);
bottomTextInput.addEventListener('input', updatePreview);

// 3. Основна функция за рисуване (Update Preview)
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
        return;
    }

    canvas.width = selectedImage.width;
    canvas.height = selectedImage.height;
    ctx.drawImage(selectedImage, 0, 0);

    const fontSize = Math.floor(canvas.width / 10);
    ctx.font = `bold ${fontSize}px Impact, Arial Black`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(fontSize / 4);
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    const topText = topTextInput.value.toUpperCase();
    if (topText) {
        ctx.textBaseline = 'top';
        const y = fontSize * 0.5;
        ctx.strokeText(topText, canvas.width / 2, y);
        ctx.fillText(topText, canvas.width / 2, y);
    }

    const bottomText = bottomTextInput.value.toUpperCase();
    if (bottomText) {
        ctx.textBaseline = 'bottom';
        const y = canvas.height - fontSize * 0.5;
        ctx.strokeText(bottomText, canvas.width / 2, y);
        ctx.fillText(bottomText, canvas.width / 2, y);
    }
}

// 4. СВЪРЗВАНЕ НА БУТОНА С НОВАТА ФУНКЦИЯ
// Тук беше проблемът - сега извикваме новата функция downloadAndSaveMeme
downloadButton.addEventListener('click', downloadAndSaveMeme);

// 5. Обединена функция за Сваляне + Запазване
function downloadAndSaveMeme() {
    if (!selectedImage) {
        alert('Моля, изберете шаблон или качете снимка.');
        return;
    }
    
    // Взимаме изображението като Data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // А) Сваляне на устройството (Download)
    const link = document.createElement('a');
    link.download = `meme_${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link); // За съвместимост с Firefox
    link.click();
    document.body.removeChild(link);
    
    // Б) Запазване в базата данни (Save to DB)
    saveMemeToHistory(dataUrl);
}

// 6. Функция за изпращане към PHP
function saveMemeToHistory(imageData) {
    const topText = topTextInput.value;
    const bottomText = bottomTextInput.value;
    
    // Увери се, че пътят до save_meme.php е правилен спрямо този JS файл
    // Ако JS е в /js/, а php е в главната, може да е '../save_meme.php' или просто 'save_meme.php'
    fetch('save_meme.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // Изпращаме данните, включително template_url
        body: `image_data=${encodeURIComponent(imageData)}&top_text=${encodeURIComponent(topText)}&bottom_text=${encodeURIComponent(bottomText)}&template_url=${encodeURIComponent(currentTemplateUrl || '')}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage('Мемето е запазено в историята! ✅');
        } else {
            console.error('Failed to save meme:', data.error);
            // Опционално: showSuccessMessage('Грешка при запазване: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error saving meme:', error);
    });
}

// 7. Функция за показване на Toast съобщение
function showSuccessMessage(message) {
    // Проверка дали вече няма toast, за да не се трупат
    const existingToast = document.querySelector('.save-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'save-toast';
    toast.textContent = message;
    
    // Инлайн стилове за по-бързо прилагане
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #00f0ff, #bf00ff);
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
    
    // Премахване след 3 секунди
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards'; // forwards запазва крайното състояние
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 8. Добавяне на анимациите динамично
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

// Първоначална инициализация
updatePreview();