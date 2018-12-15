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


let hurtownie = angular.module('hurtownie', []);

hurtownie.controller("mainCtrl", function($scope, $http) {
	let mainC = this;
	
	mainC.regions = [
		'WSZYSTKIE',
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
	
	c.nextStep = 'e';
	
	c.searchParams = {
		buildingType: 'dom',
		contractType: 'wynajem',
		priceMin: null,
		priceMax: null,
		areaMin: null,
		areaMax: null,
		region: 'WSZYSTKIE',
	};
		
	c.performEtl = function() {
	}
	
	c.extract = function() {
		let baseUrl = buildBaseUrl(c.searchParams);
		c.nextStep = 't';
	}
	
	c.transform = function() {
		c.nextStep = 'l'
	}
	
	c.load = function() {
		c.nextStep = 'e'
	}
	
	function buildBaseUrl(searchParams) {
		let url = 'https://www.otodom.pl'
			+ '/' + c.searchParams.contractType.poAngielskiemu()
			+ '/' + c.searchParams.buildingType.poAngielskiemu()
			+ ((c.searchParams.region === 'WSZYSTKIE')
				? ''
				: ('/' + c.searchParams.region.poAngielskiemu()))
			+ '?';
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
			+ '&search%5Bdescription%5D=1'
			+ '&nrAdsPerPage=72#';
		return url;
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




