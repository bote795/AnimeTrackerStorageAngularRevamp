app.controller('anilistController', function($scope, $http, anilistFac)
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
            anilistFac.requestAcessToken($scope.PinCode);
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
        return anilistFac.animeSearch(query);
    }

    /*
    	Retrieves animelist
    */
    $scope.RetrieveUserList = function()
    {
        anilistFac.RetrieveUserList().then(function(response)
        {
            $scope.watching = response;
        });
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
});
