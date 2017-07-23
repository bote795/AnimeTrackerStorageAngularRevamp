//added wrappers for promises so they get executed when its time not when its loaded
function onUpdate(preVersion, currentVersion)
{
    var updates = {
        "2.00": function()
        {
            return updateUserandAnime();
        },
        "2.01": function()
        {
            return updateXpath();
        },
    };
    var promises = [];
    for (var i = +(parseFloat(preVersion) + .01).toFixed(12); i <= parseFloat(currentVersion); i = +(i + 0.01).toFixed(12))
    {
        var version = i.toString();
        if (updates[version])
            promises.push(updates[version]);
    }
    return executeSequentially(promises);
}

//execute promises sequentially
function executeSequentially(promiseFactories)
{
    var result = Promise.resolve();
    promiseFactories.forEach(function(promiseFactory)
    {
        result = result.then(promiseFactory);
    });
    return result;
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