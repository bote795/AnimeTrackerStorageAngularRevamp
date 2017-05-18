var app = angular.module('myApp', ['ngMaterial'])
    .config(["$httpProvider",
        function($httpProvider) {}
    ]);
app.run(function($rootScope, userSrv, anilistFac)
{
    var spintarget = document.getElementById('foo');
    console.log("exectuing run");
});
app.directive('userPref', function()
{
    return {
        scope:
        {},
        restrict: 'E',
        controller: 'userPreferences',
        controllerAs: 'ctrl',
        templateUrl: 'userPreferences.html'
    };
});
