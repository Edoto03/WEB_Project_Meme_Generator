<?php
require_once 'config.php';

class DB {
    private static $instance;
    private static $dbh;

    private function __construct() {
        try {
            self::$dbh = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4', DB_USER, DB_PASS);
            self::$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die('Database connection error: ' . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function getConnection() {
        return self::$dbh;
    }
}

DB::getInstance();
?>
