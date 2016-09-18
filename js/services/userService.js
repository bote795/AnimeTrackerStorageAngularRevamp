app.service('userSrv', function($rootScope)
{
    var self = this;
    this.user = {};

    this.load = function()
    {
        return userManager.load().then(function(data)
        {
            console.log("this is what the user value is: ");
            console.log(data);
            angular.copy(data, self.user);
            return {};
        });
    }
    this.get = function()
    {
        return self.user;
    }
    this.save = function()
    {
        userManager.save(self.user);
    }
});
