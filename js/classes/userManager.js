var userManager = function()
{
    this.key = "user";
}
inheritsFrom(userManager, Manager);
userManager.prototype.default = function()
{
    return {
        providers:
        {
            anilist: false,
            myanimelist: false
        },
        newtab: false
    };
};
var userManager = new userManager();


/*
keys
TODO: 
"providers":
	{
		anilist: bool,
		myanimelist: bool
	}
}
anilist{
	id
	username
	refresh_token
			access_token
			expires
			refresh_token
}
myanimelist{
	username (encoded)
	pass (encoded)
}

currently: only
["token"]
		["access_token"] token used to make calls
		["expires"]	
	["refresh_token"] token used to refresh
	["user"]
		["id"]
		["display_name"] 
["version"] version of the chrome extension
*/
