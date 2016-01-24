app.controller('anilistController', function($scope,$http) {
	$scope.PinCode="";
	$scope.client_id = "";
	$scope.client_id = "bote795-nuwwf";
	$scope.client_secret = "zDQRctaEZByOo0ybExLyybj1O";
	$scope.anime="";
	$scope.access_token;
	if (typeof localStorage["token"] !== "undefined") {
		$scope.access_token = JSON.parse(localStorage["token"])["access_token"];
		if (new Date() > new Date(localStorage["token"]["expires"])) 
		{
			$scope.refreshToken();
		};
	};
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.saveCode= function() {
		var params = {
            'grant_type': 'authorization_pin',
            'client_id':  $scope.client_id,
            'client_secret': $scope.client_secret,
            'code': $scope.PinCode,
		};

		$http({
		  url: 'https://anilist.co/api/auth/access_token',
		  method: 'POST',
		  data: $.param(params) // Make sure to inject the service you choose to the controller
		})
		.then(function(response) {
			console.log(response.data);
			$scope.access_token = response.data.access_token;
			delete response.data["token_type"];
			var t = new Date()
			t.setHours(t.getHours()+ 1);
			response.data["expires"] = t.getTime();
			localStorage["token"] = JSON.stringify(response.data);
			localStorage["refresh_token"] = JSON.stringify(response.data["refresh_token"]);
            console.log("response");
	    }, 
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	$scope.selected =function (item) {
		alert(JSON.stringify(item));
	}
	/*
		handles autocomplete for input anime
	*/
	$scope.querySearch= function(query) {
		return $http({
		  url: 'https://anilist.co/api/anime/search/'+query,
		  method: 'GET',
		  headers: {
		  	'Authorization' : 'Bearer '+$scope.access_token
		  }
		})
		.then(function(response){
	      return response.data;
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}		
	/*
		will refresh the access_token
	*/
	$scope.refreshToken = function() {
		var params = {
            'grant_type': 'refresh_token',
            'client_id':  $scope.client_id,
            'client_secret': $scope.client_secret,
            'refresh_token': JSON.parse(localStorage["refresh_token"]),
		};

		$http({
		  url: 'https://anilist.co/api/auth/access_token',
		  method: 'POST',
		  data: $.param(params) // Make sure to inject the service you choose to the controller
		})
		.then(function(response) {
			console.log(response.data);
			$scope.access_token = response.data.access_token;
			delete response.data["token_type"];
			localStorage["token"] = JSON.stringify(response.data);
            console.log("response");
	    }, 
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	/*
		Retrieves current user Info
		we need id or displayname
	*/
	$scope.RetrieveUser = function () {
		$http({
		  url: 'https://anilist.co/api/user',
		  method: 'GET',
		  headers: {
		  	'Authorization' : 'Bearer '+$scope.access_token
		  }
		})
		.then(function(response){
	      return response.data;
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	/*
		Retrieves animelist
		we need id or displayname
	*/
	$scope.RetrieveUserList = function () {
		$http({
		  url: 'https://anilist.co/api/user/'+$scope.id+'/animelist',
		  method: 'GET',
		  headers: {
		  	'Authorization' : 'Bearer '+$scope.access_token
		  }
		})
		.then(function(response){
	      return response.data;
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	/*
		Create anime
		we need id or displayname
		make sure no objectKey in there
	*/
	$scope.CreateAnime = function () {
		var params = {
            'id': id,
            'list_status':  "watching"
		};
		$http({
		  url: 'https://anilist.co/api/animelist',
		  method: 'POST',
		  // Make sure to inject the service you choose to the controller
		  data: $.param(params) ,
		  headers: {
		  	'Authorization' : 'Bearer '+$scope.access_token
		  }
		})
		.then(function(response){
	      return response.data;
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	/*
		Edit anime
		we need id 
		make sure no objectKey in there
	*/
	$scope.editAnime = function () {
		var params = {
            'id': id,
            'list_status':  "watching",
            'episodes_watched': ep
		};
		$http({
		  url: 'https://anilist.co/api/animelist',
		  method: 'PUT',
		  // Make sure to inject the service you choose to the controller
		  data: $.param(params) ,
		  headers: {
		  	'Authorization' : 'Bearer '+$scope.access_token
		  }
		})
		.then(function(response){
	      return response.data;
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	/*
		Deletes an anime from animelist
	*/
	$scope.DeleteAnime = function (id) {
		$http({
		  url: 'https://anilist.co/api/animelist'+id,
		  method: 'DELETE',
		  headers: {
		  	'Authorization' : 'Bearer '+$scope.access_token
		  }
		})
		.then(function(response){
	      return response.data;
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
});