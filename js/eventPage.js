/*  
  Listens to events send by scripts injected to pages
*/

function broswerActionHandler()
{
    userManager.load()
        .then(function(user)
        {
            if (user.newtab)
            {
                chrome.tabs.
                create(
                {
                    'url': chrome.extension.getURL('popup.html'),
                    'selected': true
                });
            }
            else
            {
                chrome.browserAction.setPopup(
                {
                    popup: "popup.html"
                });
            }
        });
}
chrome.browserAction.
onClicked.addListener(function(tab)
{
    broswerActionHandler();
});
//set the version on installation
chrome.runtime.onInstalled.addListener(function(details)
{
    if (details.reason == "install")
    {
        var currVersion = getVersion();
        userManager.load()
            .then(function(userData)
            {
                userData['version'] = currVersion;
                userManager.save(userData);
            });
        console.log("This is a first install!");
    }
    else if (details.reason == "update")
    {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

//filter anime removes following characters
// ! || : || ( || ) || / || & || ,
function filter(anime)
{
    var regex = /!|:|\(|\)|\/|\.|&|,/g;
    return anime.replace(regex, '');
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse)
    {
        //to add anime while surfing using shortcut
        if (request.method === "sendURL")
        {
            /*
              added it and trim text comining in
            */
            animeDataManager.load().then(function(anime)
            {
                // filtiring string so it will just be title of anime
                var temp = request.title.trim();
                temp = temp.toLowerCase();
                var temp2 = request.title.trim();
                //check if title has 'episode inside' if so remove it
                var badPams = [" - episode", " episode", "episode"];
                for (var i = 0; i < badPams.length; i++)
                {
                    if (temp.indexOf(badPams[i]) != -1)
                    {
                        temp2 = request.title.substring(0, temp.indexOf(badPams[i]));
                        break;
                    }
                }
                temp2 = filter(temp2);
                //checks for duplicate if so dont insert
                var duplicate = false;
                var titleColumn = 0;
                for (var i = 0; i < anime.length; i++)
                {
                    if (anime[i]["name"] == temp2)
                    {
                        duplicate = true;
                        break;
                    }
                }
                //duplication check finished
                // this is format inside array of urls or each anime title, ep, newep, url, homeurl,totalEps
                if (!duplicate)
                    anime.push(
                    {
                        name: temp2,
                        ep: 0,
                        isNewEpAvialable: 0,
                        newEpUrl: "url",
                        homeUrl: "home",
                        totalEps: 0,
                        nextCheckForTotalEps: 0
                    }); // 

                animeDataManager.save(anime);
                console.log("send url was activated");
                sendResponse(
                {
                    status: 200
                });
            }); // close callback for anime data retrieval 
        }
        //is url being visited a website where new ep is being watched?
        else if (request.method === "EpUpdate")
        {
            /*load anime
            check if url that is being sent has an anime listed in list
              if anime listed in list 
                check if its the next ep
                  add 1 to ep and save

            */
            var temp = request.sentUrl;
            temp = temp.toLowerCase();

            LinkContainsNewEp(temp, function()
            {
                sendResponse(
                {
                    status: 200
                });
            });
        } // close if
        else if (request.method === "EpUpdateFromTitle")
        {
            //title of web page
            var title = request.title;
            sendResponse(
            {
                status: 200
            });
        }
        else if (request.method === "updatePopup")
        {
            if (!request.newtab)
            {
                chrome.browserAction.setPopup(
                {
                    popup: "popup.html"
                });
            }
            else
            {
                chrome.browserAction.setPopup(
                {
                    popup: ""
                });
            }
            sendResponse(
            {
                status: 200
            });
        }
    });

//30min = 1800000 milliseconds
//UpdateRequest();

setInterval(function()
{
    updates();
}, 1800000);
