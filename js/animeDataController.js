app.controller('AnimeDataController', function($scope) {
    $scope.newAnimeName = "";
    $scope.newAnimeEpisode = "";
    $scope.mutlipleNewAnime =false;
    $scope.key = "savedAnimes";
    var animes =JSON.parse("[[\"\\n\\t\\tDungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka\",8,1,\"http://www.animefreak.tv/watch/dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-episode-9-online\",\"home\",10],[\"\\n\\t\\tFate/Stay Night: Unlimited Blade Works (TV)\",14,0,\"url\",\"home\",2],[\"\\n\\t\\tKekkai Sensen\",8,0,\"url\",\"home\",2],[\"\\n\\t\\tVampire Holmes\",7,0,\"url\",\"home\",4],[\"Arslan Senki\",8,0,\"url\",\"home\",2],[\"Fairy Tail 2014\",59,0,\"url\",\"http://www.animefreak.tv/watch/fairy-tail-2014-online\",2],[\"Gunslinger Stratos: The Animation\",7,0,\"url\",\"home\",4],[\"Marvels agents of s h i e l d s2\",19,0,\"url\",\"home\",20],[\"One Piece\",694,0,\"url\",\"home\",2],[\"Owari no Seraph\",8,0,\"url\",\"home\",10],[\"World Trigger\",31,0,\"url\",\"home\",\" out of 50\"]]");
    $scope.animeArray=[];
	for (var i = 0; i < animes.length; i++) {
	  var tempDict={};
	  tempDict["name"] = animes[i][0];
	  tempDict["ep"] = animes[i][1];
	  tempDict["isNewEpAvialable"] = animes[i][2];
	  tempDict["newEpUrl"] = animes[i][3];
	  tempDict["homeUrl"] = animes[i][4];
	  tempDict["totalEps"] = animes[i][5];
	  $scope.animeArray.push(tempDict);
	};
	console.log($scope.animeArray);

	$scope.add =function (anime) {
		anime.ep ++;
	}
	$scope.minus =function (anime) {
		anime.ep --;
	}
	$scope.delete =function (anime) {
		var index= $scope.animeArray.indexOf(anime);
		$scope.animeArray.splice(index,1);
	}
	$scope.test =function (anime) {
		console.log(anime);
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
		var name = $scope.newAnimeName;
		var ep = $scope.newAnimeEpisode;
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
});

