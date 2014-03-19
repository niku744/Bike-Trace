/**
 * Created by Nicholas on 3/18/2014.
 */
// Declare app level module which depends on filters, and services
//angular.module('bikeTrace', [
   // 'bikeTrace.filters',
  //  'bikeTrace.services',
  //  'bikeTrace.directives',
 //   'bikeTrace.controllers'
//]).

//the map is initialized below with a drawing manager
$(document).ready(function initialize() {
    //the map center location and zool level is set below
    var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(-34.397, 150.644)
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
});

