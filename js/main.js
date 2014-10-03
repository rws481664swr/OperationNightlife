// Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	position: {
		latitude: 42.3677816,
		longitude: -71.2585826,
        zoom: 18,
        valid: false // To check we get the position.
	}
};
// Fluid API Implementation
angular

.module("nightlifeApp", ['ui.bootstrap']) //TODO: module name might want to be changed.

.run(function(){
    var time = Date.now();
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
        alert("Time to retrieve GPS Position object (ms): " + (Date.now() - time));
        // TODO: Currently, this map creation function below is part of this run function in order to ensure accurate information, but it should be made into its own service function in the future.
        latlng = {lat: model.position.latitude, lng: model.position.longitude};
        var mapOptions = {
            center: latlng,
            zoom: model.position.zoom,
            draggable: false
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var userMarker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Your Current Location",
            animation: google.maps.Animation.DROP
        });
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

    $scope.zoom = function(value) {
        $scope.model.position.zoom += value;
        if ($scope.model.position.zoom > 18) {
            $scope.model.position.zoom = 18;
            alert("Cannot be zoomed in further.");
        }
        if ($scope.model.position.zoom < 9) {
            $scope.model.position.zoom = 9;
            alert("Cannot be zoomed out further.");
        }
        $scope.generateMap();
    }

    $scope.zoomOut = function() {
        $scope.zoom(-1);
    }

    $scope.zoomIn = function() {
        $scope.zoom(1);
    }

    //TODO: This should be implemented as a service in the future.
    $scope.generateMap = function(userPosition) {
        // Sets latitude and longitude to current user's registered position.
        var latlng = {lat: model.position.latitude, lng: model.position.longitude};
        // If method is passed an object referring to a user that is not the local user, set center to object's position.
        if (userPosition != null) {
            latlng = {lat: userPosition.position.latitude, lng: userPosition.position.longitude};
        }

        var mapOptions = {
            center: latlng,
            zoom: model.position.zoom,
            draggable: false
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        if (userPosition != null) {
            if (userPosition.position.accuracy < 100) {
                $scope.createUserMarker(userPosition, latlng, map, false);
            }
            else {
                $scope.createUserMarker(userPosition, latlng, map, true);
            }
        }
        else {
            if (model.position.accuracy < 100) {
                $scope.createUserMarker($scope.model, latlng, map, false);
            }
            else {
                $scope.createUserMarker($scope.model, latlng, map, true);
            }
        }

    }

    $scope.createUserMarker = function(user, latlng, map, circle) {

        console.log("User's accuracy radius (in meters): " + user.position.accuracy);
        if (circle) {
            var circle = new google.maps.Circle({
                center: latlng,
                radius: user.position.accuracy,
                map: map,
                fillColor: '#0000FF',
                fillOpacity: 0.5,
                strokeColor: '#0000FF',
                strokeOpacity: 0.5
            })

            var userMarker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: "Your Current Location",
                animation: google.maps.Animation.DROP,
                icon: circle
            });
        }
        else {
            var userMarker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: "Your Current Location",
                animation: google.maps.Animation.DROP
            });
        }
    }

    $scope.centerMap = function() {
        $scope.model.position.zoom = 18;
        $scope.generateMap();
    }
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
})

.controller('DropdownCtrl', function ($scope) {
//    The colletion showing group user
    $scope.items = [
        'User 1',
        'User 2',
        'User 3'
    ];

    $scope.status = {
        isopen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
});
