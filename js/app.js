var app = angular.module('myApp', ['ngRoute']);

 
app.config(function ($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'home.html',
        controller: 'AnimeDataController'
    }).
    when('/messages', {
        templateUrl: 'messages.html',
        controller: 'updateWebsitesController'
    }).
    when('/settings', {
        templateUrl: 'settings.html',
        controller: 'updateWebsitesController'
    }).
   otherwise({
        redirectTo: '/home'
    });
});