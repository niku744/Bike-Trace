/**
 * Created by Nicholas on 3/19/2014.
 */
'use strict';

var bikeTrace= angular.module('bikeTrace.services', []);

//pull map my fitness data down and store it somewhere.
bikeTrace.factory('getTraceData',['$http',function($http){
    $scope.doIt= function(location,min,max){
        $http({
            method: 'POST',
            url:'/giveRouteData',
            data:{
                location:location,
                min:min,
                max:max
            }
        });
    }
}]);
