var app = angular.module('myApp', ['ngMaterial'])
.config( [ "$httpProvider",
    function($httpProvider )
    {   
        $httpProvider.interceptors.push('APIInterceptor');
    }]);