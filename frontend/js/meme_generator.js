const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const topTextInput = document.getElementById('top_text');
const bottomTextInput = document.getElementById('bottom_text');
const fileInput = document.getElementById('upload');
const downloadButton = document.getElementById('downloadButton');

let selectedImage = null;

document.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.template-item').forEach(t => t.classList.remove('selected'));
        
        item.classList.add('selected');
        
        fileInput.value = '';
        
        const img = item.querySelector('img');
        selectedImage = new Image();
        selectedImage.src = img.src;
        selectedImage.onload = () => {
            updatePreview();
            downloadButton.style.display = 'block';
        };
    });
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
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

topTextInput.addEventListener('input', updatePreview);
bottomTextInput.addEventListener('input', updatePreview);

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

downloadButton.addEventListener('click', () => {
    if (!selectedImage) {
        alert('Първо избери шаблон!');
        return;
    }
    const link = document.createElement('a');
    link.download = `meme_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

updatePreview();