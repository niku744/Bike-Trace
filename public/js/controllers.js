/**
 * Created by Nicholas on 3/19/2014.
 */
'use strict';

var bikeTrace=angular.module('bikeTrace.controllers', ['bikeTrace.services']);

//this controller connects the input form elements
bikeTrace.controller('queryConnect',['getTraceData','$scope',function(getTraceData,$scope){
    var input = document.getElementById('search');

    var searchBox = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(searchBox, 'place_changed', function() {
        var place = searchBox.getPlace();
        $scope.placeLocation = place.geometry.location;
    });

    $scope.min="";
    $scope.max="";

    $scope.doThing= function(){
        if($scope.min>$scope.max){
            alert("Make sure lower end of search range is less than the higher end")
        }else if($scope.max<$scope.min){
            alert("Make sure the higher end of search range is greater than the lowe end")
        }else{
            //request to node api for map my fitness data
                getTraceData.doIt($scope.placeLocation,$scope.min,$scope.max).success(function(data){
                    console.log(data);
                });
            //draw polylines from cross filter processed map my fitness data

        }
    }

}]);