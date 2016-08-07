app.service('animeRetrieveSrv', function($rootScope){
	var self = this;
	this.animeArray =[];
    var spintarget = document.getElementById('foo');
    var spinner = new Spinner().spin(spintarget);
    
    animeDataManager.load(function(data) {
				self.set(data);
		    //check for updates then check for total eps
	    updates(function() {
	        FindTotalEps(function() {
		       animeDataManager.load(function(data) {
					self.set(data);
				});
	            spinner.stop();            
	        });
	    });
	});


	
	this.get = function(){
		return self.animeArray;
	}
	this.set = function(data_) {
    	self.animeArray = data_;
    	$rootScope.$broadcast('event:data-change');
  	}
});