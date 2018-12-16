<?php

require('Database.php');

function getCSV() {
	$db = new Database();
	$sql = 'SELECT Id, Name, Price, NrOfRooms, Size, LandSize, BuildingType, ContractType FROM ads';
	$dataset = $db->execute_statement("SELECT Id, Name, Price, NrOfRooms, Size, LandSize, BuildingType, ContractType FROM ads");

	$delimiter = '⛔';
    $f = fopen('php://output', 'w');
	while($ad = $dataset->fetch_assoc()) {
		$line = join($delimiter, [$ad['Id'], $ad['Name'], $ad['Price'], $ad['NrOfRooms'], $ad['Size'], $ad['LandSize'], $ad['BuildingType'], $ad['ContractType']]) . "\r\n";
		fwrite($f, $line); 
	}
	return $f; 
}

getCSV();

?>
