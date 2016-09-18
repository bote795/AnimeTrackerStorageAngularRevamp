var app = angular.module('myApp', ['ngMaterial'])
    .config(["$httpProvider",
        function($httpProvider)
        {
            //$httpProvider.interceptors.push('APIInterceptor');
        }
    ]);
app.run(function($rootScope, userSrv, anilistFac)
{
    console.log("exectuing run")
    userSrv.load().then(function()
    {
        user = userSrv.get();
        if (user.providers.anilist)
        {
            anilistFac.init();
        }
    });
});
