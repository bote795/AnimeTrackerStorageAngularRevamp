app.controller('feedbackController', function($scope, $http) {
	$scope.form = {category: 'bug'};
	$scope.message="";
	$scope.sendData= function (){
	  var url = "https://script.google.com/macros/s/AKfycbwaeyBnsnO-zOXopeVfEF5r3cszfs6xOo_2WRb_vMduIY5Xy2c/exec";
	  $http({
		    method: 'POST',
		    url: url,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        return str.join("&");
		    },
		    data: $scope.form
		})
	  .then(function(response)
	  {
	  	$scope.message = "Successfuly submited! \n Thank you! ";
	  });
	  
	}

});