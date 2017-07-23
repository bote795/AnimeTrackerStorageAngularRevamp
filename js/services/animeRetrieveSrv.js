app.service('animeRetrieveSrv', function($rootScope)
{
    var self = this;
    this.animeArray = [];
    this.checkForUpdates = function()
    {
        spintarget = document.getElementById('foo');
        self.spinner = new Spinner().spin(spintarget);
        //check for updates then check for total eps
        return updates()
            .then(function()
            {
                self.spinner.stop();
                return {};
            })
            .then(function()
            {
                return animeDataManager.load()
            })
            .then(function(data)
            {
                self.set(data);
                return {};
            });
    }
    animeDataManager.load().then(function(data)
    {
        self.set(data);
        return data;
    });
    $rootScope.$on('reloadAnime', function(event, args)
    {
        //reload anime
        animeDataManager.load().then(function(data)
        {
            self.set(data);
        });
        console.log("reloadAnime");
    });
    /**
     * edit saves edit for anime
     * @param  {object} anime    [anime object before edit]
     * field to update is the key, value is the value to update the field with
     * @param  {object} {key:  value} [object with key, value paires dictionary]
     */
    this.edit = function(anime, field)
    {
        //create array with names and use name to find it
        //since we cant just use anime since angular adds the haskey
        var key = self.animeArray.map(function(item)
        {
            return item.name;
        }).indexOf(anime.name);
        if (key > -1)
        {
            var keys = Object.keys(field);
            keys.forEach(function(item)
            {
                self.animeArray[key][item] = field[item];
            })
        }
        $rootScope.$apply();
    }

    this.get = function()
    {
        return self.animeArray;
    }
    this.set = function(data_)
    {
        angular.copy(data_, self.animeArray);
    }
    this.save = function()
    {
        return animeDataManager.save(self.animeArray);
    }
});
