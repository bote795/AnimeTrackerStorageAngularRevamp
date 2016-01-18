app.controller('AnimeDataController', function($scope,$routeParams) {
    $scope.newAnimeName = "";
    $scope.newAnimeEpisode = "";
    $scope.mutlipleNewAnime =false;
    $scope.key = "savedAnimes";
    $scope.isCollapsed =false;
    $scope.init = function () {
	    animeDataManager.load(function(data) {
	    	$scope.animeArray=data;
	    	$scope.$apply();
	    });
	};
	$scope.animeArray=[];
	$scope.init();
	$scope.$on('reloadAnime', function(event,args) {
	 	//reload anime
	 	animeDataManager.load(function(data) {
	    	$scope.animeArray=data;
	    	$scope.$apply();
	    });
	 	console.log("reloadAnime");
	 });
	if ($routeParams.id) {
		$scope.detailId = $routeParams.id;
    }
	$scope.add =function (anime) {
		anime.ep ++;
		$scope.resetNewEpFields(anime);
		animeDataManager.save($scope.animeArray);
	}
	$scope.minus =function (anime) {
		anime.ep --;
		$scope.resetNewEpFields(anime);
		animeDataManager.save($scope.animeArray);
	}
	$scope.resetNewEpFields =function(anime){
		anime["isNewEpAvialable"]=0;
		anime["newEpUrl"]="url";
	}
	$scope.delete =function (anime) {
		var index= $scope.animeArray.indexOf(anime);
		$scope.animeArray.splice(index,1);
		animeDataManager.save($scope.animeArray);

	}
	//retrieves what should be displayed for the episode
	$scope.Episode = function (anime) {
		var string="";
		var text="-1";
		//does total eps have 'out of 'X
		if (typeof  anime["totalEps"] === "string")
		  text=anime["totalEps"].substring(8,anime["totalEps"].length)
		//is it a new anime
		if(anime["ep"] == 0)
		string+= "New";
		//is the anime done
		else if(anime["ep"] == parseInt(text))
		string+= "done";
		//else just deplay the ep of the anime
		else
		string+=anime["ep"];
        if (typeof  anime["totalEps"] === "string" && anime["ep"] != parseInt(text)) 
		{
			//ep out of X
			string += anime["totalEps"];
		}
		return string;
	}
	$scope.toggleMultiple = function () {
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
		var newAnime =$scope.basicNew(name,ep);
		$scope.animeArray.push(newAnime);
		$scope.newAnimeName = "";	
		$scope.newAnimeEpisode = "";
		if(!$scope.mutlipleNewAnime)
			$('#collapseOne').collapse('hide')
		animeDataManager.save($scope.animeArray);
	}
	$scope.basicNew = function(name, ep){
	  var tempDict={};
	  tempDict["name"] = name;
	  tempDict["ep"] = ep;
	  tempDict["isNewEpAvialable"] = 0;
	  tempDict["newEpUrl"] = "url";
	  tempDict["homeUrl"] = "home";
	  tempDict["totalEps"] = 0;
	  return tempDict;
	}
	$scope.duplicateAnime = function (name) {
	  var arrayOfUrls =$scope.animeArray;
     for (var i = 0; i < arrayOfUrls.length; i++) {
       if(arrayOfUrls[i]["name"] == name)
       {
         return true;
       }
     }
     return false;
	}
	$scope.anyNewEps = function () {
		for (var i = 0; i < $scope.animeArray.length; i++) {
			if($scope.animeArray[i]["isNewEpAvialable"] == 1)
			{
				return true;
			}
		};
		return false;
	}
});