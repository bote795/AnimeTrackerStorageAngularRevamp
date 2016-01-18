/*  
  Listens to events send by scripts injected to pages
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //to add anime while surfing using shortcut
    if (request.method === "sendURL") {
      /*
        added it and trim text comining in
      */
      animeDataManager.load(function (anime) {
        // filtiring string so it will just be title of anime
        var temp= request.title.trim();
        temp =temp.toLowerCase();
        var temp2 = request.title.trim();
        //check if title has 'episode inside' if so remove it
        var badPams = [" - episode"," episode", "episode"];
        for (var i = 0; i < badPams.length; i++) {
          if(temp.indexOf(badPams[i])!= -1)
          {
            temp2 = request.title.substring(0,temp.indexOf(badPams[i]));
            break;
          }
        }
        //checks for duplicate if so dont insert
        var duplicate = false;
        var titleColumn =0;
       for (var i = 0; i < anime.length; i++) {
         if(anime[i]["name"] == temp2)
         {
            duplicate = true;
            break;
         }
       }
       //duplication check finished
       // this is format inside array of urls or each anime title, ep, newep, url, homeurl,totalEps
        if(!duplicate)
          anime.push(
            {name: temp2,
             ep: 0,
             isNewEpAvialable: 0,
             newEpUrl: "url",
             homeurl: "home",
             totalEps: 0
            }
          ); // 
        
        animeDataManager.save(anime);
        console.log("send url was activated");
        sendResponse({status: 200});
      }); // close callback for anime data retrieval 
    }
    //is url being visited a website where new ep is being watched?
    else if (request.method === "EpUpdate") { 
      /*load anime
      check if url that is being sent has an anime listed in list
        if anime listed in list 
          check if its the next ep
            add 1 to ep and save

      */    
      animeDataManager.load(function (anime) {
        var temp= request.sentUrl;
        temp =temp.toLowerCase();
        
        for (var i = 0; i < anime.length; i++) 
        {
          var name =anime[i]["name"];
          if(NextEp(temp,name,anime[i]["ep"]))
          {
            anime[i]["ep"]++;
            anime[i]["isNewEpAvialable"]=0;
            anime[i]["newEpUrl"]="url";
            break;
          }
        }
        animeDataManager.save(anime);
        console.log("check link for new ep activated");
        sendResponse({status: 200});
      });
    } // close if
});
/*
  check for updates
  check if theres a new ep for any of the animes 
  in list and update info accordingly
*/
function  updates(callback) {
  animeDataManager.load(function (anime) {
    updateWebsiteManager.load(function(animeUpdatesArray) {
      checkForNewEps(animeUpdatesArray, function (data) {
        for (var i = 0; i < animeUpdatesArray.length; i++) {
          //find from data retrieve the website in order
          //so we can check the websites in order
          var j;
          for(j =0; j < data[j].length 
            && animeUpdatesArray[i]["website"] == data["website"];j++);
          //for the website with that data
          //lets check that one first for any new eps
          var hrefs=data[j]["urls"];
          for (var a_i = 0; a_i < anime.length; a_i++) {
            for (var x = 0; x < hrefs.length; x++) {
              if( anime[a_i]["isNewEpAvialable"] !=1
                  && NextEp(hrefs[x][0],anime[a_i]["name"],anime[a_i]["ep"]))
              {
                 var temp="New Episode is up for ";
                 var Messagex ="";
                 anime[a_i]["isNewEpAvialable"]=1;
                 anime[a_i]["newEpUrl"]=hrefs[x][2];
                 Messagex=Messagex.concat(temp,anime[a_i]["name"]);             
                   var opt = {
                    type: "basic",
                    title: "New Episode",
                    message: Messagex,
                     iconUrl: "assets/icon.png"
                  }
                  chrome.notifications.create( JSON.stringify({id: a_i ,url: hrefs[x][2] }), opt,
                   function() {
                      console.log("Succesfully created " + a_i + " notification");
                  });
                  chrome.notifications.onClicked.addListener(notificationClicked);
                  break;
              }
             else if(typeof NextEp(hrefs[x][0],anime[a_i]["name"],anime[a_i]["ep"]) === 'undefined')
              {        
                    console.log("NextEp: undefined returned")    
                    console.log(hrefs[x][0] +" : "+ anime[a_i]["name"]+" : "+anime[a_i]["ep"] )
              
              }
            };// close href loop
          };//close anime loop
        };//end up main for loop
        //save new anime data
        animeDataManager.save(anime);
        if (typeof callback === 'function')
        {
          callback();
        }
      });
    });
  });
}
//30min = 1800000 milliseconds
//UpdateRequest();
//setInterval(function(){updates();},1800000);