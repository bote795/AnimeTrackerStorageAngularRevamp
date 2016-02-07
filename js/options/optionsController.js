app.controller('anilistController', function($scope,$http,anilistFac) {	
	$scope.PinCode="";
	$scope.anime="";
	$scope.watching;
	$scope.userSignIn=false;
	$scope.dropzoneFields=[];
	$scope.currentAnime = [];
	/*
		Saves the pin intered by user so we can keep using 
		anilist api
	*/
	$scope.saveCode= function() {
		anilistFac.requestAcessToken($scope.PinCode).then(function(err) {
			if(err)
			{
				console.log("error");
			}
			else
			{
				$scope.userSignIn = true;	
			}
			
		});

	}	

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
		});
	}
	/*
		link 2 animes
	*/
	$scope.link =function() {
		console.log($scope.dropzoneFields);
		$scope.dropzoneFields=[];
	}

	/*
		Draging and sorting
	*/
      var baseConfig = {
          placeholder: "beingDragged",
          tolerance: 'pointer',
          items: 'li',
          revert: 100
      };
  	$scope.animeConfig = angular.extend({}, baseConfig, {
          connectWith: ".dropzoneFields"
    });
      $scope.anilistConfig = angular.extend({}, baseConfig, {
          connectWith: ".dropzoneFields"
      });    
    $scope.dropzoneFieldsConfig = angular.extend({}, baseConfig, {
          connectWith: ".anilist",
          connectWith: ".animeArray"
      });  
});