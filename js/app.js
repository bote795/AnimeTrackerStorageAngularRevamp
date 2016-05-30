var app = angular.module('myApp', ['ngRoute','ui.sortable','ngMaterial'])
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
    when('/anilist', {
        templateUrl: 'anilist.html',
        controller: 'anilistController'
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
app.run(function($rootScope, anilistFac) {
    var spintarget = document.getElementById('foo');
    var spinner = new Spinner().spin(spintarget);
    userManager.load(function(user){\
        if(user.providers.anilist){
            anilistFac.registerObserverCallback(function(){

                
            });  
        }
      
    });
    //check for updates then check for total eps
    var checkForUpdates = updates(function() {
        FindTotalEps(function() {
             $rootScope.$broadcast('reloadAnime',{});
            spinner.stop();            
        });
    });
});
