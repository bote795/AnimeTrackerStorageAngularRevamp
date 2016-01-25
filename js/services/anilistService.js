app.factory('anilistFac', ['$http', function ($http, $q) {
	/*
		anilist takes in information with this content type
	*/
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
	
	var factory = {};
	var client_id = "bote795-nuwwf";
	var client_secret = "zDQRctaEZByOo0ybExLyybj1O";
	var access_token = "";
	factory.user = {};
	factory.user.id;

	var header;
	/*
		check if token dats is already stored or needs to be refreshed
	*/
	factory.init = function () {
		if (typeof localStorage["token"] !== "undefined") {
			access_token = JSON.parse(localStorage["token"])["access_token"];
			var currentTime= new Date();
			var expiresTime = new Date(JSON.parse(localStorage["token"])["expires"]);
			header =  {'Authorization' : 'Bearer '+ access_token};

			if (currentTime > expiresTime && localStorage["refresh_token"] != "") 
			{
				refreshToken();
			};
		}
		if (typeof localStorage["user"] === "undefined") {
				factory.RetrieveUser();
		}
		else
		{
			var id = JSON.parse(localStorage["user"])["id"];
			factory.user.id = id;
		}
	}
	factory.init();
	/*
		will refresh the access_token
		to be able to keep doing requests in behalf of user
	*/
	function refreshToken() {
		var params = {
            'grant_type': 'refresh_token',
            'client_id':  client_id,
            'client_secret': client_secret,
            'refresh_token': JSON.parse(localStorage["refresh_token"]),
		};

		$http({
		  url: 'https://anilist.co/api/auth/access_token',
		  method: 'POST',
		  data: $.param(params) // Make sure to inject the service you choose to the controller
		})
		.then(function(response) {
			saveTokenData(response);
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
	factory.RetrieveUser = function () {
		$http({
		  url: 'https://anilist.co/api/user',
		  method: 'GET',
		  headers: header
		})
		.then(function(response){
			localStorage["user"] = JSON.stringify({ id: response.data["id"],
			display_name: response.data["display_name"]});
			factory.user.id = response.data["id"];
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	/*
		Request Access token
		anilist api
	*/
	factory.requestAcessToken= function(pin) {
		var params = {
            'grant_type': 'authorization_pin',
            'client_id':  client_id,
            'client_secret': client_secret,
            'code': pin,
		};

		$http({
		  url: 'https://anilist.co/api/auth/access_token',
		  method: 'POST',
		  data: $.param(params) // Make sure to inject the service you choose to the controller
		})
		.then(function(response) {
			saveTokenData(response);
	    }, 
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	/*
		helper function for handling token
	*/
	function saveTokenData (response) {
		console.log(response.data);
		factory.access_token = response.data.access_token;
		header =  {'Authorization' : 'Bearer '+ access_token};
		//remove fields we don't need
		delete response.data["token_type"];
		delete response.data["expires_in"];
		//setup refresh time for next time
		//time now plus an hour
		var t = new Date()
		t.setHours(t.getHours()+ 1);
		response.data["expires"] = t.getTime();

		localStorage["token"] = JSON.stringify(response.data);
		if (typeof response.data["refresh_token"] !== 'undefined') 
			localStorage["refresh_token"] = JSON.stringify(response.data["refresh_token"]);
        console.log("response");
	}
	factory.animeSearch= function(query) {
		return $http({
		  url: 'https://anilist.co/api/anime/search/'+query,
		  method: 'GET',
		  headers: header
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
		lists.watching
			.episodes_watched
			.anime
				.total_episodes <null or number>
				.image_url_sml
				.image_url_med
				.id
				.title_english
	*/
	factory.RetrieveUserList = function () {
		return $http({
		  url: 'https://anilist.co/api/user/'+factory.user.id+'/animelist',
		  method: 'GET',
		  headers: header
		})
		.then(function(response){
	       return response.data.lists.watching;
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	/*
		add anime to personal list
		we need id or displayname
		make sure no objectKey in there
		id
		total_episodes
		image_url_med
	*/
	factory.addAnime = function (item) {
		var params = {
            'id': item.id,
            'list_status':  "watching",
            'episodes_watched': item.ep
		};
		return $http({
		  url: 'https://anilist.co/api/animelist',
		  method: 'POST',
		  // Make sure to inject the service you choose to the controller
		  data: $.param(params) ,
		  headers: header
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
	factory.DeleteAnime = function (id) {
		return $http({
		  url: 'https://anilist.co/api/animelist'+id,
		  method: 'DELETE',
		  headers: header
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
	factory.editAnime = function (item) {
		var params = {
            'episodes_watched': item.ep,
            'id': item.id
		};
		return $http({
		  url: 'https://anilist.co/api/animelist',
		  method: 'PUT',
		  // Make sure to inject the service you choose to the controller
		  data: $.param(params) ,
		  headers: header
		})
		.then(function(response){
	      return response.data;
	    },
	    function(response) { // optional
	       console.log("fail");
	       console.log( response);

	    });
	}
	return factory;
}]);