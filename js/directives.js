/**
 * Created by Nicholas on 3/19/2014.
 */
'use strict';
var bikeTrace = angular.module('bikeTrace.directives', []);
//this directive makes and sets up the map
bikeTrace.directive('makeMap', function(){
    return{
        restrict: 'A',
        replace: true,
        template:'<div id="map-canvas" style="width: 100%; height: 100%"></div>',
        link: function(scope,elem,attrs){
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
                        position: google.maps.ControlPosition.RIGHT_CENTER,
                        drawingModes:[
                            google.maps.drawing.OverlayType.MARKER
                        ]
                    }
                });

                //the drawing manager is attached to the map here
                drawingManager.setMap(map);

                //A reference to the map is attached to a scope variable
                scope.map=map;

                //info window content is defined here
                var contentString = '<div>Count</div>';

                //info window content is assigned to the info window here
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                //an event listener is made for markers made by the drawing manager, the event listener in turn attaches
                // another event listener to the newly created marker to then display an info window when the marker is
                // clicked.
                google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {

                    //event listener is attached to the new marker here
                    google.maps.event.addListener(marker, 'click', function() {

                        infowindow.open(map,marker);

                    });

                });



            };
            //the above function is called to make the things in it done when the directive is executed
            actuallyDo();



        }
    };
});
//this directive makes the sidebar
bikeTrace.directive('makeSidebarNav',function(){
    return{
        restrict: 'A',
        replace: true ,
        template:'<div id="sidr"><dl class="Zebra_Accordion"><dt>Filter</dt><dd></dd><dt>Saved Markers</dt><dd></dd><dt>Download</dt><dd><form><input type="button" value="Download All Data" id="downloadAllData"></form></dd></dl></div>',
        link: function(scope,elem,attrs){
           var makeThing =function(){
               //sidebar code
//               $(document).ready(function() {
                   $('#simple-menu').sidr();
//               });

               //accordion code
//               $(document).ready(function() {

                   new $.Zebra_Accordion($('.Zebra_Accordion'));

//               });

//               $(document).ready(function() {
                   var myAccordion = new $.Zebra_Accordion($('.Zebra_Accordion'));
//               });
           };
           makeThing();
        }
    };
});