<?php

function ifDbExists() {
	$servername = 'localhost';
	$username = 'root';
	$password = '';
	$dbName = 'hurtownieDB';


	$conn = new mysqli($servername, $username, $password);
	if ($conn->connect_error) {
		die("Coś poszło nie tak: " . $conn->connect_error);
	}
	
	$exists = ($conn->select_db($dbName));
	$conn->close();
	return $exists;
}

echo (ifDbExists() ? 'true' : 'false');

?>
