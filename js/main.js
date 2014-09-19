// Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	position: {lat: 42.3677816, lng: -71.2585826, zoom: 17}
};
// Fluid API Implementation - if you do not know what this means, READ THE BOOK
var nightlifeApp = angular.module("nightlifeApp", []) //TODO: module name might want to be changed.

.run(function() {
	var mapOptions = {
		center: {lat: model.position.lat, lng: model.position.lng},
		zoom: model.position.zoom
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var marker = new google.maps.Marker({
		position: model.position,
		map: map,
		title: "Your Current Location"
	});
})

// highest level scope
.controller("rootCtrl", function($scope, $rootScope) {
	$scope.title = "Hermes: Protector of The Road";
	$scope.model = model;
})

// Controller for map view
.controller("mapCtrl", function($scope, $rootScope) {
	$scope.model = model;
});