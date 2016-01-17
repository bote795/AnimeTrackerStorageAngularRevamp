var updateWebsiteManager =  function () {
    this.key = "savedUpdateAnimeList";
}
inheritsFrom(updateWebsiteManager, Manager);

updateWebsiteManager.prototype.default = function() {
  return [
    {
      domain: "http://www.lovemyanime.net",
      domainNeeded: true,
      type: "html",
      website: "http://www.lovemyanime.net/latest-anime-episodes/",
      xpath: 'xpath="//div[@class=\'noraml-page_in_box_mid\']//div[@class=\'noraml-page_in_box_mid_link\']//@href"'
    },
    {
      website: "http://www.animefreak.tv/tracker",
      domainNeeded: true,
      type: "html",
      domain: "http://www.animefreak.tv",
      xpath: 'xpath="//div[@class=\'view-content\']//tbody//tr//@href"'       
    },
    {
      website: "http://www.animeseason.com/",
      domainNeeded: true,
      type: "html",
      domain: "http://www.animeseason.com",
      xpath: 'xpath="//div[@id=\'frontpage_left_col\']//@href"'       
    },
    {
      website: "http://www.gogoanime.com/",
      domainNeeded: false,
      type: "html",
      domain: "",
      xpath: 'xpath="//div[@class=\'post\']//li"'       
    }
  ];
};

var updateWebsiteManager = new updateWebsiteManager(); 