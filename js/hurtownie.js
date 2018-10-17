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
	c.odczytDanych = function() {
		$http.get('pobierzOgloszenia.php').then(
			(data) => {
				let html = $($.parseHTML(data.data));
				html.find('.offer-item').each(function() {
					let ogloszenieJquery = $(this);
					let ogloszenie = {};
					ogloszenie["nazwa ogloszenia"] = ogloszenieJquery.find(".offer-item-title").text();
					ogloszenie["cena"] = ogloszenieJquery.find(".offer-item-rooms").text();
					ogloszenie["liczba pokoi"] = ogloszenieJquery.find(".offer-item-area").text();
					ogloszenie["metraz"] = ogloszenieJquery.find(".offer-item-price").text();
					c.ogloszenia.push(ogloszenie);
				});
			},
			(powod) => {
				console.log('zagłada')
			}
		);
	}
});

