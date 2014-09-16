// Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	title: "Codename: Operation Nightlife"
};

var nightlifeApp = angular.module("nightlifeApp", []) //TODO: module name might want to be changed.

.controller("headerCtrl", function($scope, $rootScope) {
	$scope.nightlife = model;
})

// Controller for map view
.controller("mapCtrl", function($scope, $rootScope) {
	$scope.nightlife = model;
});