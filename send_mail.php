<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "ktriwanit@nara-residence.com";  // Your email
    $subject = "New Contact Form Message - NARA Residence";
    
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $message = htmlspecialchars($_POST["message"]);

    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    
    $body = "You have received a new message from the NARA Residence contact form.\n\n" .
            "Name: $name\n" .
            "Email: $email\n" .
            "Message:\n$message\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "<p>✅ Message sent successfully! We’ll get back to you soon.</p>";
    } else {
        echo "<p>❌ Sorry, something went wrong. Please try again later.</p>";
    }
}
?>
