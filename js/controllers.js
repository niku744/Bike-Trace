/**
 * Created by Nicholas on 3/19/2014.
 */
'use strict';

var bikeTrace=angular.module('bikeTrace.controllers', []);

    bikeTrace.controller('makeMap', function($scope){

    var actuallyDo =function(){

        //the map center location and zoom level is set below
        var mapOptions = {
            zoom: 3,
            center: new google.maps.LatLng(39.50, -98.35),
            scaleControl: true,
            overviewMapControl: true,
            panControl: false,
            zoomControlOptions:{
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        };

        //the map is put into the div with the map-canvas id and its options are applied
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        //the drawing manager is configured below and only markers are allowed to be drawn
        var drawingManager= new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl:true,
            drawingControlOptions:{
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes:[
                    google.maps.drawing.OverlayType.MARKER
                ]
            }
        });

        //the drawing manager is attached to the map here
        drawingManager.setMap(map);
        $scope.map=map;
    };
    actuallyDo();



    });