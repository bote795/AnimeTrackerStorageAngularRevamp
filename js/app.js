var app = angular.module('myApp', ['ngRoute', 'ui.sortable', 'ngMaterial'])
    .config([
        '$compileProvider', "$httpProvider",
        function($compileProvider, $httpProvider)
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
            //$httpProvider.interceptors.push('APIInterceptor');
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

function resetNewEpFields(anime)
{
    anime["isNewEpAvialable"] = 0;
    anime["newEpUrl"] = "url";
}
/*
when ap first run check for updates
*/
app.run(function($rootScope, anilistFac)
{
    var spintarget = document.getElementById('foo');
    var spinner = new Spinner().spin(spintarget);
    //check for updates then check for total eps
    var checkForUpdates = updates().then(FindTotalEps())
        .then(function()
        {
            $rootScope.$broadcast('reloadAnime',
            {});
            spinner.stop();
            return {};
        });

    userManager.load().then(function(user)
    {
        if (user.providers.anilist)
        {
            //retrieve anime List from chrome extension
            animeDataManager.load().then(function(animelist)
            {
                //retrieve user list from anilist 
                anilistFac.RetrieveUserList().then(function(list)
                {
                    //go through chrome extension anime
                    animelist.forEach(function(anime, index)
                    {
                        //if anime is from anilist 
                        if ('provider' in anime && anime.provider && anime.anilist)
                        {
                            //find anime from list that the user is watching
                            var filterList = list.filter(function(val)
                                {
                                    return val.anime.id == anime.id;
                                })
                                //make sure that we only got one
                            if (filterList.length == 1)
                            {
                                //make sure that anime is not equal to same episode
                                if (filterList[0].episodes_watched != anime.ep)
                                {
                                    //console.log(anime.name,animelist[index],filterList[0].episodes_watched);
                                    //server number is bigger 
                                    if (filterList[0].episodes_watched > anime.ep)
                                    {
                                        animelist[index].ep = filterList[0].episodes_watched;
                                        resetNewEpFields(animelist[index]);
                                    }
                                    //local number is bigger must save that in anilist
                                    else
                                    {
                                        anilistFac.editAnime(
                                        {
                                            ep: anime.ep,
                                            id: anime.id
                                        }).then(function(response)
                                        {
                                            console.log("sucessfully updated", response)
                                        });
                                    }
                                }
                            }
                        }
                    });
                    //save anime list
                    animeDataManager.save(animelist);
                    checkForUpdates;
                });
            });
        }

    });
    ga('send', 'pageview', "/popup.html");
});
