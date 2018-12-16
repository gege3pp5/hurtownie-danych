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

hurtownie.filter('spacedNumber', function() {
	return function(nr) {
		if(nr == null)
			return '-';
		let parts = nr.toString().split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		return parts.join(',');
	}
});

hurtownie.filter('adPrice', function() {
	return function(priceStr, ad) {
		if(priceStr == "-")
			return priceStr;
		return priceStr + (ad['contractType'] === 'wynajem' ? ' zł/mc' : ' zł');
	}
});

hurtownie.filter('nrOfRooms', function() {
	return function(nrOfRooms) {
		if(nrOfRooms == null)
			return '-';
		return nrOfRooms == 11 ? '>10' : nrOfRooms.toString();
	}
});

hurtownie.filter('size', function() {
	return function(size) {
		if(size == "-")
			return size;
		return size + ' m²';
	}
});

hurtownie.filter('landSize', function() {
	return function(size, ad) {
		if(ad.buildingType != 'dom')
			return 'nie dotyczy';
		if(size == "-")
			return size;
		return size + ' m²';
	}
});

hurtownie.controller("mainCtrl", function($scope, $http) {
	let mainC = this;
	
	mainC.regions = regions;

	mainC.activePage = 'home';
	
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
	let transformStatus = false;

	c.nextStep = 'e';

	c.ads = [];
	
	c.searchParams = {
		buildingType: 'dom',
		contractType: 'wynajem',
		priceMin: null,
		priceMax: null,
		areaMin: null,
		areaMax: null,
		region: allRegionsName,
	};
		
	
	
	c.extract = function() {
		let baseUrl = c.buildBaseUrl(c.searchParams);
		mainC.isBusy = true;
		$http.get('pobierzOgloszenia.php?url=' + encodeURIComponent(baseUrl + '&nrAdsPerPage=24')).then(
			(response) => {
				let html = $($.parseHTML(response.data));
				let totalNrOfAddsElem = html.find('.offers-index strong')[0];
				let totalNrOfAdds = totalNrOfAddsElem
					? parseInt(totalNrOfAddsElem.innerText.replace(/\s+/g, ''))
					: 0;
				let nrOfAddsToDownload = Math.min(totalNrOfAdds, maxNrOfAdds);
				let nrOfPages = Math.ceil(nrOfAddsToDownload / defaultAddsPerPage);
				let urls = (new Array(nrOfPages).fill(undefined)).map((val, index) => {
					let url = baseUrl + '&nrAdsPerPage=' + defaultAddsPerPage + '&page=' + (index + 1);
					return encodeURIComponent(url);
				});
				
				let ads = [];
				
				if(urls.length === 0) {
					mainC.isBusy = false;
					return;
				}
				(function extractNextPage() {
					$http.get('pobierzOgloszenia.php?url=' + urls.pop()).then(
						(reponse) => {
							let html = $($.parseHTML(reponse.data));
							c.extractAdsTo(ads, html);	
							if(urls.length > 0)
								extractNextPage();
							else {
								c.ads = ads;
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
		c.nextStep = 'l';
		transformStatus = true;
	}
	c.transformETL = function() {
		c.nextStep = 'l';
		c.load();
	}
	
	c.load = function() {
		mainC.isBusy = true;
		$http.post('load.php', c.ads).then(
			(response) => {
				c.nextStep = 'e';
			},
			(failReason) => {
				console.log(failReason);
			}
		).finally(() => {
			mainC.isBusy = false;
		});
		alert("Rekordy zostaly zaldowane do bazy");
	}


	c.performEtl = function() {
		c.extract();
		setTimeout(function(){
		c.transformETL();
		}, 2000);
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
	
	c.extractAdsTo = function(adsList, page) {
		page.find('.listing-title:not(.listing-title-promoted) ~ .offer-item').each(function() {
			let jqueryAd = $(this);
			let ad = {};
			ad["Name"] = jqueryAd.find(".offer-item-title").text();
			let priceStr = jqueryAd.find(".offer-item-price").text().trim();
			ad["Price"] = parseFloat((priceStr.replace(',', '.').match(/[\s0-9\.]*/) || [''])[0].replace(/\s+/g, '')) || null;
			let nrOfRoomsStr = jqueryAd.find(".offer-item-rooms").text().split(' ')[0];
			ad["NrOfRooms"] = nrOfRoomsStr == ">10" ? 11 : (parseInt(nrOfRoomsStr) || null);
			let sizeStr = jqueryAd.find(".offer-item-area").text();
			ad["Size"] = parseFloat((sizeStr.replace(',', '.').match(/[\s0-9\.]*/) || [''])[0].replace(/\s+/g, '')) || null;
			ad["LandSize"] = parseFloat((sizeStr.replace(',', '.').match(/.*m²działka([\s0-9\.]*)/) || ['', ''])[1].replace(/\s+/g, '')) || null;			
            ad["Id"] = jqueryAd.find(".button-observed").attr("data-id");
			ad["ContractType"] = c.searchParams.contractType;
			ad["BuildingType"] = c.searchParams.buildingType;
			adsList.push(ad);
		});
	}
});

hurtownie.controller("dbCtrl", function($scope, $http) {
	let c = this;	
	let mainC = $scope.mainC;
	
	c.ads = null;
	
	c.getAds = function() {
		mainC.isBusy = true;
		$http.get('getAds.php').then(
			(response) => {
				c.ads = response.data || [];
				mainC.isBusy = false;
				$('html, body').animate({
					scrollTop: $('#db-search-button').offset().top
				}, 500);
			},
			(failReason) => {
				console.log(failReason);
				mainC.isBusy = false;
			}
		);
	}
	
	c.getCSV = function() {
		$http.get('getCSV.php').then(
			(response) => {
				console.log(response.data);
			},
			(failReason) => {
				console.log(failReason);
			}
		);
	}
});
