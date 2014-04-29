/**
 * Created by Nicholas on 3/19/2014.
 */
'use strict';

var bikeTrace= angular.module('bikeTrace.services', []);

//pull map my fitness data down and store it somewhere.
bikeTrace.factory('getTraceData',['$http',function($http){
    var traceData={};
    traceData.doIt= function(location,min,max){
//        console.log(min);
//        console.log(max);
        return $http({
            method: 'POST',
            url:'/giveRouteData',
            data:{
                latitude:location.lat(),
                longitude:location.lng(),
                min:min,
                max:max
            }
        });
    };
    return traceData;
}]);
