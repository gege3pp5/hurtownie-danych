<?php

require('Database.php');

function getAds($args) {
	$ads = [];
	$db = new Database();	
	
	$sql = 'SELECT Id, Name, Price, NrOfRooms, Size, LandSize, BuildingType, ContractType FROM ads WHERE ';

	if($args['id'] != null)
		$sql .= "Id = '" . $args['id'] . "' AND ";
	if($args['buildingType'] != null)
		$sql .= "BuildingType = '" . $args['buildingType'] . "' AND ";
	if($args['contractType'] != null)
		$sql .= "ContractType = '" . $args['contractType'] . "' AND ";
	if($args['priceMin'] != null)
		$sql .= 'Price >= ' . $args['priceMin'] . ' AND ';
	if($args['priceMax'] != null)
		$sql .= 'Price <= ' . $args['priceMax'] . ' AND ';
	if($args['areaMin'] != null)
		$sql .= 'Size >= ' . $args['areaMin'] . ' AND ';
	if($args['areaMax'] != null)
		$sql .= 'Size <= ' . $args['areaMax'] . ' AND ';
	$sql .= '1 = 1';
		
	$dataset = $db->execute_statement($sql);	
	while($ad = $dataset->fetch_assoc()) {
		array_push($ads, $ad);
	}
	return $ads;
}

$args = json_decode(file_get_contents('php://input'), true);
$adds = getAds($args);
$json = json_encode($adds);
echo $json;

?>
