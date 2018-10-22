let hurtownie = angular.module('hurtownie', []);

hurtownie.controller("mainCtrl", function($scope, $http) {
	$scope.x = 5;
	let c = this;
	c.param = {
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
					c.ogloszenia.push(ogloszenie);
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



