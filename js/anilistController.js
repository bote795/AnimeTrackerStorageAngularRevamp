app.controller('anilistController', ['$scope', '$http', 'anilistFac', 'userSrv', function($scope, $http, anilistFac, userSrv)
{
    $scope.PinCode = "";
    $scope.anime = "";
    $scope.watching;
    $scope.animeProvider;
    user = userSrv.get();
    if (user.providers && user.providers.anilist)
    {
        var secrets = Services.anilist;
        var user_info = user;
        $scope.animeProvider = window.AniLogin("anilist", secrets, user_info, saveAnilist);
        $scope.animeProvider.provder = "anilist";
        //create anilogin 
    }
    /*
        Saves the pin intered by user so we can keep using 
        anilist api
    */
    $scope.saveCode = function()
        {
            var secrets = Services.anilist;
            var user_info = {
                username: $scope.username,
                code: $scope.PinCode
            };
            userManager.save(
            {
                username: username
            });
            $scope.animeProvider = window.AniLogin("anilist", secrets, user_info, saveAnilist);
            $scope.animeProvider.provder = "anilist";
            $scope.animeProvider.authenticate()
                .then(function(result)
                {
                    console.log(result);
                })
                .catch(function(err)
                {
                    console.log(err);
                });
        }
        /*
            fuction called when submit an anime
            adds anime to service
        */
    $scope.selected = function(item)
    {
        anilistFac.addAnime(
        {
            id: item.id,
            ep: 0
        }).then(function(response)
        {
            console.log("sucessly added anime");
        });
    }

    /*
        handles autocomplete for input anime
    */
    $scope.querySearch = function(query)
    {
        return $scope.animeProvider.searchAnimes(query);
    }

    /*
        Retrieves animelist
    */
    $scope.RetrieveUserList = function()
    {
        if ($scope.animeProvider)
        {
            $scope.animeProvider.getAnimeList().then(function(response)
            {
                $scope.watching = response.lists.watching;
            });
        }
    }

    /*
        function that adds one
    */
    $scope.add = function(item)
    {
        anilistFac.editAnime(
            {
                id: item.anime.id,
                ep: item.episodes_watched
            })
            .then(function(response)
            {
                item.episodes_watched++;
            });
    }
}]);
