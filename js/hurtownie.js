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
	c.ogloszenie = null;
	c.odczytDanych = function() {
		$http.get('pobierzOgloszenia.php').then(
			(data) => {
				c.ogloszenie = data.data;
			},
			(powod) => {
				console.log('zagłada')
			}
		);
	}
});

