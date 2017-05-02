var app = angular.module('myApp', ['ngMaterial'])
    .config(["$httpProvider",
        function($httpProvider) {}
    ]);
app.run(function($rootScope, userSrv)
{
    console.log("exectuing run")
    userSrv.load().then(function()
    {
        user = userSrv.get();
        var animeProvider;
        if (user.providers && user.providers.anilist)
        {
            var secrets = Serices.anilist;
            var user_info = user.anilist;
            animeProvider = window.AniLogin("anilist", secrets, user_info, saveAnilist);
            animeProvider.provder = "anilist";
            //create anilogin 
        }
        else if (user.providers && user.providers.myanimelist)
        {
            var username = user.myanimelist.username;
            var pass = user.myanimelist.pass;
            animeProvider = window.AniLogin("myanimelist", username, pass);
            animeProvider.provder = "myanimelist";
        }
    });
});
