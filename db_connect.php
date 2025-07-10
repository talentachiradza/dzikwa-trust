<?php
// Save this as: /includes/db_connect.php
$host = "localhost";
$user = "YOUR_DB_USERNAME"; // Change this!
$pass = "YOUR_DB_PASSWORD"; // Change this!
$db   = "dzikwa_db";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>