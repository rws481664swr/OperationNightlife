// Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	position: {
		latitude:0,
		longitude:0,
		altitude:0,
		accuracy:0,
		altitudeAccuracy:0,
		heading:0,
		speed:0,
		timestamp:0,
		valid:false
	}
};
// Fluid API Implementation - if you do not know what this means, READ THE BOOK
var nightlifeApp = angular.module("nightlifeApp", []) //TODO: module name might want to be changed.

.run(function(){
		// Get your current location.
		// onSuccess Callback
		var onSuccess = function(position) {
		   model.position.latitude = position.coords.latitude;
		   model.position.longitude = position.coords.longitude;
		   model.position.altitude = position.coords.altitude;
		   model.position.accuracy = position.coords.accuracy;
		   model.position.altitudeAccuracy = position.coords.altitudeAccuracy;
		   model.position.heading = position.coords.heading;
		   model.position.speed = position.coords.speed;
		   model.position.timestamp =  position.timestamp;
		   model.position.valid = true;
		};
		// onError Callback
		function onError(error) {
		    alert('code: '    + error.code    + '\n' +
		          'message: ' + error.message + '\n');
		}
		// the current GPS coordinates
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
})

// highest level scope
.controller("rootCtrl", function($scope, $rootScope) {
	$scope.title = "Codename: Operation Nightlife";
	$scope.model = model;
})

// Controller for map view
.controller("mapCtrl", function($scope, $rootScope) {
	$scope.model = model;

});
