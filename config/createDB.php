<?php

require('../Database.php');

function createDB() {
	$servername = 'localhost';
	$username = 'root';
	$password = '';
	$dbName = 'hurtownieDB';


	$conn = new mysqli($servername, $username, $password);
	if ($conn->connect_error) {
		die("Coś poszło nie tak: " . $conn->connect_error);
	} 

	$sql = 'CREATE DATABASE ' . $dbName;
	if ($conn->query($sql) !== TRUE) {
		$msg = 'Coś poszło nie tak: ' . $conn->error;
		$conn->close();
		return $msg;
	} else {
		$conn->close();
	}
	
	$conn = new mysqli($servername, $username, $password, $dbName);
	if ($conn->connect_error) {
		die("Coś poszło nie tak: " . $conn->connect_error);
	} 
	
	$sql = 'CREATE TABLE ads(
				Id BIGINT(20) PRIMARY KEY,
				Name CHAR(255),
				Price DOUBLE,
				NrOfRooms INT,
				Size DOUBLE,
				LandSize DOUBLE,
				BuildingType VARCHAR(200),
				ContractType VARCHAR(200)
			);';
	if ($conn->query($sql) === TRUE) {
		$conn->close();
		return 'Pomyślnie utworzono bazę ' . $dbName;
	} else {
		$msg = 'Coś poszło nie tak: ' . $conn->error;
		$conn->close();
		return $msg;
	}
}

$msg = createDB();
echo $msg;

?>
