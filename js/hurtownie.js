let hurtownie = angular.module('hurtownie', []);

// Zmienna container oraz licznik i wykorzystywane sa przy tworzeniu i przechowywaniu zmiennych pobranych ze strony
var container = {};
let i = 1;   
// Utworzenie klasy ObjectInJS umozliwia przeslanie plikow do JSON;
    function ObjectInJS(nazwa,cena,lpok,met,id){
        this.nazwa = nazwa;
        this.cena = cena;
        this.lpok = lpok;
        this.met = met;
        this.id = id;
    }


hurtownie.controller("mainCtrl", function($scope, $http) {
	$scope.x = 5;
	let c = this;
	c.param = {
        id: null,
		cenaMin: null,
		cenaMax: null,
		powMin: null,
		powMax: null,
		woj: null,
		typdomu: null,
		typsprzedazy: null
	}


	c.ogloszenia = [];
	c.maxIloscRekordow = 50;
	c.odczytDanych = function() {	
		c.ogloszenia = [];
		
		let wskaznikStrony = 1;
		//Jest to ilosc stron niezbedna do otworzenia, aby pobrac ilosc rekordow podana przez uzytkownika
		let iloscStron = Math.ceil(c.maxIloscRekordow / 27);
		c.iloscStron = iloscStron;
		pobierzOgloszeniaRec();
		
		function pobierzOgloszeniaRec() {
			let url = createUrl() + (wskaznikStrony == 1
				? ''
				: ('&page=' + wskaznikStrony));
			let encodedUrl = encodeURIComponent(url);
			pobierzOgloszenia(encodedUrl).then(() => {
				if(++wskaznikStrony <= iloscStron)
					pobierzOgloszeniaRec();
			});
		}
	}
	
	function pobierzOgloszenia(url) {
        
		return $http.get('pobierzOgloszenia.php?url=' + url).then(
			(data) => {
				let html = $($.parseHTML(data.data));
				html.find('.offer-item').each(function() {
					let ogloszenieJquery = $(this);
					let ogloszenie = {};
					ogloszenie["nazwa ogloszenia"] = ogloszenieJquery.find(".offer-item-title").text();
					ogloszenie["cena"] = ogloszenieJquery.find(".offer-item-price").text();
					ogloszenie["liczba pokoi"] = ogloszenieJquery.find(".offer-item-rooms").text();
					ogloszenie["metraz"] = ogloszenieJquery.find(".offer-item-area").text();
                    ogloszenie["id"] = ogloszenieJquery.find(".button-observed").attr("data-id");
					c.ogloszenia.push(ogloszenie);
                    
                    // Utworzenie zmiennych aby wykorzystac konstruktor ObjectInJS
                    let nazwa = ogloszenie["nazwa ogloszenia"];
					let cena = ogloszenie["cena"];
					// Usuniecie zbednych spacji ktore otodom generuje
					cena = cena.replace(/\s+/g, '');
                    let lpokoi = ogloszenie["liczba pokoi"];
                    let metraz = ogloszenie["metraz"];
                    let id = ogloszenie["id"];
                    
                    // Wartosci pobrane ze strony przechowywane sa w objektach klasy ObjectInJS, te z kolei przechowywane sa w obiekcie container, aby umozliwic autonumerowaną generacje obiektow z roznymi nazwami
                    container[i] = new ObjectInJS(nazwa,cena,lpokoi,metraz,id);
                    console.log(JSON.stringify(container[i]));
               //     console.log(container[1]);
                    i++;
				});
			},
			(powod) => {
				console.log('zagłada')
			}
		);
	}

// Pierwotna wersja funkcji createUrl ktora na pewno dziala	
//	function createUrl() {
//		let url='';
//		url = 'https://www.otodom.pl/sprzedaz/dom/'
//					+ '?search%5Bfilter_float_price%3Afrom%5D=' + c.param.cenaMin
//					+ '&search%5Bfilter_float_price%3Ato%5D=' + c.param.cenaMax
//					+ '&search%5Bdescription%5D=1'
//		return url;
//	}
    function createUrl() {
		let url='';
        if (c.param.powMin !== null && c.param.powMax !== null){
		url = 'https://www.otodom.pl/'+ c.param.typsprzedazy + '/' + c.param.typdomu+'/'
					+ '?search%5Bfilter_float_price%3Afrom%5D=' + c.param.cenaMin
					+ '&search%5Bfilter_float_price%3Ato%5D=' + c.param.cenaMax
                    + '&search%5Bfilter_float_m%3Afrom%5D=' + c.param.powMin
                    + '&search%5Bfilter_float_m%3Ato%5D=' + c.param.powMax
					+ '&search%5Bdescription%5D=1' 
        }else{
            url = 'https://www.otodom.pl/'+ c.param.typsprzedazy + '/' + c.param.typdomu+'/'
					+ '?search%5Bfilter_float_price%3Afrom%5D=' + c.param.cenaMin
					+ '&search%5Bfilter_float_price%3Ato%5D=' + c.param.cenaMax
					+ '&search%5Bdescription%5D=1' 
        }
		return url;
	}
    
});
