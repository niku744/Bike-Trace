/**
 * Created by Nicholas on 3/19/2014.
 */
'use strict';

var bikeTrace=angular.module('bikeTrace.controllers', []);

bikeTrace.controller('queryConnect', function($scope){
    var input = document.getElementById('search');

    var searchBox = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(searchBox, 'place_changed', function() {
        var place = searchBox.getPlace();
        $scope.placeLocation = place.geometry.location;
    });

    $scope.min="";
    $scope.max="";


});