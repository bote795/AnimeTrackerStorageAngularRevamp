app.controller('anilistController', function($scope,$http) {
	$scope.PinCode="";
	$scope.client_id = "";
	$scope.client_secret = "";
	$scope.access_token = "";
	$scope.anime="";
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
		/*
			response data contains:
			    access_token: "NR3M3vXgHK0kmluOcJVlRXvbGOg4yLhAVyf5If"
			    token_type: "bearer"
			    expires: 1414234981
			    expires_in: 3600    aka an hour
		*/
		.then(function(response) {
			console.log(response.data);
			$scope.access_token = response.data.access_token;
            console.log("response");
	    }, 
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	$scope.findAnime= function() {
		
		$http({
		  url: 'https://anilist.co/api/anime/search/'+$scope.anime,
		  method: 'GET',
		  headers: {
		  	'Authorization' : 'Bearer '+$scope.access_token
		  }
		})
		.then(function(response) {
			console.log(response.data);
			for (var i = 0; i < response.data.length; i++) {
				console.log(response.data[i].title_english);
			};
            console.log("response");
	    }, 
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}		
	
});