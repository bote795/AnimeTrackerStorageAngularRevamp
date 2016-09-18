var animeDataManager = function()
{
    this.key = "savedAnimes";
}
inheritsFrom(animeDataManager, Manager);
/*
  upgrade 1.9 fix formating to use in sync
  parse from localstorage and save to sync using 
  new format
*/
animeDataManager.prototype.upgrade = function()
{
    var animes = JSON.parse(localStorage[this.key]);
    var data = [];
    for (var i = 0; i < animes.length; i++)
    {
        var tempDict = {};
        tempDict["name"] = animes[i][0].trim();
        tempDict["ep"] = animes[i][1];
        tempDict["isNewEpAvialable"] = animes[i][2];
        tempDict["newEpUrl"] = animes[i][3];
        tempDict["homeUrl"] = animes[i][4];
        tempDict["totalEps"] = animes[i][5];
        data.push(tempDict);
    };
    return data;
}
var animeDataManager = new animeDataManager();

/*
keys per Anime in array
    tempDict["name"] = name;
    tempDict["ep"] = ep;
    tempDict["isNewEpAvialable"] = 0;
    tempDict["newEpUrl"] = "url";
    tempDict["homeUrl"] = "home";
    tempDict["totalEps"] = 0;
    tempDict["provider"] = true;
    tempDict["anilist"]  = true;
    tempDict["id"]  = ;
    tempDict["image_url_med"] = ;
    tempDict["image_url_sml"] = ;
*/
