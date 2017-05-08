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
    var promise = new Promise(function(resolve, reject)
    {
        var promises = [];
        for (var i = 0; i < animeUpdatesArray.length; i++)
        {
            promises.push(requestAnimeSite(animeUpdatesArray[i]));
        };
        $.when.apply($, promises).then(function()
        {
            var temp = arguments; // The array of resolved objects as a pseudo-array
            resolve(temp);
        });
    });
    return promise;
}
/*
sends requests to yql api 
for each website added to check for updates
@param animePageInfo for updates
  ["website"]
    ["xpath"]
    ["type"]
    ["domainNeeded"]
    ["domain"]
returns 
  promise
  urls: an array of urls from website with hopefully anime names inside the urls and ep numbers
  [might be complete url or just partial url, "sub", completed website where new ep should be at]
  website: website send to check
returns urls:[] for fail website: website send to check
*/
function requestAnimeSite(animePageInfo)
{
    var deferred = $.Deferred();
    var query;
    var updates = []; // will hold all updates
    if (animePageInfo["type"] == "html")
        query = 'select * from html where url ="' + animePageInfo["website"] + '" and ' + animePageInfo["xpath"];
    else
        query = 'select link from rss where url="' + animePageInfo["website"] + '"';
    var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
    $.getJSON(yqlAPI, function()
        {
            console.log("sucess");
        })
        .success(function(r)
        {
            //check if website is gogoAnime requires special treatement
            if (animePageInfo["website"] == "http://www.gogoanime.com/")
            {
                $.each(r.query.results.li, function()
                {
                    if (typeof this.font !== 'undefined') //are we getting wrong info don't get it
                    {
                        if (this.font.content != "(Raw)") //we dont need raw anime
                        {
                            updates.push([this.a.href, this.font.content, this.a.href]);
                        }
                    }
                }); // close each
            }
            //any other website
            else
            {
                //check query is good
                if (r.query !== 'undefined' && r.query.results !== null)
                {
                    //is type html or rss
                    if (animePageInfo["type"] == "html")
                    {
                        $.each(r.query.results.a, function()
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

                    }
                    else
                    {
                        $.each(r.query.results.item, function()
                        {
                            if (typeof this.link !== 'undefined')
                            {
                                updates.push([this.link, "(Sub)", (animePageInfo["domain"] + this.link)]);
                            }
                        }); // close each
                    }
                }
            } // close else
            deferred.resolve(
            {
                urls: updates,
                website: animePageInfo["website"]
            });
        }) // close sucess
        .fail(function(r)
        {
            console.log("fail");
            console.log(r);
            deferred.resolve(
            {
                urls: [],
                website: animePageInfo["website"]
            });
        });
    return deferred.promise();
}

/*
  Function does a request to wiki and sends
  anime names to check for the totoal number of eps for that anime
  returns promise
  promise will return nothing 
  
*/
function FindTotalEps()
{
    var promise = new Promise(function(resolve, reject)
    {
        animeDataManager.load().then(function(animeArray)
        {
            var promises = [];
            for (var i = 0; i < animeArray.length; i++)
            {
                promises.push(checkForTotalEps(animeArray[i]));
            };
            $.when.apply($, promises).then(function()
            {
                var temp = arguments; // The array of resolved objects as a pseudo-array
                var filtered = [];
                for (var i = 0; i < arguments.length; i++)
                {
                    if (temp[i] != null)
                    {
                        filtered.push(temp[i]);
                    }
                }
                /*
                  filtered fields
                  name: with the anime name
                  totalEps: 
                  if fount 'out of X' else will update the number plus 2
                  so that it will get checked later
                */
                for (var i = 0; i < filtered.length; i++)
                {
                    var x = 0;
                    for (x = 0; x < animeArray.length; x++)
                    {
                        if (filtered[i]["name"] == animeArray[x]["name"])
                        {
                            animeArray[x]["totalEps"] = filtered[i]["totalEps"];
                            break;
                        }
                    }
                }
                if (filtered.length > 0)
                {
                    animeDataManager.save(animeArray);
                }
                resolve();
            });
        });
    });
    return promise;
}
//Fuction sends a request to yql api to check 
//for total number of eps for that anime
//returns null if request not need to be done
function checkForTotalEps(animeInfo)
{
    var deferred = $.Deferred();
    var anime = animeInfo["name"];
    anime = encodeURIComponent(anime);
    url = "http://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=~" + anime;
    var query = 'select anime from xml where url="' + url + '"';
    var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
    //if chrome extension is old and hasn't been used field will not exist fix it
    if (typeof animeInfo["totalEps"] === 'undefined')
        animeInfo["totalEps"] = 0;
    //make sure that it doesn't already know the numbers of eps 
    //and its equal to the number of eps to reduce the number of times sent
    //or its equal to 0 hasnt been checked
    if (typeof animeInfo["totalEps"] !== "string" && (animeInfo["totalEps"] === animeInfo["ep"] || animeInfo["totalEps"] === 0))
    {
        var found = false;
        $.getJSON(yqlAPI, function()
            {
                //console.log("sucess");
            })
            .success(function(r)
            {
                if (r.query.results !== null)
                {
                    if (typeof r.query.results.ann.anime !== 'undefined')
                    {
                        $.each(r.query.results.ann.anime.info, function()
                        {
                            if (typeof this.type !== 'undefined')
                            {
                                if (this.type === "Number of episodes")
                                {
                                    console.log(anime);
                                    console.log(this.content);
                                    animeInfo["totalEps"] = " out of " + this.content;
                                    found = true;

                                }
                            }
                        });
                    }
                }
                if (!found)
                    animeInfo["totalEps"] = animeInfo["totalEps"] + 2;
                deferred.resolve(
                {
                    name: animeInfo["name"],
                    totalEps: animeInfo["totalEps"]
                });
            })
            .fail(function(r)
            {
                console.log("fail");
            });
    }
    else
    {
        deferred.resolve(null);
    }
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
        console.log("check link for new ep activated");
        cb();
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
    var temp = {};
    temp.refresh_token = keys;
    temp.providers = {
        anilist: true,
        myanimelist: false
    };
    userManager.load()
        .then(function(user)
        {
            temp.username = user.username;
            userManager.save(temp);
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
