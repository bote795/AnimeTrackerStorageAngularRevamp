app.service('userSrv', function($rootScope)
{
    var self = this;
    this.user = {};
    userManager.load().then(function(data)
    {
        angular.copy(data, self.user);
    });

    this.get = function()
    {
        return self.user;
    }
    this.save = function()
    {
        userManager.save(self.user);
    }
});
