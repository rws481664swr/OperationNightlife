// Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	position: {
		valid:false		// To check we get the position.
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
		// This is only debugging.
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
})

.controller("userCtrl", function($scope, $rootScope, $http) {
	$scope.users = [];

	 $scope.putItem = function(item) {
        console.log("putting: " + JSON.stringify(item));
        $http.put("/model/" + item.id, item).success(function(data, status, headers, config) {
            console.log(JSON.stringify(['Success', data, status, headers, config]))
        }).error(function(data, status, headers, config) {
            console.log(JSON.stringify(['Error', data, status, headers, config]))
        })
    }

    $scope.postItem = function(item) {
        console.log("posting: " + JSON.stringify(item));
        $http.post("/model", item).success(function(data, status, headers, config) {
            console.log(JSON.stringify(['Success', data, status, headers, config]))
        }).error(function(data, status, headers, config) {
            console.log(JSON.stringify(['Error', data, status, headers, config]))
        })
    }

    $scope.getItems = function() {
    	console.log("about to call http.get");
        $http.get("/model/users").success(function(data) {
        	  console.log("about to call http.get inside "+ data);
            $scope.users = data;
        })
    };

    $scope.deleteItem = function(item) {
        $http.delete("/model/"+item.id).success(function() {
            console.log("just deleted "+JSON.stringify(item));
            $scope.getItems();
        })
    };

});
