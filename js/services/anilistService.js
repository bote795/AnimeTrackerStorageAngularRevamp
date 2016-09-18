app.factory('anilistFac', ['$http', '$q', function($http, $q)
{
    /*
    	anilist takes in information with this content type
    */
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";

    var factory = {};
    var client_id = Services.anilist.client_id;
    var client_secret = Services.anilist.client_secret;
    var access_token = "";
    var refresh_token;
    factory.user = {};
    factory.user.id;
    var header;
    var queue = [];

    /*
    	Retrieves current user Info
    	we need id or displayname
    */
    factory.RetrieveUser = function()
        {
            return $http(
                {
                    url: 'https://anilist.co/api/user',
                    method: 'GET',
                    headers: header
                })
                .then(function(response)
                    {
                        userManager.load().then(function(data)
                        {
                            data["user"] = {
                                id: response.data["id"],
                                display_name: response.data["display_name"]
                            };
                            userManager.save(data);
                        });

                        factory.user.id = response.data["id"];
                        return;
                    },
                    function(response)
                    { // optional
                        console.log("fail");
                        console.log(response);
                        return Error("failed retriving user info");
                    });
        }
        /*
        	check if token dats is already stored or needs to be refreshed
        */
    factory.init = function()
    {
        userManager.load().then(function(data)
        {
            if (typeof data["token"] !== "undefined")
            {
                access_token = data["token"]["access_token"];
                var currentTime = new Date();
                var expiresTime = new Date(data["token"]["expires"]);
                header = {
                    'Authorization': 'Bearer ' + access_token
                };
                refresh_token = data["refresh_token"];
                if (currentTime > expiresTime && data["refresh_token"] != "")
                {
                    refreshToken();
                };
            }
            if (typeof data["user"] === "undefined")
            {
                factory.RetrieveUser();
            }
            else
            {
                var id = data["user"]["id"];
                factory.user.id = id;
            }
        });
    }
    factory.init();
    /*
    	will refresh the access_token
    	to be able to keep doing requests in behalf of user
    */
    function refreshToken()
    {
        var params = {
            'grant_type': 'refresh_token',
            'client_id': client_id,
            'client_secret': client_secret,
            'refresh_token': refresh_token,
        };

        $http(
            {
                url: 'https://anilist.co/api/auth/access_token',
                method: 'POST',
                data: $.param(params) // Make sure to inject the service you choose to the controller
            })
            .then(function(response)
                {
                    saveTokenData(response);
                },
                function(response)
                { // optional
                    console.log("fail");
                    console.log(response);

                });
    }
    /*
    	Request Access token
    	anilist api
    */
    factory.requestAcessToken = function(pin)
        {
            var params = {
                'grant_type': 'authorization_pin',
                'client_id': client_id,
                'client_secret': client_secret,
                'code': pin,
            };

            return $http(
                {
                    url: 'https://anilist.co/api/auth/access_token',
                    method: 'POST',
                    data: $.param(params) // Make sure to inject the service you choose to the controller
                })
                .then(function(response)
                    {
                        return saveTokenData(response);
                    },
                    function(response)
                    { // optional
                        console.log("fail");
                        console.log(response);
                        return Error("failed request for access token")
                    });
        }
        /*
        	helper function for handling token
        */
    function saveTokenData(response)
    {
        console.log(response.data);
        factory.access_token = response.data.access_token;
        header = {
            'Authorization': 'Bearer ' + factory.access_token
        };
        //remove fields we don't need
        delete response.data["token_type"];
        delete response.data["expires_in"];
        //setup refresh time for next time
        //time now plus an hour
        var t = new Date()
        t.setHours(t.getHours() + 1);
        response.data["expires"] = t.getTime();
        userManager.load().then(function(data)
        {
            if (typeof data === 'undefined' || data.length === 0)
            {
                data = {};
            }

            data["token"] = response.data;
            if (typeof response.data["refresh_token"] !== 'undefined')
                data["refresh_token"] = response.data["refresh_token"];
            userManager.save(data);
            return;
        });
        console.log("response");
    }
    factory.animeSearch = function(query)
        {
            return $http(
                {
                    url: 'https://anilist.co/api/anime/search/' + query,
                    method: 'GET',
                    headers: header
                })
                .then(function(response)
                    {
                        return response.data;
                    },
                    function(response)
                    { // optional
                        console.log("fail");
                        console.log(response);

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
    factory.RetrieveUserList = function()
        {
            var deferred = $q.defer();
            userManager.load().then(function(data)
            {
                if (typeof factory.user.id === "undefined")
                {
                    if (typeof data["user"]["id"] === "undefined")
                        $q.reject();
                    var id = data["user"]["id"];
                    factory.user.id = id;
                }
                $http(
                    {
                        url: 'https://anilist.co/api/user/' + factory.user.id + '/animelist',
                        method: 'GET',
                        headers: header
                    })
                    .then(function(response)
                        {
                            deferred.resolve(response.data.lists.watching);
                        },
                        function(response)
                        { // optional
                            console.log("fail");
                            console.log(response);
                            deferred.reject(response);
                        });
            });
            return deferred.promise;
        }
        /*
        	add anime to personal list
        	we need id or displayname
        	make sure no objectKey in there
        	id
        	total_episodes
        	image_url_med
        */
    factory.addAnime = function(item)
    {
        var params = {
            'id': item.id,
            'list_status': "watching",
            'episodes_watched': item.ep
        };
        return $http(
            {
                url: 'https://anilist.co/api/animelist',
                method: 'POST',
                // Make sure to inject the service you choose to the controller
                data: $.param(params),
                headers: header
            })
            .then(function(response)
                {
                    return response.data;
                },
                function(response)
                { // optional
                    console.log("fail");
                    console.log(response);

                });
    }

    /*
    	Deletes an anime from animelist
    */
    factory.DeleteAnime = function(id)
        {
            return $http(
                {
                    url: 'https://anilist.co/api/animelist' + id,
                    method: 'DELETE',
                    headers: header
                })
                .then(function(response)
                    {
                        return response.data;
                    },
                    function(response)
                    { // optional
                        console.log("fail");
                        console.log(response);

                    });
        }
        /*
        	Edit anime
        	we need id 
        	make sure no objectKey in there
        */
    factory.editAnime = function(item)
    {
        var params = {
            'episodes_watched': item.ep,
            'id': item.id
        };
        return $http(
            {
                url: 'https://anilist.co/api/animelist',
                method: 'PUT',
                // Make sure to inject the service you choose to the controller
                data: $.param(params),
                headers: header
            })
            .then(function(response)
                {
                    return response.data;
                },
                function(response)
                { // optional
                    console.log("fail");
                    console.log(response);

                });
    }
    return factory;
}]);
