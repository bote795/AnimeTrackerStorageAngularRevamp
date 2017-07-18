app.controller('anilistController', ['$scope', '$http', 'anilistFac', 'userSrv', function($scope, $http, anilistFac, userSrv)
{
    $scope.PinCode = "";
    $scope.anime = "";
    $scope.watching;
    /*
        Saves the pin intered by user so we can keep using 
        anilist api
    */
    $scope.saveCode = function()
        {
            $target = $(".datareply");
            var user_info = {
                username: $scope.username,
                code: $scope.PinCode
            };
            userSrv.edit(
            {
                username: user_info.username
            });
            userSrv.save();
            anilistFac.pin(user_info)
                .then(function(result)
                {
                    console.log(result);
                    $target.addClass('alert alert-dismissable alert-success');
                    $target.append("Sucess");
                })
                .catch(function(err)
                {
                    console.log(err);
                    $target.addClass('alert alert-dismissable alert-danger');
                    $target.append("Error calling API");
                });
        }
        /*
            fuction called when submit an anime
            adds anime to service
        */
    $scope.selected = function(item)
    {
        anilistFac.animeProvider.addAnime(
            item.id,
            {
                episodes_watched: 0
            }
        ).then(function(response)
        {
            console.log("sucessly added anime");
        });
    }

    /*
        handles autocomplete for input anime
    */
    $scope.querySearch = function(query)
    {
        return anilistFac.animeProvider.searchAnimes(query);
    }

    /*
        Retrieves animelist
    */
    $scope.RetrieveUserList = function()
    {
        if (anilistFac.animeProvider)
        {
            anilistFac.animeProvider.getAnimeList().then(function(response)
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
        item.episodes_watched++;
        anilistFac.animeProvider.updateAnime(
                item.anime.id,
                {
                    episodes_watched: item.episodes_watched
                }
            )
            .then(function(response)
            {
                item.episodes_watched;
            })
            .catch(function(err)
            {
                item.episodes_watched--;
            });
    }
}]);