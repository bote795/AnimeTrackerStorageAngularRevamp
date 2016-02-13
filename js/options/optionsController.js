app.controller('anilistController', function($scope,$http,anilistFac) {	
	$scope.PinCode="";
	$scope.anime="";
	$scope.watching;
	$scope.userSignIn=false;
	$scope.dropzoneFields=[];
	$scope.currentAnime = [];
	$scope.mainAnime;
	$scope.mainWatching;
	$scope.sucess=false;
	$scope.error=false;
	$scope.anilist=false;
	$scope.message ="";
	userManager.load(function(data){
		if (typeof data["token"] != "undefined")
		{
			$scope.userSignIn=true;
		}
	});


	/*
		Saves the pin intered by user so we can keep using 
		anilist api
	*/
	$scope.saveCode= function() {
		anilistFac.requestAcessToken($scope.PinCode).then(function(err) {
			if(err)
			{
				$scope.error=true;
				console.log("error");
				$scope.message = "UnSuccessful User Login";
			}
			else
			{
				$scope.userSignIn = true;	
				$scope.error=false;
				$scope.sucess=true;
				$scope.message = "Successful User Login";
				anilistFac.RetrieveUser().then(function(err){
					if (err) {
						$scope.error=true;
						console.log("error");
						$scope.message = "UnSuccessful User info retrieval";
					};
					$scope.$emit('reload', null);	
				})
				
			}
			
		});

	}	
	$scope.$on('reload', function(event,args) {
		$scope.RetrieveUserList();
		$scope.currentUsersAnime();
	});
	/*
		Retrieves animelist
	*/
	$scope.RetrieveUserList = function () {
		anilistFac.RetrieveUserList().then(function(response) {
			$scope.watching=response;
		});
	}

	/*
		Retrieves current anime watching in extension
	*/
	$scope.currentUsersAnime = function () {
		animeDataManager.load(function(data) {
			$scope.animeArray=data;
			$scope.animeArray = data.filter(function (item) {
				if (item["provider"] != true) 
				{
					return  item;
				}
			})
		});
	}
	/*
		link 2 animes
	*/
	$scope.link =function() {
		console.log($scope.dropzoneFields);
		//retrieve all checkboxes for link extension anime
		var animeCheckboxes=$(".anime input[type='checkbox']");
		//retrieve all checkboxes for list provider anime
		var listProviderCheckboxes=$(".listProvider input[type='checkbox']");
		//find checked box for anime extension
		var animeChecked = checkedBox(animeCheckboxes);
		//find check box for list provider
		var listProviderChecked = checkedBox(listProviderCheckboxes);
		/*
			if no two checkboxes from two sides are checked return
		*/
		if (typeof animeChecked == "undefined")
		{
			//throw error need to check in each side
			$scope.sucess=false;
			$scope.error=true;
			$scope.message = "Forgote a Extension anime to link with";
			return;
		}
		if (typeof listProviderChecked == "undefined")
		{
			$scope.sucess=false;
			$scope.error=true;
			$scope.message = "Forgote a List Provider to link with";
			return;
		}
		/*
			map all names to an array to easily find index
		*/
		var animeNames = $scope.animeArray.map(function(obj){
			return obj["name"];
		});
		var listNames = $scope.watching.map(function(obj){
			return obj["anime"]["title_english"];
		});

		var animeindex =animeNames.indexOf(animeChecked);
		var listProviderindex =listNames.indexOf(listProviderChecked);
		//link animes
		var targetListProvider= $scope.watching[listProviderindex];
		saveData(animeChecked,targetListProvider);
		//remove anime from lists by name using return lists
		$scope.animeArray.splice(animeindex,1)
		$scope.watching.splice(listProviderindex,1);

		$('input').attr('checked', false)
	}
	/*
		imports all remaning anime to extension
	*/
	$scope.import =function() {
		var animeList = $scope.watching;
		var tempAnimeArray=[];
		animeDataManager.load(function(data) {
			console.log(data);
			animeList = animeList.filter(function(item){
				for (var i = 0; i < data.length; i++) {
					if(item.anime.id == data[i].id)
						return;
				};
				return item;
			})
			console.log(animeList);
			for (var i = 0; i < animeList.length; i++) {
				var temp=$scope.basicNew(animeList[i].anime.title_romaji,
					animeList[i].episodes_watched,animeList[i]);
				tempAnimeArray.push(temp);
			};
			data.push.apply(data, tempAnimeArray);
			console.log(data);
			animeDataManager.save(data);
			$scope.sucess=true;
			$scope.error=false;
			$scope.message = "Imported anime from list provider successfully";
		});
	}
	/*
		baisc new anime with anilist provider
	*/
	$scope.basicNew = function(name, ep,listProviderAnime){
	  var tempDict={};
	  name = name.replace(/:/g,'');
	  name = name.replace(/-/g,'');
	  name = name.replace(/\//g,'');
	  tempDict["name"] = name;
	  tempDict["ep"] = ep;
	  tempDict["isNewEpAvialable"] = 0;
	  tempDict["newEpUrl"] = "url";
	  tempDict["homeUrl"] = "home";
	  if (eps != 0 &&  eps != null) {
			tempDict["totalEps"]=" out of "+ eps;
	  }
	  else
	  {
	  	tempDict["totalEps"] = 0;
	  }
      tempDict["provider"] = true;
	  tempDict["anilist"]  = true;
	  tempDict["id"]  = listProviderAnime.anime.id;
	  tempDict["image_url_med"] = listProviderAnime.anime.image_url_med;
	  tempDict["image_url_sml"] = listProviderAnime.anime.image_url_sml;
	  return tempDict;
	}
	//save data for linking with link anime button
	function saveData(name, listProviderAnime){
		animeDataManager.load(function(data) {
			var animeNames =data.map(function(obj){
				return obj["name"];
			});
			var animeindex =animeNames.indexOf(name);
			var target = data[animeindex];
			target["provider"] = true;
			target["anilist"]  = true;
			target["id"]  = listProviderAnime.anime.id;
			target["image_url_med"] = listProviderAnime.anime.image_url_med;
			target["image_url_sml"] = listProviderAnime.anime.image_url_sml;
			var eps = listProviderAnime.anime.total_episodes;
			if (eps != 0 &&  eps != null) {
				target["totalEps"]=" out of "+ eps;
			};
			console.log(target);
			console.log(data);
			animeDataManager.save(data);
			$scope.sucess=true;
			$scope.error=false;
			$scope.message = "Successfully Linked Data";
		});
	}
	function checkedBox (animeCheckboxs) {
		for (var i = 0; i < animeCheckboxs.length; i++) {
			var currentNode = $(animeCheckboxs[i]);
			if (currentNode.is(":checked"))
			{
				console.log(currentNode.parent().text().trim());
				return currentNode.parent().text().trim();
			}
		};
	}
	
});