app.service('userSrv', function($rootScope)
{
    var self = this;
    this.user = {};
    this.userSignedIn = false;
    this.load = function()
    {
        return userManager.load().then(function(data)
        {
            console.log("this is what the user value is: ");
            console.log(data);
            angular.copy(data, self.user);
            angular.copy(self.userSignedIn(), self.userSignedIn);
            return {};
        });
    }
    this.get = function()
        {
            return self.user;
        }
        //dict is a key value pair object
    this.edit = function(dict)
    {
        //go through dictionary gey keys
        var array = Object.keys(dict);
        //for each key save the new value
        array.forEach(function(item)
        {
            self.user[item] = dict[item];
        });
    }
    this.save = function()
    {
        userManager.save(self.user);
    }
    this.userSignedIn = function()
    {
        if (typeof self.user["token"] != "undefined")
        {
            return true;
        }
        return false;
    }
    this.getSignedIn = function()
    {
        return self.userSignedIn;
    }
    this.getCurrentAPI = function()
    {
        return "anilist";
    }
});
