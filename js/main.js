// Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	
};
// Fluid API Implementation - if you do not know what this means, READ THE BOOK
var nightlifeApp = angular.module("nightlifeApp", []) //TODO: module name might want to be changed.

// highest level scope
.controller("rootCtrl", function($scope, $rootScope) {
	$scope.title = "Codename: Operation Nightlife";
})

// Controller for map view
.controller("mapCtrl", function($scope, $rootScope) {
	$scope.nightlife = model;
});