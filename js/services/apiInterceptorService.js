app.service('APIInterceptor', ["$q", '$injector', 'userSrv',

    function($q, $injector, userSrv)
    {
        var service = this;
        userSrv.load();
        var user = userSrv.get();
        //figure out what api we using atm if any
        var API = userSrv.getCurrentAPI();
        //counter of attempts we have tried to refresh_token
        service.attempts = 0;
        service.request = function(config)
        {
            user = userSrv.get();
            //fix better way for detecting url and needing token
            if (config.url.indexOf(API) > -1 && config.url.indexOf("auth") < 0)
            {
                config.headers.Authorization = 'Bearer ' + user["token"]["access_token"];
            }
            return config;
        };

        function tokenRequest()
        {
            var $http = $injector.get('$http');
            var params = {
                'grant_type': 'refresh_token',
                'client_id': Services.anilist.client_id,
                'client_secret': Services.anilist.client_secret,
                'refresh_token': user.refresh_token,
            };
            return $http(
            {
                url: 'https://anilist.co/api/auth/access_token',
                method: 'POST',
                data: $.param(params) // Make sure to inject the service you choose to the controller
            });
        }
        /*
            will refresh the access_token
            to be able to keep doing requests in behalf of user
        */
        function refreshToken()
        {
            var deferred = $q.defer();
            tokenRequest()
                .then(function(resp)
                {
                    var tempDict = {};
                    //remove fields we don't need
                    delete resp.data["token_type"];
                    delete resp.data["expires_in"];
                    //setup refresh time for next time
                    //time now plus an hour
                    var t = new Date()
                    t.setHours(t.getHours() + 1); // token will expire in an hour
                    resp.data["expires"] = t.getTime();
                    tempDict["token"] = resp.data;
                    if (typeof resp.data["refresh_token"] !== 'undefined')
                        tempDict["refresh_token"] = resp.data["refresh_token"];
                    userSrv.edit(tempDict);
                    deferred.resolve();
                })
                .catch(function()
                {
                    deferred.reject();
                });
            return deferred.promise;
        }
        service.responseError = function(response)
        {
            if (response.status === 401 && service.attempts < 2)
            {
                service.attempts++;
                var $http = $injector.get('$http');
                var deferred = $q.defer();
                refreshToken().then(deferred.resolve, deferred.reject);
                // When the session recovered, make the same backend call again and chain the request
                return deferred.promise.then(function()
                {
                    return $http(response.config);
                });
            }
            return response;
        };

    }
])
