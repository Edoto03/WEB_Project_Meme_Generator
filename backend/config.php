<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'meme_project');
define('DB_USER', 'root');
define('DB_PASS', '1234');

$scriptName = $_SERVER['SCRIPT_NAME'];
$pathArray = explode('/', $scriptName);
$projectName = $pathArray[1];
define('ROOT_DIR', $projectName);
?>
