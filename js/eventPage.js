/*  
  Listens to events send by scripts injected to pages
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //to add anime while surfing using shortcut
    if (request.method === "sendURL") {
      /*
        check if anime is a duplicate if it isn't
        added it and trim text comining in
      */
      sendResponse({status: 200});
    }
    //is url being visited a website where new ep is being watched?
    else if (request.method === "EpUpdate") { 
      /*load anime
      check if url that is being sent has an anime listed in list
        if anime listed in list 
          check if its the next ep
            add 1 to ep and save

      */    
      sendResponse({status: 200});
    } // close if
    
});
/*
  check for updates
  check if theres a new ep for any of the animes 
  in list and update info accordingly
*/
function  updates() {
  var anime = animeDataManager.load();
  var animeUpdatesArray = updateWebsiteManager.load();
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
              chrome.notifications.create( JSON.stringify({id: e ,url: hrefs[i][2] }), opt,
               function() {
                  console.log("Succesfully created " + e + " notification");
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
  });
}