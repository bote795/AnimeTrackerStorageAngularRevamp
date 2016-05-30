app.controller('editAnimeController', function($scope,$routeParams,anilistFac) {
    //used to handle form on home for new anime
    $scope.newAnimeName = "";
    $scope.newAnimeEpisode = "";

    $scope.key = "savedAnimes";
    
    //used for edit form on eidtAnime
    $scope.edit={};
    $scope.edit.name;
    $scope.edit.ep;
    $scope.edit.homeUrl;
    $scope.edit.totalEps;
    $scope.edit.sucess=false;
	if ($routeParams.id) {
		$scope.detailId = $routeParams.id;
    }
    $scope.init = function () {
	    animeDataManager.load(function(data) {
	    	$scope.animeArray=data;
	    	if ($routeParams.id) {
				$scope.edit.name =$scope.animeArray[$scope.detailId]['name'];
				$scope.edit.ep =$scope.animeArray[$scope.detailId]['ep'];
				if ($scope.animeArray[$scope.detailId]['homeUrl'] == 'home') 
				{
					$scope.edit.homeUrl="";
				}
				else
					$scope.edit.homeUrl =$scope.animeArray[$scope.detailId]['homeUrl'];
				if (typeof $scope.animeArray[$scope.detailId]['totalEps'] === 'number') 
				{
					$scope.edit.totalEps="";
				}
				else
					$scope.edit.totalEps =$scope.animeArray[$scope.detailId]['totalEps'];
	    	};
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
	/**
	 * [anilistEditor function to edit the animes episode]
	 * @param  {[type]} anime [anime object]
	 * @param  {[type]} ep    [epsiode number to change too]
	 * @return {[type]}       [none]
	 */
	function anilistEditor(anime,ep){
		//if a list provider need to try to contact api
		if(anime.provider ==true)
		{
			if (anime.anilist == true) {
				anilistFac.editAnime({
					id: anime.id ,
					ep:  ep})
				.then(function(response) {
						anime.ep =ep;
						$scope.resetNewEpFields(anime);
						$scope.save();
				});
			}
		}
		//just update and save to sync
		else
		{
			anime.ep =ep;
			$scope.resetNewEpFields(anime);
			$scope.save();
		}
	}
	$scope.add =function (anime) {
		anilistEditor(anime,anime.ep+1);
		
	}
	$scope.minus =function (anime) {
		anilistEditor(anime,anime.ep-1);
	}
	$scope.resetNewEpFields =function(anime){
		anime["isNewEpAvialable"]=0;
		anime["newEpUrl"]="url";
	}
	$scope.delete =function (anime) {
		var index= $scope.animeArray.indexOf(anime);
		$scope.animeArray.splice(index,1);
		$scope.save();

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
	//edit form in editAnime
	$scope.editForm = function () {
		console.log("it went in");
		var fields= ["name", "ep", "homeUrl", "totalEps"];
		
		for (var i = 0; i < fields.length; i++) {
			if (i == 1) {
				var ep =Number($scope.edit[fields[i]]);
				if($scope.animeArray[$scope.detailId][fields[i]] !== ep)
				{
					anilistEditor($scope.animeArray[$scope.detailId],ep);
					$scope.animeArray[$scope.detailId][fields[i]]=ep;
				}
			}
				/*
				fix some fields to let it keep working
			*/
			else if (i == 2 && $scope.edit[fields[i]] == "" ) 
			{
				$scope.animeArray[$scope.detailId][fields[i]]="home";
				continue;
			}

			else if (i == 3 && typeof $scope.edit[fields[i]] === 'number') 
			{
				$scope.animeArray[$scope.detailId][fields[i]]="out of " + $scope.edit.totalEps;
				continue;
			}
			else if (i == 3)
			{
				//give it back old number to later check for new ep
				$scope.animeArray[$scope.detailId][fields[i]] = $scope.animeArray[$scope.detailId]["totalEps"];
				continue;
			}
			else
				$scope.animeArray[$scope.detailId][fields[i]]=$scope.edit[fields[i]];
		};
		$scope.edit.sucess=true;
		//$scope.save();
	}
	$scope.save = function() {
		animeDataManager.save($scope.animeArray);
	}
});