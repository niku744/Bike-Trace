/**
 * Created by Nicholas on 3/19/2014.
 */
'use strict';

var bikeTrace=angular.module('bikeTrace.controllers', ['bikeTrace.services']);

//this controller connects the input form elements
bikeTrace.controller('queryConnect',['getTraceData','$scope',function(getTraceData,$scope){
    var input = document.getElementById('search');

    var searchBox = new google.maps.places.Autocomplete(input);

    var rawData;

    var googlePoints=[];

    var googleMVC;

    var heatmap;

    var lines=[];

    google.maps.event.addListener(searchBox, 'place_changed', function() {
        var place = searchBox.getPlace();
        $scope.placeLocation = place.geometry.location;
    });

    $scope.min="";
    $scope.max="";

    $scope.doThing= function(){
//        console.log($scope.min);
//        console.log($scope.max);
        if($scope.min>$scope.max){
            alert("Make sure lower end of search range is less than the higher end")
        }else if($scope.max<$scope.min){
            alert("Make sure the higher end of search range is greater than the lowe end")
        }else{
           //set zoom and center focus to be on the selected location
            $scope.map.setZoom(13);

            $scope.map.setCenter($scope.placeLocation);

            var minMeter=$scope.min*1609.344;
            var maxMeter=$scope.max*1609.344;
            //request to node api for map my fitness data
            getTraceData.doIt($scope.placeLocation,minMeter,maxMeter).
                success(function(data){

                    console.log(data);

                    rawData=data;

                    rawData.forEach(function(bikeRoute){
                        lines.push(new Array());
                        bikeRoute.points.forEach(function(point){
                            googlePoints.push(new google.maps.LatLng(point.lat, point.lng));
                            lines[lines.length-1].push(new google.maps.LatLng(point.lat, point.lng));
                        });

                        new google.maps.Polyline({
                            path: lines[lines.length-1],
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        }).setMap($scope.map);
                    });

                    googleMVC = new google.maps.MVCArray(googlePoints);

                    heatmap = new google.maps.visualization.HeatmapLayer({
                        data: googleMVC
                    });


                    heatmap.setMap($scope.map);



                }).
                error(function(data){
                    console.log(data);

                });

            //draw polylines from cross filter processed map my fitness data

        }
    };
    $scope.heatMapVisibility= function(){
        heatmap.setMap(heatmap.getMap() ? null : $scope.map);
    }

}]);