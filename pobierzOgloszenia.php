<?php
// Wczytanie bibliotek umozliwiajacych manipulaje DOM
require('simple_html_dom.php');
 
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

	return str_get_html($contents);
}
 
/*
        Jak pobrać poszczególne elementy ze strony html
        
        Klasa           .nazwaklasy
        ID              #nazwaid
        tag             poprostu
        klasa + name    .nazwaklasy[name='nazwa']
*/
function pobierzDane(){
	// Wczytanie strony z ktorej bedziemy pobierac dane
	$url = "https://www.otodom.pl/sprzedaz/dom/?search%5Bfilter_float_price%3Afrom%5D=500000&search%5Bfilter_float_price%3Ato%5D=2000000&search%5Bdescription%5D=1";
	$html = pobierzStrone($url);
	$data['nazwa ogloszenia'] = $html->find(".offer-item-title",0)->innertext;
	$data['liczba pokoi'] = $html->find(".offer-item-rooms",0)->innertext;
	$data['metraz'] = $html->find(".offer-item-area",0)->innertext;
	$data['cena'] = $html->find(".offer-item-price",0)->innertext;
	// Usuniecie spacji z ceny, poniewaz otodom dodaje dziesiatki spacji w cenie ¯\_(ツ)_/¯
	$data['cena'] = preg_replace('/\s+/', '', $data['cena']);

	return $data;
}

$dane = pobierzDane();
echo json_encode($dane);

?>