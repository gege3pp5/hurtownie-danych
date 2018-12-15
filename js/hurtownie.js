String.prototype.poAngielskiemu = function() {
	let str = this.toString();
	return str.replace(/[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/g, (ch) => {
		let lowerCaseChar = ch.toLowerCase();			
		let normalizedLowerChar = (function() {
			switch(lowerCaseChar) {
				case 'ą': return 'a'
				case 'ć': return 'c'
				case 'ę': return 'e'
				case 'ł': return 'l'
				case 'ń': return 'n'
				case 'ó': return 'o'
				case 'ś': return 's'
				case 'ź': return 'z'
				case 'ż': return 'z'
			}
		})();
		let shouldCapitalize = ch != lowerCaseChar; 
		return shouldCapitalize ? normalizedLowerChar.toUpperCase() : normalizedLowerChar;
	})
}

let allRegionsName = 'CAŁA POLSKA';
let regions = [
	allRegionsName,
	'dolnośląskie',
	'kujawsko-pomorskie',
	'lubelskie',
	'lubuskie',
	'łódzkie',
	'małopolskie',
	'mazowieckie',
	'opolskie',
	'podkarpackie',
	'podlaskie',
	'pomorskie',
	'śląskie',
	'świętokrzyskie',
	'warmińsko-mazurskie',
	'wielkopolskie',
	'zachodniopomorskie',
];

let maxNrOfAdds = 72;
let defaultAddsPerPage = 72;

let hurtownie = angular.module('hurtownie', []);

hurtownie.controller("mainCtrl", function($scope, $http) {
	let mainC = this;
	
	mainC.regions = regions;

	mainC.activePage = 'etl';
	
	mainC.navigate = function(pageName) {
		mainC.activePage = pageName;
	}
});

hurtownie.controller("homeCtrl", function($scope, $http) {
	let c = this;
});

hurtownie.controller("etlCtrl", function($scope, $http) {
	let c = this;
	let mainC = $scope.mainC;

	c.nextStep = 'e';

	c.adds = [];
	
	c.searchParams = {
		buildingType: 'dom',
		contractType: 'wynajem',
		priceMin: null,
		priceMax: null,
		areaMin: null,
		areaMax: null,
		region: allRegionsName,
	};
		
	c.performEtl = function() {
	}
	
	c.extract = function() {
		let baseUrl = c.buildBaseUrl(c.searchParams);
		mainC.isBusy = true;
		$http.get('pobierzOgloszenia.php?url=' + encodeURIComponent(baseUrl + '&nrAdsPerPage=24')).then(
			(response) => {
				let html = $($.parseHTML(response.data));
				let totalNrOfAdds = parseInt(html.find('.offers-index strong')[0].innerText.replace(/\s+/g, ''));
				let nrOfAddsToDownload = Math.min(totalNrOfAdds, maxNrOfAdds);
				let nrOfPages = Math.ceil(nrOfAddsToDownload / defaultAddsPerPage);
				let urls = (new Array(nrOfPages).fill(undefined)).map((val, index) => {
					let url = baseUrl + '&nrAdsPerPage=' + defaultAddsPerPage + '&page=' + (index + 1);
					return encodeURIComponent(url);
				});
				
				let adds = [];
				
				(function extractNextPage() {
					$http.get('pobierzOgloszenia.php?url=' + urls.pop()).then(
						(reponse) => {
							let html = $($.parseHTML(reponse.data));
							c.extractAddsTo(adds, html);	
							if(urls.length > 0)
								extractNextPage();
							else {
								c.adds = adds;
								c.nextStep = 't';
								mainC.isBusy = false;
								$('html, body').animate({
									scrollTop: $('#etl-buttons').offset().top
								}, 500);
							}
						},
						(failReason) => {
							console.log(failReason);
							mainC.isBusy = false;
						}
					);
				})();
			},
			(failReason) => {
				console.log(failReason);
				mainC.isBusy = false;
			}
		);		
	}
	
	c.transform = function() {
		c.nextStep = 'l'
	}
	
	c.load = function() {
		mainC.isBusy = true;
		$http.post('load.php', c.adds).then(
			(response) => {
				console.log(response);
			},
			(failReason) => {
				console.log(failReason);
			}
		).finally(() => {
			mainC.isBusy = false;
		});
	}
	
	c.buildBaseUrl = function(searchParams) {
		let url = 'https://www.otodom.pl'
			+ '/' + c.searchParams.contractType.poAngielskiemu()
			+ '/' + c.searchParams.buildingType.poAngielskiemu()
			+ ((c.searchParams.region === allRegionsName)
				? ''
				: ('/' + c.searchParams.region.poAngielskiemu()))
			+ '/?';
		let urlParams = [];
		if(c.searchParams.priceMin !== null)
			urlParams.push('search%5Bfilter_float_price%3Afrom%5D=' + c.searchParams.priceMin);
		if(c.searchParams.priceMax !== null)
			urlParams.push('search%5Bfilter_float_price%3Ato%5D=' + c.searchParams.priceMax);
		if(c.searchParams.areaMin !== null)
			urlParams.push('search%5Bfilter_float_m%3Afrom%5D=' + c.searchParams.areaMin);
		if(c.searchParams.areaMax !== null)
			urlParams.push('search%5Bfilter_float_m%3Ato%5D=' + c.searchParams.areaMax);
		url += urlParams.join('&')
			+ '&search%5Bdescription%5D=1';$('#form').offset()
		return url;
	}
	
	c.extractAddsTo = function(addsList, page) {
		page.find('.listing-title:not(.listing-title-promoted) ~ .offer-item').each(function() {
			let jqueryAdd = $(this);
			let add = {};
			add["name"] = jqueryAdd.find(".offer-item-title").text();
			add["price"] = jqueryAdd.find(".offer-item-price").text().trim().replace(/\s+/g, ' ');
			add["nrOfRooms"] = jqueryAdd.find(".offer-item-rooms").text().split(' ')[0];
			add["size"] = jqueryAdd.find(".offer-item-area").text();
            add["id"] = jqueryAdd.find(".button-observed").attr("data-id");
			addsList.push(add);
		});
	}
});

hurtownie.controller("dbCtrl", function($scope, $http) {
	let c = this;
});

/*

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
    
});*/




