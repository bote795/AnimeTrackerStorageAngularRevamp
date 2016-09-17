app.controller('editWebsitesController', function($scope, $http, $routeParams) {
	$scope.isHtml=false; //is it html
	$scope.customHtml="";
	$scope.isCustomXpath =false;
	$scope.customXpath="";
	$scope.formUrl="";
	$scope.edit = {};
	$scope.edit.website="";
	$scope.edit.domain;
	$scope.edit.sucess=false;
	if ($routeParams.id) {
		$scope.detailId = $routeParams.id;
    }

	$scope.animeUpdatesArray= [];
	
    updateWebsiteManager.load().then(function(data) {
		$scope.animeUpdatesArray=data;
		$scope.edit.website=$scope.animeUpdatesArray[$scope.detailId]["website"];
		$scope.edit.domain=$scope.animeUpdatesArray[$scope.detailId]["domain"];
		$scope.$apply();
    });
	ga('send', 'pageview', "/editWebsite.html");

	$scope.editForm = function() {
		var fields = ["website", "domain"];
		for (var i = 0; i < fields.length; i++) {
			$scope.animeUpdatesArray[$scope.detailId][fields[i]]=$scope.edit[fields[i]];
		};
		ga('send', 'event', "button","edit form for update urls", "edit information for updates website");
		$scope.edit.sucess = true;
		$scope.save();
	}

	$scope.save = function () {
      updateWebsiteManager.save($scope.animeUpdatesArray);
	}
});

