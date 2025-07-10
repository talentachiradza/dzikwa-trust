<?php
header('Content-Type: application/json');

// Validate input
$errors = [];
$data = [];

if (empty($_POST['name'])) {
    $errors['name'] = 'Name is required.';
}

if (empty($_POST['email'])) {
    $errors['email'] = 'Email is required.';
} elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Email is invalid.';
}

if (empty($_POST['message'])) {
    $errors['message'] = 'Message is required.';
}

if (!empty($errors)) {
    $data['success'] = false;
    $data['errors'] = $errors;
} else {
    // Process the form
    $to = 'info@dzikwatrust.org';
    $subject = 'New Contact Form Submission: ' . $_POST['subject'];
    
    $message = "Name: " . $_POST['name'] . "\n";
    $message .= "Email: " . $_POST['email'] . "\n";
    $message .= "Subject: " . $_POST['subject'] . "\n\n";
    $message .= "Message:\n" . $_POST['message'];
    
    $headers = "From: " . $_POST['email'] . "\r\n" .
               "Reply-To: " . $_POST['email'] . "\r\n" .
               "X-Mailer: PHP/" . phpversion();
    
    // Send email (in production, use a proper mail library like PHPMailer)
    $mailSent = mail($to, $subject, $message, $headers);
    
    if ($mailSent) {
        $data['success'] = true;
        $data['message'] = 'Thank you! Your message has been sent.';
        
        // Optional: Save to database
        try {
            $pdo = new PDO('mysql:host=localhost;dbname=dzikwa_db', 'username', 'password');
            $stmt = $pdo->prepare("INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)");
            $stmt->execute([$_POST['name'], $_POST['email'], $_POST['subject'], $_POST['message']]);
        } catch (PDOException $e) {
            // Log error but don't show to user
            error_log("Database error: " . $e->getMessage());
        }
    } else {
        $data['success'] = false;
        $data['message'] = 'Sorry, there was an error sending your message. Please try again later.';
    }
}

echo json_encode($data);
?>