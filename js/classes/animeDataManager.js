var animeDataManager =  function () {
    this.key = "savedAnimes";
}
inheritsFrom(animeDataManager, Manager);
animeDataManager.prototype.default = function() {
    var animes =JSON.parse("[[\"\\n\\t\\tDungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka\",8,1,\"http://www.animefreak.tv/watch/dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-episode-9-online\",\"home\",10],[\"\\n\\t\\tFate/Stay Night: Unlimited Blade Works (TV)\",14,0,\"url\",\"home\",2],[\"\\n\\t\\tKekkai Sensen\",8,0,\"url\",\"home\",2],[\"\\n\\t\\tVampire Holmes\",7,0,\"url\",\"home\",4],[\"Arslan Senki\",8,0,\"url\",\"home\",2],[\"Fairy Tail 2014\",59,0,\"url\",\"http://www.animefreak.tv/watch/fairy-tail-2014-online\",2],[\"Gunslinger Stratos: The Animation\",7,0,\"url\",\"home\",4],[\"Marvels agents of s h i e l d s2\",19,0,\"url\",\"home\",20],[\"One Piece\",725,0,\"url\",\"home\",2],[\"Owari no Seraph\",8,0,\"url\",\"home\",10],[\"World Trigger\",31,0,\"url\",\"home\",\" out of 50\"]]");
    var animeArray=[];
	for (var i = 0; i < animes.length; i++) {
	  var tempDict={};
	  tempDict["name"] = animes[i][0].trim();
	  tempDict["ep"] = animes[i][1];
	  tempDict["isNewEpAvialable"] = animes[i][2];
	  tempDict["newEpUrl"] = animes[i][3];
	  tempDict["homeUrl"] = animes[i][4];
	  tempDict["totalEps"] = animes[i][5];
	  animeArray.push(tempDict);
	};
	return animeArray;
};
var animeDataManager = new animeDataManager(); 