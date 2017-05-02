app.factory('anilistFac', ['$http', '$q', 'userSrv', function($http, $q, userSrv)
{
    var animeProvider = {};
    userSrv.load()
        .then(function()
        {
            var user = userSrv.get();
            if (user.providers && user.providers.anilist)
            {
                var secrets = Services.anilist;
                var user_info = user;
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

    return animeProvider;
}]);
