/*popup.html script so when new eps are clicked they get registered as watching
the next ep
this makes it work when website loading and fully loaded
*/
(function(){
    var jqReady = $.Deferred();
    // Bind doc ready to my deferred object
    $(document).bind("ready", jqReady.resolve);
    // Check to see is doc is ready
    var handler = function(e) {
       if (isSimpleClick(e)) {
          body(e);
        }
    };
    if(jqReady.state() !== 'resolved'){
        $('a').on('click', handler);
        
    }
    $.when(jqReady).then(function () {
        $('a').unbind('click', handler);
        // Code here will run when doc is ready/ state === 'resolved'
      $('a').on('click', handler);
    });


var isSimpleClick = function (event) {
  return (
    event.which   || // not a left click
    event.which ==3 ||
    event.metaKey ||     // "open link in new tab" (mac)
    event.ctrlKey ||     // "open link in new tab" (windows/linux)
    event.shiftKey    // "open link in new window"
  );
};
function body(e){
  chrome.runtime.sendMessage({method: "EpUpdate",
                            sentUrl: e.currentTarget.href,
                            title: $(e.currentTarget).text() },
  function (response) {
    if (response.status === 200) {
     // $(e.target).css("color", "green");
    }
  });
}
})();