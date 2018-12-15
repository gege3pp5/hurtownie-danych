<?php


function load($url) {
	
}

$data = json_decode(file_get_contents('php://input'), true);
echo ($data[0]["price"]);

?>
