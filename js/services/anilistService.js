app.factory('anilistFac', ['$http', '$q', 'userSrv', function($http, $q, userSrv)
{
    var factory = {};
    var secrets = Services.anilist;
    factory.init = function()
    {
        userSrv.load()
            .then(function()
            {
                var user = userSrv.get();
                if (user.providers && user.providers.anilist)
                {
                    var user_info = user;
                    factory.animeProvider = window.AniLogin("anilist", secrets, user_info, saveAnilist);
                    factory.animeProvider.provder = "anilist";
                    //create anilogin 
                }
                else if (user.providers && user.providers.myanimelist)
                {
                    var username = user.myanimelist.username;
                    var pass = user.myanimelist.pass;
                    factory.animeProvider = window.AniLogin("myanimelist", username, pass);
                    factory.animeProvider.provder = "myanimelist";
                }
            });

    }
    factory.pin = function(user_info)
    {
        factory.animeProvider = window.AniLogin("anilist", secrets, user_info, saveAnilist);
        factory.animeProvider.provder = "anilist";
        return factory.animeProvider.authenticate();
    }
    factory.init();
    return factory;
}]);
