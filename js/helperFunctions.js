var apiUri = "https://anime-scraper.herokuapp.com/";
/*
  checks for New Eps for the animes returns promise
  params:
  @param animeUpdatesArray, array with each index with folling fieldS:
  ["website"]
    ["xpath"]
    ["type"]
    ["domainNeeded"]
    ["domain"]
    promise will contain
    array of objects containg:
    website: name 
    urls: array of arrays
    [might be complete url or just partial url,
     "sub",
      completed website where new ep should be at]
*/
function checkForNewEps(animeUpdatesArray)
{
    return massageRemoteData();
}

/*
returns 
  promise
  urls: an array of urls from website with hopefully anime names inside the urls and ep numbers
  [might be complete url or just partial url, "sub", completed website where new ep should be at]
  website: website send to check
returns urls:[] for fail website: website send to check
*/
function massageRemoteData()
{
    var result = [];
    /*
        urls,
        website
     */
    return getAllWebsitesData()
        .then(function(remoteData)
        {
            remoteData.forEach(
                function(animePageInfo)
                {
                    var updates = [];
                    if (animePageInfo["type"] == "html")
                    {
                        $.each(animePageInfo.data.a, function()
                        {
                            if (typeof this.href !== 'undefined')
                            {
                                if (animePageInfo["domainNeeded"]) //do we need to add the domain to the url
                                {
                                    updates.push([this.href, "(Sub)", (animePageInfo["domain"] + this.href)]);
                                }
                                else
                                {
                                    updates.push([this.href, "(Sub)", this.href]);
                                }

                            }
                        }); // close each
                        result.push(
                        {
                            urls: updates,
                            website: animePageInfo["website"]
                        })
                    }
                });
            return result;
        });
}
/**
 * [getAllWebsitesData sends all uris to api to get data]
 * @return {Object} response from api
 */
function getAllWebsitesData()
{
    var deferred = $.Deferred();
    var animeData = [];
    updateWebsiteManager
        .load()
        .then(function(data)
        {
            var arrayUris = [];
            data.forEach(function(animeWebData)
            {
                arrayUris.push(animeWebData["website"]);
            })
            animeData = data;
            return arrayUris;
        })
        .then(function(arrayUris)
        {
            return getapiAnimeData(arrayUris)
        })
        .then(function(data)
        {
            data.forEach(function(animeRespObj)
            {
                var localAnimeData = animeData.filter(function(websiteData)
                {
                    return websiteData["website"] == animeRespObj["uri"];
                });
                var anime = localAnimeData[0];
                Object.assign(animeRespObj, anime);
            });
            deferred.resolve(data);
        });
    return deferred.promise();
}

/**
 * [getapiAnimeData request to get data for the specific uris]
 * @param  {array} arrayOfUris array of strings
 * @return {Object}             response object 
 */
function getapiAnimeData(arrayOfUris)
{
    var deferred = $.Deferred();
    var buildQuery = "";
    for (var i = arrayOfUris.length - 1; i >= 0; i--)
    {
        buildQuery += "uri=" + encodeURIComponent(arrayOfUris[i]);
        if (i - 1 >= 0)
        {
            buildQuery += "&";
        }
    }

    var uri = apiUri + "uris?" + buildQuery;
    $.getJSON(uri)
        .success(function(r)
        {
            if (r.status === "ok")
            {
                deferred.resolve(
                    r.data);
            }

        })
        .fail(function(r)
        {
            console.log(r);
            deferred.reject();
        });
    return deferred.promise();
}

function addURITo(animePageInfo)
{
    var deferred = $.Deferred();
    var uri = apiUri + "addUri";
    var dataUri = "http://www.animefreak.tv/tracker"; //animePageInfo["website"]
    var xpath = "//div[@class='view-content']//tbody//tr//@href"; //animePageInfo["xpath"]    
    $.post(uri,
        {
            "uri": dataUri,
            "xpath": xpath
        })
        .done(function(r)
        {
            if (r.status === "ok")
            {
                console.log(r.data);
                deferred.resolve(r.data);
            }
            else
            {
                console.log("failed");
                deferred.reject();
            }

        })
        .fail(function(r)
        {
            console.log(r);
        });
    return deferred.promise();
}

