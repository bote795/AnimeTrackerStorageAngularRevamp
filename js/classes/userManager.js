var userManager =  function () {
    this.key = "user";
}
inheritsFrom(userManager, Manager);
updateWebsiteManager.prototype.default = function() {
  return {};
};
var userManager = new userManager(); 


/*
keys
"providers":
	{
		anilist: bool
	}
}
anilist{
	["token"]
		["access_token"] token used to make calls
		["expires"]	
	["refresh_token"] token used to refresh
	["user"]
		["id"]
		["display_name"]	
}

*/