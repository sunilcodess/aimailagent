<?php
session_start();

if(!isset($_SESSION['user_id'])){
    header("Location: index.html");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
<title>aimailagent Dashboard</title>
</head>

<body>

<h2>Welcome <?php echo $_SESSION['name']; ?></h2>

<h3>Cold Email Generator</h3>

<form action="generate_email.php" method="POST">

<input type="text" name="subject" placeholder="Email Subject" required>
<br><br>

<textarea name="message" placeholder="Write your email..." required></textarea>
<br><br>

<button type="submit">Generate Email</button>

</form>

<br>

<a href="backend/logout.php">Logout</a>

</body>
</html>