<?php
 error_reporting(E_ALL);
ini_set('display_errors', '1');

function pobierzStrone($url) {
	$ch = curl_init();
	curl_setopt ($ch, CURLOPT_URL, $url);
	curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
	$contents = curl_exec($ch);
	if (curl_errno($ch)) {
	  echo curl_error($ch);
	  echo "\n<br />";
	  $contents = '';
	} else {
	  curl_close($ch);
	}

	if (!is_string($contents) || !strlen($contents)) {
	echo "Failed to get contents.";
	$contents = '';
	}

	return $contents;
}

$url = $_GET['url'];
echo (pobierzStrone($url));

?>
