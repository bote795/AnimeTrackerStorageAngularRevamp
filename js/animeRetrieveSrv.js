app.service('animeRetrieveSrv', function($rootScope)
{
    var self = this;
    this.animeArray = [];
    var spintarget = document.getElementById('foo');
    self.spinner = new Spinner().spin(spintarget);

    animeDataManager.load().then(function(data)
    {
        self.set(data);
        return data;
    }).then(function()
    {
        //check for updates then check for total eps
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
     * @param  {object} newAnime [anime object edited]
     */
    this.edit = function(anime, newAnime)
    {
        var key = self.animeArray.indexOf(anime);
        if (key > -1)
        {
            self.animeArray[key] = newAnime;
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
        animeDataManager.save(self.animeArray);
    }
});
