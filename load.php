<?php

require('Database.php');

function load($ads) {
	if(count($ads) == 0)
		return;
	
	$db = new Database();
	
	$sql = 'INSERT INTO ads (Id, Name, Price, NrOfRooms, Size, LandSize, BuildingType, ContractType) ';
	$sql .= 'SELECT * FROM (';
	$sql .= "SELECT * FROM (SELECT 0 AS Id, '' AS Name, 0 AS Price, 0 AS NrOfRooms, 0 AS Size, 0 AS LandSize, '' AS BuildingType, '' AS ContractType LIMIT 0) AS colNames";
	$args = [""];
	foreach($ads as $ad) {
		$sql .= ' UNION SELECT ?, ?, ?, ?, ?, ?, ?, ?';
		$args[0] .= 'isdiddss';
		array_push($args, $ad['Id'], $ad['Name'], $ad['Price'], $ad['NrOfRooms'], $ad['Size'], $ad['LandSize'], $ad['BuildingType'], $ad['ContractType']);
	}
	$sql .= ') AS sentAds WHERE Id NOT IN (SELECT Id FROM ads)';
	$affectedRows = $db->execute_prepared_statement($sql, $args);
	return $affectedRows;
}

$ads = json_decode(file_get_contents('php://input'), true);
echo (load($ads) . "");

?>

