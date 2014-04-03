/**
 * Created by Nicholas on 3/19/2014.
 */
'use strict';

var bikeTrace= angular.module('bikeTrace.services', ["ngResource"]);

bikeTrace.factory('getTraceData',function($resource){

    return $resource(
        "https://oauth2-api.mapmyapi.com/v7.0/route/",
        {limit:20},
    )

});