/*
  @params
  @url 
    url that is being checked if theres a new ep
  @Name
    name of anime
  @ep
    current episode of that anime
  returns boolean
  true 
    if it is the next ep
  otherwise 
    false
*/
function NextEp(url, Name, ep)
{
    var words = [];
    var numberPattern = /\d+/g;
    if (typeof ep !== "number")
    {
        ep = parseInt(ep);
    }
    Name = Name.toLowerCase();
    words = Name.split(new RegExp("\\s+"));
    //finds a part of name and creates a substring from where that part of the url starts and the remainder of url
    for (var i = 0; i < words.length; i++)
    {

        if (url.indexOf(words[i]) != -1)
        {
            url = url.substring(url.indexOf(words[i]) + words[i].length, url.length);
        }
        else
            return false;
    }
    //looks for episode then episode # by creating substrings
    //if episode isn't found then it just looks for episode number to account for websites that don't write in episode
    var numbers = url.match(numberPattern);
    if (numbers != null)
        if (url.indexOf("episode") != -1)
        {
            url = url.substring(url.indexOf("episode") + "episode".length, url.length);
            if ((ep + 1) == parseInt(url.match(numberPattern)[0]))
            {
                return true;
            }
            else
                return false;
        }
        else if ((ep + 1) == parseInt(url.match(numberPattern)[0]))
    {
        return true;
    }
    else
        return false
    else
        return false;

}

function checkForEpisode(title, Ep)
{
    //check if string contains episode/ep/e and the digit
    var expr = /(Episode|ep|e)\s*(\d{1,4})/gmi;
    var results = expr.exec(title);
    if (!results)
    {
        return false;
    }
    var ep = results[2];
    return (Ep + 1) == ep;

}

function notificationClicked(ID)
{
    var x = JSON.parse(ID);
    console.log("clicked:" + parseInt(x.id));
    ga('send', 'event', "notification", "notification", "clicked on notification for anime new ep");
    var temp = x.url;
    temp = temp.toLowerCase();
    LinkContainsNewEp(temp, function()
    {
        console.log("updated ep number");
        window.open(x.url);
    });
}

/*
  check for updates
  check if theres a new ep for any of the animes 
  in list and update info accordingly
*/
function updates()
{
    var promise = new Promise(function(resolve, reject)
    {
        var promiseChain = updateWebsiteManager.load().then(checkForNewEps);
        Promise.all([animeDataManager.load(), updateWebsiteManager.load(), promiseChain]).then(function(valueArray)
        {
            //valueArray
            //first array anime
            var anime = valueArray[0];
            //second anime updatesArray
            var animeUpdatesArray = valueArray[1];
            //third is data
            var data = valueArray[2];
            for (var i = 0; i < animeUpdatesArray.length; i++)
            {
                //find from data retrieve the website in order
                //so we can check the websites in order
                var j;
                for (j = 0; j < data.length; j++)
                {
                    if (animeUpdatesArray[i]["website"] == data[j]["website"])
                        break;
                }
                //for the website with that data
                //lets check that one first for any new eps
                var hrefs = data[j]["urls"];
                for (var a_i = 0; a_i < anime.length; a_i++)
                {
                    for (var x = 0; x < hrefs.length; x++)
                    {
                        if (anime[a_i]["isNewEpAvialable"] != 1 && NextEp(hrefs[x][0], anime[a_i]["name"], anime[a_i]["ep"]))
                        {
                            var temp = "New Episode is up for ";
                            var Messagex = "";
                            anime[a_i]["isNewEpAvialable"] = 1;
                            anime[a_i]["newEpUrl"] = hrefs[x][2];
                            Messagex = Messagex.concat(temp, anime[a_i]["name"]);
                            var opt = {
                                type: "basic",
                                title: "New Episode",
                                message: Messagex,
                                iconUrl: "assets/icon.png"
                            }
                            chrome.notifications.create(JSON.stringify(
                                {
                                    id: a_i,
                                    url: hrefs[x][2]
                                }), opt,
                                function()
                                {
                                    console.log("Succesfully created " + a_i + " notification");
                                });
                            chrome.notifications.onClicked.addListener(notificationClicked);
                            break;
                        }
                        else if (typeof NextEp(hrefs[x][0], anime[a_i]["name"], anime[a_i]["ep"]) === 'undefined')
                        {
                            console.log("NextEp: undefined returned")
                            console.log(hrefs[x][0] + " : " + anime[a_i]["name"] + " : " + anime[a_i]["ep"])

                        }
                    }; // close href loop
                }; //close anime loop
            }; //end up main for loop
            //save new anime data
            animeDataManager.save(anime);
            setBadgeNumbers(anime);
            return resolve();
        })
    });
    return promise;
}

