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
function pobierzDane($iloscRekordow){

$wskaznikStrony = 1;
//Jest to ilosc stron niezbedna do otworzenia, aby pobrac ilosc rekordow podana przez uzytkownika
$iloscStron = $iloscRekordow / 26;
echo ((int)$iloscStron);
    
while($iloscStron>=1){
// Wczytanie strony z ktorej bedziemy pobierac dane
$html = file_get_html("https://www.otodom.pl/sprzedaz/dom/?page=$wskaznikStrony");
// Pobranie poszczegolnych danych ze strony
    for ($i = 0; $i<27; $i++){
        $data['nazwa ogloszenia'] = $html->find(".offer-item-title",$i)->innertext;
        $data['liczba pokoi'] = $html->find(".offer-item-rooms",$i)->innertext;
        $data['metraz'] = $html->find(".offer-item-area",$i)->innertext;
        $data['cena'] = $html->find(".offer-item-price",$i)->innertext;
        // Usuniecie spacji z ceny, poniewaz otodom dodaje dziesiatki spacji w cenie ¯\_(ツ)_/¯
        $data['cena'] = preg_replace('/\s+/', '', $data['cena']);
        print_r($data);
    }
    $iloscStron--;
    $wskaznikStrony++;
    
}
}
//Nie wiecej niz 1000 bo otodom blokuje
pobierzDane(100);
echo json_encode($dane);

?>
