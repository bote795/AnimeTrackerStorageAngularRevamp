var app = angular.module('myApp', ['ngRoute', 'ui.sortable', 'ngMaterial'])
    .config([
        '$compileProvider', "$httpProvider",
        function($compileProvider, $httpProvider)
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        }
    ]);
app.config(function($routeProvider)
{
    $routeProvider.
    when('/home',
    {
        templateUrl: 'home.html',
        controller: 'AnimeDataController'
    }).
    when('/messages',
    {
        templateUrl: 'messages.html',
        controller: 'updateWebsitesController'
    }).
    when('/settings',
    {
        templateUrl: 'settings.html',
        controller: 'updateWebsitesController'
    }).
    when('/anilist',
    {
        templateUrl: 'anilist.html',
        controller: 'anilistController'
    }).
    when('/feedback',
    {
        templateUrl: 'feedback.html',
        controller: 'feedbackController'
    }).
    when('/edit/Website/:id',
    {
        templateUrl: 'editWebsite.html',
        controller: 'editWebsitesController'
    }).
    when('/edit/Anime/:id',
    {
        templateUrl: 'editAnime.html',
        controller: 'editAnimeController'
    }).
    otherwise(
    {
        redirectTo: '/home'
    });
});

/*
when ap first run check for updates
*/
app.run(function($rootScope, userSrv, animeRetrieveSrv, anilistFac)
{
    var spintarget = document.getElementById('foo');
    var spinner = new Spinner().spin(spintarget);
    $(spintarget).data('spinner', spinner);
    ga('send', 'pageview', "/popup.html");
});
