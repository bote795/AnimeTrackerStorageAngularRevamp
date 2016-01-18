var Manager = function() {
	//key for storing tasks
    this.key = "key";
 };  
Manager.prototype.default = function(){     
    return [];
};
/*
    sends data back to callback
    Need callback since it doesn't instantly send data
    works kinda liek ajax call
*/
Manager.prototype.load = function(callback){
    var tempThis=this;
    chrome.storage.sync.get(this.key, function(obj) {
        //no error and the key is defined 
        //return data
        if (!chrome.runtime.error && obj[tempThis.key] != undefined) 
        {
            callback(obj[tempThis.key]);
        }
        //if key is undefined
        else if (!chrome.runtime.error)
        {
            var data;
            //new user didn't have to upgrade
            if (localStorage[this.key]=== undefined) 
            {
                //lets save the default values and key
                data=tempThis.default();
            }
            /*
                upgrade from localStorage to sync
                retrieve data from localstorage and
                fix format to new format 
                save to sync
            */
            else
            {
                data =tempThis.upgrade();
            }
            tempThis.save(data)
            callback(data);
        }
        else if(chrome.runtime.error)
        {
            console.log("error");
            console.log(chrome.runtime.error);
        }
    }); 
};
Manager.prototype.upgrade = function () {
  return [];
}
Manager.prototype.save = function(array){
    var save={};
    save[this.key]=array;
	chrome.storage.sync.set(save, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        console.log("saved data successfuly")
    });
};
var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};