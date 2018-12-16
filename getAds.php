<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require('Database.php');

function getAds() {
	$ads = [];
	$db = new Database();	
	$sql = 'SELECT Id, Name, Price, NrOfRooms, Size, LandSize, BuildingType, ContractType FROM ads';
	$dataset = $db->execute_statement("SELECT Id, Name, Price, NrOfRooms, Size, LandSize, BuildingType, ContractType FROM ads");
	
	while($ad = $dataset->fetch_assoc()) {
		array_push($ads, $ad);
	}
	return $ads;
}

$ads = getAds();
$json = json_encode($ads);
echo $json;

?>
