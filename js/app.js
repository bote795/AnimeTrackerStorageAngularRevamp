var app = angular.module('myApp', ['ngRoute','ui.sortable'])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
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
    when('/feedback', {
        templateUrl: 'feedback.html',
        controller: 'feedbackController'
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
/*
when ap first run check for updates
*/
app.run(function($rootScope) {
    ga('send', 'pageview', "/popup.html");
});
