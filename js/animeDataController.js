app.controller('AnimeDataController', ['animeRetrieveSrv', '$scope', '$routeParams', '$rootScope', 'anilistFac',
    function(animeRetrieveSrv, $scope, $routeParams, $rootScope, anilistFac)
    {
        //used to handle form on home for new anime
        $scope.newAnimeName = "";
        $scope.newAnimeEpisode = "";
        $scope.mutlipleNewAnime = false;
        $scope.isCollapsed = false;
        $scope.key = "savedAnimes";
        $scope.animeArray = animeRetrieveSrv.get();

        function updateFromRemoteServices()
        {
            var promise;
            if (user.providers && user.providers.anilist)
            {
                promise = updateFromAnilist();
            }
            else
            {
                promise = Promise.resolve(
                {});
            }
            return promise;
        }

        function updateFromAnilist()
        {
            var localAnimelist;
            return anilistFac.animeProvider.getAnimeList()
                .then(function(resp)
                {
                    return resp.lists.watching;
                })
                .then(function(watchingList)
                {
                    localAnimelist = $scope.animeArray;
                    //go through chrome extension anime
                    localAnimelist.forEach(function(anime, index)
                    {
                        //if anime is from anilist 
                        if ('provider' in anime && anime.provider && anime.anilist)
                        {
                            //find anime from list that the user is watching
                            var filterList = watchingList.filter(function(val)
                            {
                                return val.anime.id === anime.id;
                            });
                            var remoteAnime;
                            //make sure that we only got one
                            if (filterList.length === 1)
                            {
                                remoteAnime = filterList[0];
                            }
                            else
                            {
                                return;
                            }

                            //make sure that anime is not equal to same episode
                            if (remoteAnime.episodes_watched !== anime.ep)
                            {
                                //console.log(anime.name,localAnimelist[index],remoteAnime.episodes_watched);
                                //server number is bigger 
                                if (remoteAnime.episodes_watched > anime.ep)
                                {
                                    localAnimelist[index].ep = remoteAnime.episodes_watched;
                                    console.log(localAnimelist[index].name + " replace ep with" + localAnimelist[index].ep);
                                    resetNewEpFields(localAnimelist[index]);
                                }
                                //local number is bigger must save that in anilist
                                else
                                {
                                    anilistEditor(anime, anime.ep, animeRetrieveSrv, anilistFac.animeProvider);
                                }
                            }

                        }
                    });
                    return watchingList;
                })
                //possible add all new animes to list automatically
                .then(function()
                {
                    return animeRetrieveSrv.save();
                })
                .catch(function(err)
                {
                    Promse.reject("Error: " + err);
                });
        }

        $scope.add = function(anime, clickNew)
        {
            var clickNew = typeof clickNew !== 'undefined' ? clickNew : false;
            anilistEditor(anime, anime.ep + 1, animeRetrieveSrv, anilistFac.animeProvider);
            ga('send', 'event', "button", "add", "Add to an anime");
            if (clickNew)
            {
                ga('send', 'event', "button", "newEp badge", "clicked new ep badge to go to website to watch");
            }
        }
        $scope.minus = function(anime)
        {
            anilistEditor(anime, anime.ep - 1, animeRetrieveSrv, anilistFac.animeProvider);
            ga('send', 'event', "button", "subtract", "Subtract to an anime");
        }
        $scope.delete = function(anime)
            {
                //create array with names and use name to find it
                //since we cant just use anime since angular adds the haskey
                var index = $scope.animeArray.map(function(item)
                {
                    return item.name;
                }).indexOf(anime.name);
                if (index > 0)
                {
                    $scope.animeArray.splice(index, 1);
                    animeRetrieveSrv.save();
                    ga('send', 'event', "button", "delete", "Remove anime");
                }

            }
            //retrieves what should be displayed for the episode
        $scope.Episode = function(anime)
        {
            var string = "";
            var text = "-1";
            //does total eps have 'out of 'X
            if (typeof anime["totalEps"] === "string")
                text = anime["totalEps"].substring(8, anime["totalEps"].length)
                //is it a new anime
            if (anime["ep"] == 0)
                string += "New";
            //is the anime done
            else if (anime["ep"] == parseInt(text))
                string += "done";
            //else just deplay the ep of the anime
            else
                string += anime["ep"];
            if (typeof anime["totalEps"] === "string" && anime["ep"] != parseInt(text))
            {
                //ep out of X
                string += anime["totalEps"];
            }
            return string;
        }
        $scope.toggleMultiple = function()
        {
            $scope.mutlipleNewAnime = !$scope.mutlipleNewAnime;
        }

        //adds a new anime to the dictionary
        $scope.addNew = function()
        {
            var name = $scope.newAnimeName.trim();
            var ep = $scope.newAnimeEpisode.trim();
            if ($scope.duplicateAnime(name))
            {
                return;
            }
            var newAnime = $scope.basicNew(name, ep);
            $scope.animeArray.push(newAnime);
            $scope.newAnimeName = "";
            $scope.newAnimeEpisode = "";
            if (!$scope.mutlipleNewAnime)
                $('#collapseOne').collapse('hide')

            ga('send', 'event', "button", "add new anime", "Add new anime");
            ga('send', 'event', "NewAnime", name, "anime being added");
            animeRetrieveSrv.save();
        }
        $scope.basicNew = function(name, ep)
        {
            var tempDict = {};
            tempDict["name"] = name;
            tempDict["ep"] = ep;
            tempDict["isNewEpAvialable"] = 0;
            tempDict["newEpUrl"] = "url";
            tempDict["homeUrl"] = "home";
            tempDict["totalEps"] = 0;
            tempDict["provider"] = false;
            tempDict["anilist"] = false;
            return tempDict;
        }
        $scope.duplicateAnime = function(name)
        {
            var arrayOfUrls = $scope.animeArray;
            for (var i = 0; i < arrayOfUrls.length; i++)
            {
                if (arrayOfUrls[i]["name"] == name)
                {
                    return true;
                }
            }
            return false;
        }
        $scope.anyNewEps = function()
        {
            for (var i = 0; i < $scope.animeArray.length; i++)
            {
                if ($scope.animeArray[i]["isNewEpAvialable"] == 1)
                {
                    return true;
                }
            };
            return false;
        }
        $scope.init = function() {

        }


    }
]);
