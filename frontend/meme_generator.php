<?php
require_once '../backend/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

require 'templates/meme_generator.html'; 
?>