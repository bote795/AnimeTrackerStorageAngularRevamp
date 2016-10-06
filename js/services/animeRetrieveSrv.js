app.service('animeRetrieveSrv', function($rootScope)
{
    var self = this;
    this.animeArray = [];
    try
    {
        if (typeof Spinner() !== "undefined")
        {
            var spintarget = document.getElementById('foo');
            self.spinner = new Spinner().spin(spintarget);
        }
    }
    catch (e)
    {

    }
    animeDataManager.load().then(function(data)
    {
        self.set(data);
        return data;
    }).then(function()
    {
        //check for updates then check for total eps
        if (typeof self.spinner !== "undefined")
        {
            updates()
                .then(FindTotalEps())
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
                });
        }
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
     * @param  {object} {key: , value:} [object with key, value dictionary]
     */
    this.edit = function(anime, field)
    {
        //create array with names and use name to find it
        //since we cant just use anime since angular adds the haskey
        var key = self.animeArray.map(function(item)
        {
            return item.name;
        }).indexOf(anime.name);
        if (key > 0)
        {
            self.animeArray[key][field.key] = field.value;
        }
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
