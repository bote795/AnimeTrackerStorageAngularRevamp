/*  
  Listens to events send by scripts injected to pages
*/
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
                        totalEps: 0
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
    });

//30min = 1800000 milliseconds
//UpdateRequest();

setInterval(function()
{
    updates();
}, 1800000);
