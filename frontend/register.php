<?php
require '../backend/db.php';
session_start();

$errors = [];
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($username) || empty($email) || empty($password)) {
        $errors[] = "Всички полета са задължителни!";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Невалиден имейл адрес!";
    } elseif (strlen($password) < 6) {
        $errors[] = "Паролата трябва да е поне 6 символа!";
    } else {
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            $errors[] = "Потребителското име или имейл вече съществува!";
        }
    }

    if (empty($errors)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        if ($stmt->execute([$username, $email, $hashed_password])) {
            header("Location: login.php?success=Регистрацията е успешна! Моля, влезте.");
            exit;
        } else {
            $errors[] = "Грешка при регистрацията. Опитайте отново.";
        }
    }
}
include 'templates/register.html';
?>