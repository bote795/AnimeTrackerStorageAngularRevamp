var userManager = function()
{
    this.key = "user";
}
inheritsFrom(userManager, Manager);
userManager.prototype.default = function()
{
    return {};
};
var userManager = new userManager();


/*
keys
TODO: 
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


currently: only
["token"]
		["access_token"] token used to make calls
		["expires"]	
	["refresh_token"] token used to refresh
	["user"]
		["id"]
		["display_name"] 
*/
