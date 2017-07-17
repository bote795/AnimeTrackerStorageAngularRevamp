//TODO figure out how to execute this and for it to allow for further updates
function onUpdate(preVersion, currentVersion)
{
    var updates = {
        "2.00": updateUserandAnime,
        "2.01": updateXpath,
    };
    var promises = [];
    for (var i = parseFloat(preVersion); i <= parseFloat(currentVersion); i += .01)
    {
        var version = i.toFixed(2).toString();
        if (updates[version])
            promises.push(updates[version]);
    }
    return Promise.all(promises);
}

//"version": "2.00",
function updateUserandAnime()
{
    // need to add keys that didn't exist yet
    //that are needed for this new update

    //user update add keys that are missing
    return userManager.load()
        .then(function(keys)
        {
            if (typeof keys.providers === "undefined")
            {
                keys.providers = {
                    anilist: false,
                    myanimelist: false
                };
            }
            if (typeof keys.newtab === "undefined")
            {
                keys.newtab = false;
            }
            //TODO add the version of the app in here too from manifiest
            return userManager.save(keys);

        })
        //update the anime data
        .then(function()
        {
            return animeDataManager.load();
        })
        .then(function(animes)
        {
            for (var i = animes.length - 1; i >= 0; i--)
            {
                var total;
                //does total eps have 'out of 'X
                if (typeof animes[i]["totalEps"] === "string")
                {
                    total = animes[i]["totalEps"].substring(8, animes[i]["totalEps"].length);
                    animes[i]["totalEps"] = parseInt(total);
                    animes[i]["nextCheckForTotalEps"] = 0;
                }
                //value being used to check when to check for updates on  out of eps
                else
                {
                    animes[i]["nextCheckForTotalEps"] = animes[i]["totalEps"];
                }
            }
            return animeDataManager.save(animes);
        });
}

function updateXpath()
{
    return updateWebsiteManager.load()
        .then(function(websites)
        {
            websites.forEach(function(website)
            {
                if (website["xpath"].includes("xpath"))
                {
                    website["xpath"] = website["xpath"].replace('xpath=', '');
                    website["xpath"] = website["xpath"].replace(new RegExp('"', 'g'), '');
                    website["xpath"] = website["xpath"].replace('/\\', '');
                }
            });
            return updateWebsiteManager.save(websites);
        });
}