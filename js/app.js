var app = angular.module('myApp', ['ngRoute','ui.sortable'])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);
 
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
    when('/edit/Website/:id', {
        templateUrl: 'editWebsite.html',
        controller :'updateWebsitesController'
    }).
    when('/edit/Anime/:id', {
        templateUrl: 'editAnime.html',
        controller :'AnimeDataController'
    }).
   otherwise({
        redirectTo: '/home'
    });
});