function setBadgeNumbers(anime)
{
    var numberOfUpdates = 0;
    for (var i = 0; i < anime.length; i++)
    {
        if (anime[i]["isNewEpAvialable"])
        {
            numberOfUpdates++;
        }
    }
    if (numberOfUpdates > 0)
    {
        chrome.browserAction.setBadgeText(
        {
            text: "" + numberOfUpdates
        });
    }
    else
    {
        chrome.browserAction.setBadgeText(
        {
            text: ""
        });
    }
}
/*
Function to check if link is for watching a new episode
*/
function LinkContainsNewEp(temp, cb)
{
    animeDataManager.load().then(function(anime)
    {


        for (var i = 0; i < anime.length; i++)
        {
            var name = anime[i]["name"];
            if (NextEp(temp, name, anime[i]["ep"]))
            {
                anime[i]["ep"]++;
                anime[i]["isNewEpAvialable"] = 0;
                anime[i]["newEpUrl"] = "url";
                break;
            }
        }
        animeDataManager.save(anime);
        setBadgeNumbers(anime);
        console.log("check link for new ep activated");
        cb();
    });
}

//check manifest what version is currently running
function getVersion()
{
    var details = chrome.app.getDetails();
    return details.version;
}

function callupdate(prevVersion, currVersion)
{
    return onUpdate(prevVersion, currVersion)
        .then(function()
        {
            return userManager.load();
        })
        .then(function(userData)
        {
            if (userData === [])
            {
                userData = {};
            }
            //need to update the version
            userData['version'] = currVersion;
            return userManager.save(userData);
        });
}

function checkIfVersionChanged()
{
    var promise;
    var currVersion = getVersion();
    return userManager.load()
        .then(function(userData)
        {
            var prevVersion = userData["version"];
            if (currVersion != prevVersion)
            {

                if (typeof prevVersion === "undefined")
                {
                    return callupdate("1.99", currVersion);
                }
                else
                {
                    return callupdate(prevVersion, currVersion);
                }
            }
            else
                return Promise.resolve();
        });
}
///////////////////////////////
// Functions for controllers //
///////////////////////////////

//reset fields to see if there is a new ep
function resetNewEpFields(anime)
{
    anime["isNewEpAvialable"] = 0;
    anime["newEpUrl"] = "url";
}
//update anime episode and default values
function updateLocalValues(anime, ep)
{
    anime.ep = ep;
    resetNewEpFields(anime);
}
/**
 * [anilistEditor function to edit the animes episode]
 * @param  {[type]} anime [anime object]
 * @param  {[type]} ep    [epsiode number to change too]
 * @return {[type]}       [none]
 */
function anilistEditor(anime, ep, animeRetrieveSrv, anilistFac)
{
    //if a list provider need to try to contact api
    if (anime.provider)
    {
        if (anime.anilist)
        {
            anilistFac.updateAnime(
                    anime.id,
                    {
                        episodes_watched: ep
                    }
                )
                .then(function(response)
                {
                    updateLocalValues(anime, ep);
                    animeRetrieveSrv.edit(anime,
                    {
                        "ep": ep,
                        "isNewEpAvialable": anime["isNewEpAvialable"],
                        "newEpUrl": anime["newEpUrl"]
                    });
                    animeRetrieveSrv.save();
                    setBadgeNumbers(animeRetrieveSrv.get());
                });
        }
    }
    //just update and save to sync
    else
    {
        updateLocalValues(anime, ep);
        animeRetrieveSrv.edit(anime,
        {
            "ep": ep,
            "isNewEpAvialable": anime["isNewEpAvialable"],
            "newEpUrl": anime["newEpUrl"]
        });
        animeRetrieveSrv.save();
        setBadgeNumbers(animeRetrieveSrv.get());
    }
}
/**
 * saveAnilist saves the items returned by anilogin 
 * @param  {object} keys [keys access_token,expires, refresh_token]
 */
function saveAnilist(keys)
{
    userManager.load()
        .then(function(user)
        {
            user.refresh_token = keys;
            user.providers = {
                anilist: true,
                myanimelist: false
            };
            userManager.save(user);
        });
}
/**
 * savemyanimelist saves the my animelist object on user
 * @param  {object} keys username, password
 */
function savemyanimelist(keys)
{
    keys.providers = {
        anilist: false,
        myanimelist: true
    };
    userManager.save(keys);
}


function howMuchMemoryInUse()
{
    chrome.storage.sync.getBytesInUse(
        ["savedAnimes", "savedUpdateAnimeList", "user"],
        function(num)
        {
            console.log(num + "in bytes");
        })
}
