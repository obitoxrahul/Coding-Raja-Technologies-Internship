<?php
session_start();
include('../config/dbconn.php');

if (isset($_POST['submit'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Using prepared statements to prevent SQL injection
    $stmt = $dbconn->prepare("SELECT * FROM `admin` WHERE username=? AND password=?");
    $stmt->bind_param("ss", $username, $password);

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        $_SESSION['msg'] = "Login Failed, Admin not found!";
        header('Location: admin_login_page.php');
    } else {
        $row = $result->fetch_assoc();
        $id = $row['user_id'];
        $_SESSION['id'] = $id;
        header('Location: admin_index.php');
        
        // Log the login action
        $remarks = "(Administrator) has logged in the system at ";  
        $date = date("Y-m-d H:i:s");
        $stmt = $dbconn->prepare("INSERT INTO logs(user_id, action, date) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $id, $remarks, $date);
        $stmt->execute();
    }

    // Close the prepared statement
    $stmt->close();
}
?>
