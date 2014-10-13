// Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
    userName: "",
	position: {
		latitude: 42.3677816,
		longitude: -71.2585826,
        zoom: 18,
        valid: false // To check we get the position.
	},
    users:{

    },
    uuid: -1
};
// Fluid API Implementation
angular

.module("nightlifeApp", ['ui.bootstrap']) //TODO: module name might want to be changed.

.run(function() {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        function retrieveDBid() {
            console.log("about to call http.get");
            $http.get("/model/users").success(function(data) {
                $scope.users = data;
            })
        };
        alert(JSON.stringify(window.localStorage));
        alert(JSON.stringify(window.localStorage.key(0)));
    }
})

.run(function(){
    document.addEventListener("deviceready", getGPSposition, false);

    function getGPSposition() {
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
    }
})

//.run(function($http) {
//        console.log("Putting user location " + JSON.stringify(model.position) + " in database.");
//        $http.put("/model/" + )


//
//
//        function($http) {
//            $scope.putItem = function(item) {
//                console.log("putting: " + JSON.stringify(item));
//                $http.put("/model/" + item.id, item).success(function(data, status, headers, config) {
//                    console.log(JSON.stringify(['Success', data, status, headers, config]))
//                }).error(function(data, status, headers, config) {
//                    console.log(JSON.stringify(['Error', data, status, headers, config]))
//                })
//            }
//        }
//    })

// highest level scope
.controller("rootCtrl", function($scope, $rootScope) {
	$scope.title = "Codename: Operation Nightlife";
	$scope.model = model;
})

// Controller for map view
.controller("mapCtrl", function($scope, $rootScope) {
    $scope.closest_zoom = 18;
    $scope.farthest_zoom = 9;

	$scope.model = model;

    $scope.zoom = function(value) {
        $scope.model.position.zoom += value;
        if ($scope.model.position.zoom > $scope.closest_zoom) {
            $scope.model.position.zoom = $scope.closest_zoom;
            alert("Cannot be zoomed in further.");
        }
        if ($scope.model.position.zoom < $scope.farthest_zoom) {
            $scope.model.position.zoom = $scope.farthest_zoom;
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

    //TODO: This should be implemented as a service.
    $scope.generateMap = function(userPosition) {
        // Sets latitude and longitude to current user's registered position.
        var latlng = {lat: model.position.latitude, lng: model.position.longitude};
        // If method is passed an object referring to a user that is not the local user, set center to object's position.
        // Used when centering map on remote user (i.e. someone in group).
        if (userPosition != null) {
            latlng = {lat: userPosition.position.latitude, lng: userPosition.position.longitude};
        }

        // Sets the options of the generated map.
        // Center: center coordinates of the map. This is the local/remote user's current location.
        // Zoom: Zoom level from 9-18.  Larger zoom level indicates closer zoom.
        // Draggable: Disabled because map dragging was interfering with navigating the app on a mobile device.
        var mapOptions = {
            center: latlng,
            zoom: model.position.zoom,
            draggable: false
        };
        // Generate map on-screen.
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Checks accuracy of coordinates received about the local/remote user. If accuracy is greater than 100 meters,
        // we generate a circle indicating that the user is somewhere inside that circle instead of placing a marker
        // on the map.
        if (userPosition != null) {
            if (userPosition.position.accuracy < 100) {
                $scope.createUserMarker(userPosition, latlng, map, false);
            }
            else {
                $scope.createUserMarker(userPosition, latlng, map, true);
            }
        }
        // If no remote user was passed to the function, we check the accuracy of the local user's coordinates.
        else {
            if (model.position.accuracy < 100) {
                $scope.createUserMarker($scope.model, latlng, map, false);
            }
            else {
                $scope.createUserMarker($scope.model, latlng, map, true);
            }
        }

    }

    //TODO: This should be implemented as a service.
    // Creates a marker on the map at the local/remote user's coordinates. If accuracy of those coordinates is greater
    // than 100 meters, we instead generate a circle indicating that the user is somewhere inside the circle.
    $scope.createUserMarker = function(user, latlng, map, circle) {
        // For debugging purposes.
        console.log("User's accuracy radius (in meters): " + user.position.accuracy);

        // Creates a circle icon if user's accuracy is greater than 100 meters
        // Center: Lat/Lng coordinates referring to center of the circle
        // Radius: Radius, in meters, of the circle
        // Map: Map that the circle should be created on
        // fillColor: Color of the circle
        // fillOpacity: Opacity of the circle
        // strokeColor: Color of the outline of the circle
        // strokeOpacity: Opacity of the outline of the circle
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

            // Creates a user marker (either an actual marker or a circle)
            // Position: Lat/Lng coordinates referring to center of the circle
            // Map: Map that the circle should be created on
            // Title: Title referring to a marker. TODO: Figure out where this appears on the user's end.
            // Animation: Either DROP or BOUNCE. DROP drops the marker onto the map. BOUNCE repeatedly bounces the marker
            // until we call a method to stop the bounce.
            // Icon: If enabled, sets marker from default marker image to another image (e.g. circle)
            var userMarker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: "Your Current Location",
                animation: google.maps.Animation.DROP,
                icon: circle
            });
        }
        else {
            // See above comments
            var userMarker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: "Your Current Location",
                animation: google.maps.Animation.DROP
            });
        }
    }

    // Centers the map on the local user, resetting the zoom distance to 18 (closest distance).
    $scope.centerMap = function() {
        $scope.model.position.zoom = $scope.closest_zoom;
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
	//  $scope.users = db.ids();
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
