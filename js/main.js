// Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
};
// Fluid API Implementation - if you do not know what this means, READ THE BOOK
var nightlifeApp = angular.module("nightlifeApp", []) //TODO: module name might want to be changed.

// highest level scope
.controller("rootCtrl", function($scope, $rootScope) {
	$scope.title = "Codename: Operation Nightlife";
	$scope.model = model;
})

// Controller for map view
.controller("mapCtrl", function($scope, $rootScope) {
	$scope.nightlife = model;
})

.controller("userCtrl", function($scope, $rootScope) {
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
        $http.get("/showall.json").success(function(data) {
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