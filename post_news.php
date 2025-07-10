<?php 
// Save this as: /news/post_news.php
include '../includes/db_connect.php';
?>
<form action="save_news.php" method="post" enctype="multipart/form-data">
    <h2>Post News</h2>
    <input type="text" name="title" placeholder="News Title" required><br>
    <textarea name="content" placeholder="News Content" required></textarea><br>
    <input type="file" name="news_image" accept="image/*" required><br>
    <button type="submit">Publish</button>
</form>