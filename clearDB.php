<?php

mysqli_report(MYSQLI_REPORT_ALL);
require('Database.php');

function clearDB() {
	$db = new Database();		
	$sql = 'DELETE FROM ads';		
	$db->execute_statement($sql);
}

clearDB();

?>
