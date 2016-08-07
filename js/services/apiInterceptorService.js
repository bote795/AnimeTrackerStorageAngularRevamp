app.service('APIInterceptor', [ "$q",'$injector',
	function($q,$injector){
	var service = this;
	service.request = function(config) { 
	    return config;
	};
	/*
		will refresh the access_token
		to be able to keep doing requests in behalf of user
	*/
	function refreshToken() {
		var $http = $injector.get('$http');
		var deferred = $q.defer();
		 userManager.load(function(data){
			if (typeof data["token"] !== "undefined") 
			{
				var refresh_token = data["refresh_token"];
				var params = 
				{
		            'grant_type': 'refresh_token',
		            'client_id':  Services.anilist.client_id,
		            'client_secret': Services.anilist.client_secret,
		            'refresh_token': refresh_token,
				};

				 $http({
				  url: 'https://anilist.co/api/auth/access_token',
				  method: 'POST',
				  data: $.param(params) // Make sure to inject the service you choose to the controller
				}).then(function(resp){
	    			delete resp.data["token_type"];
					delete resp.data["expires_in"];
					var t = new Date()
					t.setHours(t.getHours()+ 1);
					resp.data["expires"] = t.getTime();
					userManager.load(function(data) {
						if (typeof data === 'undefined' || data.length === 0) {
							data = {};
						}

						data["token"] = resp.data;
						if (typeof resp.data["refresh_token"] !== 'undefined') 
							data["refresh_token"] = resp.data["refresh_token"];
						userManager.save(data);
						deferred.resolve();
					});
				});
			}
		});
		return deferred.promise;
	}
	service.responseError = function(response) {
		if (response.status === 401) 
		{
        	var $http = $injector.get('$http');
            var deferred = $q.defer();
        	refreshToken().then(deferred.resolve, deferred.reject);
            // When the session recovered, make the same backend call again and chain the request
            return deferred.promise.then(function() {
                return $http(response.config);
            });
    	}
	    return response;
	};
	
}])