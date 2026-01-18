function validateRegisterForm() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (username === '' || email === '' || password === '') {
        alert('Всички полета са задължителни!');
        return false;
    }
    if (password.length < 6) {
        alert('Паролата трябва да е поне 6 символа!');
        return false;
    }
    return true;
}

function validateLoginForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        alert('Всички полета са задължителни!');
        return false;
    }
    return true;
}
