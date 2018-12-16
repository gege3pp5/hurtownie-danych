<?php

require('Database.php');

function load($ads) {
	if(count($ads) == 0)
		return;
	
	$db = new Database();
	
	$sql = 'INSERT INTO ads (Id, Name, Price, NrOfRooms, Size, LandSize, BuildingType, ContractType) VALUES ';
	$args = [""];
	foreach($ads as $ad) {
		$sql .= '(?, ?, ?, ?, ?, ?, ?, ?), ';
		$args[0] .= 'isdiddss';
		array_push($args, $ad['Id'], $ad['Name'], $ad['Price'], $ad['NrOfRooms'], $ad['Size'], $ad['LandSize'], $ad['BuildingType'], $ad['ContractType']);
	}
	$sql = substr($sql, 0, strlen($sql) - 2);
	$db->execute_prepared_statement($sql, $args);
}

$ads = json_decode(file_get_contents('php://input'), true);
load($ads);

?>
