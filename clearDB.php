<?php

require('Database.php');

function clearDB() {
	$ads = [];
	$db = new Database();	
	
	$sql = 'REMOVE FROM ads';		
	$dataset = $db->execute_statement($sql);
}

clearDB();

?>
