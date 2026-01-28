<?php
require_once '../backend/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// ВАЖНО: Тук не трябва да има "header(Location: templates/...)"
// Трябва да е require:
require 'templates/meme_generator.html'; 
?>