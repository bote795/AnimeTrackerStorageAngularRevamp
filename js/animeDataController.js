app.controller('AnimeDataController', function($scope,$routeParams) {
    //used to handle form on home for new anime
    $scope.newAnimeName = "";
    $scope.newAnimeEpisode = "";
    $scope.mutlipleNewAnime =false;
    $scope.isCollapsed =false;

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
				ga('send', 'pageview', "/editAnime.html");
	    	}
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

	$scope.add =function (anime,clickNew) {
		var clickNew = typeof clickNew !== 'undefined' ? clickNew : false;
		anime.ep ++;
		$scope.resetNewEpFields(anime);
		$scope.save();
		ga('send', 'event', "button","add", "Add to an anime");
		if (clickNew)
		{
			ga('send', 'event', "button","newEp badge", "clicked new ep badge to go to website to watch");
		}
	}
	$scope.minus =function (anime) {
		anime.ep --;
		$scope.resetNewEpFields(anime);
		$scope.save();
		ga('send', 'event', "button","subtract", "Subtract to an anime");
	}
	$scope.resetNewEpFields =function(anime){
		anime["isNewEpAvialable"]=0;
		anime["newEpUrl"]="url";
	}
	$scope.delete =function (anime) {
		var index= $scope.animeArray.indexOf(anime);
		$scope.animeArray.splice(index,1);
		$scope.save();
		ga('send', 'event', "button","delete", "Remove anime");

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
		ga('send', 'event', "button","add new anime", "Add new anime");
		ga('send', 'event', "NewAnime",name, "anime being added");
		$scope.save();
	}
	//edit form in editAnime
	$scope.editForm = function () {
		console.log("it went in");
		var fields= ["name", "ep", "homeUrl", "totalEps"];
		
		for (var i = 0; i < fields.length; i++) {
				/*
				fix some fields to let it keep working
			*/
			if (i == 2 && $scope.edit[fields[i]] == "" ) 
			{
				$scope.animeArray[$scope.detailId][fields[i]]="home";
				continue;
			}

			if (i == 3 &&  !isNaN(Number($scope.edit[fields[i]])) && $scope.edit[fields[i]] != "" ) 
			{
				$scope.animeArray[$scope.detailId][fields[i]]=" out of " + $scope.edit.totalEps;
				continue;
			}
			else if (i == 3)
			{
				//give it back old number to later check for new ep
				$scope.animeArray[$scope.detailId][fields[i]] = $scope.animeArray[$scope.detailId]["totalEps"];
				continue;
			}
			$scope.animeArray[$scope.detailId][fields[i]]=$scope.edit[fields[i]];
		};
		$scope.edit.sucess=true;
		ga('send', 'event', "button","save edit", "did manual changes");
		$scope.save();
	}
	$scope.save = function() {
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