document.addEventListener('DOMContentLoaded', () => {
    const templateItems = document.querySelectorAll('.template-item img');
    if (templateItems.length === 0) {
        console.error('Няма намерени .template-item елементи!');
    } else {
        console.log('Намерени', templateItems.length, 'шаблона.');
    }
    templateItems.forEach(img => {
        img.addEventListener('click', () => {
            console.log('Клик върху шаблон:', img.src);
            selectTemplate(img);
        });
    });
    updatePreview(); 
});

const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const topTextInput = document.getElementById('top_text');
const bottomTextInput = document.getElementById('bottom_text');
const fileInput = document.getElementById('upload');
const downloadButton = document.getElementById('downloadButton');
let selectedImage = null;

function selectTemplate(img) {
    document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
    img.parentElement.classList.add('selected');

    fileInput.value = '';

    selectedImage = new Image();
    selectedImage.crossOrigin = "Anonymous"; 
    let imgSrc = img.src;
    console.log('Опит за зареждане на изображение от:', imgSrc);

    if (imgSrc.startsWith('http') && !imgSrc.includes('api.allorigins.win')) {
        imgSrc = `https://api.allorigins.win/raw?url=${encodeURIComponent(imgSrc)}`;
        console.log('Прокси URL:', imgSrc);
    }
    selectedImage.src = imgSrc;

    selectedImage.addEventListener('load', () => {
        console.log('Изображението е заредено успешно:', selectedImage.width, 'x', selectedImage.height);
        updatePreview();
        downloadButton.style.display = 'block';
    }, { once: true });

    selectedImage.addEventListener('error', (e) => {
        console.error('Грешка при зареждане на изображението:', e);
        alert('Грешка при зареждане на шаблона. Моля, изберете друг шаблон.');
        selectedImage = null;
        updatePreview();
    }, { once: true });
}

function handleUpload() {
    const file = fileInput.files[0];
    if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Моля, качете файл в JPEG или PNG формат.');
            fileInput.value = '';
            updatePreview();
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImage = new Image();
            selectedImage.src = e.target.result;
            selectedImage.addEventListener('load', () => {
                document.querySelectorAll('.template-item').forEach(item => item.classList.remove('selected'));
                updatePreview();
                downloadButton.style.display = 'block';
            }, { once: true });
            selectedImage.addEventListener('error', () => {
                alert('Грешка при четене на файла. Моля, опитайте отново.');
                fileInput.value = '';
                updatePreview();
            }, { once: true });
        };
        reader.onerror = function() {
            alert('Грешка при четене на файла. Моля, опитайте отново.');
            fileInput.value = '';
            updatePreview();
        };
        reader.readAsDataURL(file);
    } else {
        updatePreview();
    }
}

function updatePreview() {
    const topText = topTextInput.value.toUpperCase();
    const bottomText = bottomTextInput.value.toUpperCase();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!selectedImage) {
        canvas.width = 500;
        canvas.height = 500;
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Избери шаблон или качи снимка', canvas.width / 2, canvas.height / 2);
        downloadButton.style.display = 'none';
        return;
    }

    canvas.width = selectedImage.width;
    canvas.height = selectedImage.height;
    ctx.drawImage(selectedImage, 0, 0);

    const fontSize = Math.floor(canvas.width / 10);
    const yOffset = canvas.height / 25;

    ctx.font = `bold ${fontSize}px Impact, Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(fontSize / 4);
    ctx.lineJoin = 'round';

    function drawText(text, x, y, baseline) {
        if (text) {
            ctx.textBaseline = baseline;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        }
    }

    drawText(topText, canvas.width / 2, yOffset, 'top');
    drawText(bottomText, canvas.width / 2, canvas.height - yOffset, 'bottom');
}

function downloadMeme() {
    if (!selectedImage) {
        alert('Моля, изберете шаблон или качете снимка.');
        return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `meme_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

topTextInput.addEventListener('input', updatePreview);
bottomTextInput.addEventListener('input', updatePreview);
fileInput.addEventListener('change', handleUpload);
downloadButton.addEventListener('click', downloadMeme);