app.controller('updateWebsitesController', function($scope, $http, $routeParams) {
	$scope.isHtml=false; //is it html
	$scope.customHtml="";
	$scope.isCustomXpath =false;
	$scope.customXpath="";
	$scope.formUrl="";
	if ($routeParams.id) {
	$scope.detailId = $routeParams.id;
    }
	//default urls to get updates from
	$scope.defaultUpdateWebsites = function(){
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
	}
	$scope.addNew = function () {
		var temp = $scope.defaultValues($scope.formUrl, $scope.isHtml);
		$scope.testLink(temp);
	}

	$scope.animeUpdatesArray= $scope.defaultUpdateWebsites();
	$scope.resetUpdateWebsites = function(){
		$scope.animeUpdatesArray= $scope.defaultUpdateWebsites();
	}

	$scope.sortableOptions = {
	 	stop: function(e, ui) {
      		//saves new order automatically just need to call something to save to 
      		//localStorage or set sync

	    }, 
	    axis: 'y'
	 };
	//delete entry
	$scope.delete = function(website){
		var index= $scope.animeUpdatesArray.indexOf(website);
		$scope.animeUpdatesArray.splice(index,1);
	}

	$scope.defaultValues = function(url, isHtml)
	{
	  	var tempDict = {};
		tempDict["website"]=url;
		tempDict["xpath"]="//@href";
		tempDict["type"]=isHtml ? "rss" : "html";
		tempDict["domainNeeded"]=false;
		tempDict["domain"]="";
		return tempDict;
	}
	//creates the yqlapi request
	//taking in animePageInfo which contains the url of the webpage
	//and the xpath and if its type is html or rss
	//returns the complete url to yqlapi with the page we are going to retrieve data from
	$scope.queryCreationYqlAPI = function(animePageInfo)
	{
		var query="";
		if (animePageInfo["type"] == "html") 
			query = 'select * from html where url ="'+ animePageInfo["website"] +'" and '+animePageInfo["xpath"];
		else
			query ='select link from rss where url="'+animePageInfo["website"]+'"';
		var  yqlAPI= 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

		return yqlAPI;
	}
	//first attempt to check if inputed link is a valid link 
	//that can be used for yql api
	$scope.testLink= function (animePageInfo)
	{
		//work around since queryCreationApi doesn't automatically have xpath for this test
		animePageInfo["xpath"]="xpath='"+ animePageInfo["xpath"] +"'";
		var yqlAPI = $scope.queryCreationYqlAPI(animePageInfo);
		var test = false;
		var reply;
		var $target =$(".datareply");
		$http.get(yqlAPI)
		.then(function function_name (r) {
			console.log("sucessesfully sent request for yqlapi 1st attempt");
			console.log(r);
			//if any part of the data retrieved back is undefined return
			if($scope.checkForErrors(r))
			{
			  console.log(r);
			  console.log("Error");
			  $target.html("");
			  $target.append("Error");
			  $target.addClass('alert alert-dismissable alert-danger');  
			}
			//data seems to be good is it html or rss
			else if (animePageInfo["type"] == "html")
			{	
				$.each(r.data.query.results.a, function(){ 
	               if(typeof this.href === 'undefined')
	                {
	                  $target.html("");
	                  $target.append("Error");
	                  test = true;
	                  $target.addClass('alert alert-dismissable alert-danger');
	                  return false;
	                }
	                else
	                  return;
              	}); // close each

				if(!test)
				{
					console.log("sucess");  
					cutTest =(r.data.query.count/2);
					console.log( r.data.query.results.a[Math.floor(cutTest)].href);
					//display
					$target.html("");
					$target.append("Success <br> count:"+r.data.query.count+"<br>");
					
					reply =$scope.similarRegex(animePageInfo["website"],r.data.query.results.a[Math.floor(cutTest)].href);
					
					$target.append(reply.message);

					//check if url replyed by yql was good enough
					//if false then test main url or url specificly typed by user
					if (!reply.bool) 
					{
					  	$scope.addMainUrl(reply.url, reply.path, animePageInfo, $scope.isReady);
					}
					else
				   	{
						$target.addClass('alert alert-dismissable alert-success');                          
						$scope.isReady({bool: false}, animePageInfo);
				    }
				  
				}

			}
          	else //rss
            {
              var test = false;
               $.each(r.data.query.results.item, function(){ 
		         if(typeof this.link === 'undefined')
		          {
		            $target.html("");
		            $target.append("Error");
		            test = true;
		             $target.addClass('alert alert-dismissable alert-danger');

		            return false;
		          }
		          else
		            return;
		        }); // close each
               if(!test)
               {
                  $target.addClass('alert alert-dismissable alert-success');
                  console.log("sucess");
                  cutTest =(r.query.count/2);
                  console.log( r.query.results.item[Math.floor(cutTest)].link);
                  $target.html("");
                  $target.append("Success <br> count:"+r.query.count+"<br>");
                  reply=$scope.similarRegex(temp["website"],r.query.results.item[Math.floor(cutTest)].link);
                  $target.append(reply.message);
                  $scope.isReady({bool: false}, temp);
               }

            }

		}, function errorCallback(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    console.log(response);
	  });
	}
	//checks if a part of the yql api result url
	//is undefined if so return error / true
	$scope.checkForErrors = function(r)
	{
		if(typeof r === 'undefined'
		 || typeof r.data === 'undefined'
		 || typeof r.data.query === 'undefined'
		 || r.data.query.results == null
		 || typeof r.data.query.results === 'undefined'
		 || r.data.query.results.a == null
		 || typeof r.data.query.results.a === 'undefined')
		 
			return true;

		return false;
	}
	//check if url replyed by yql is good enough
	$scope.similarRegex = function(url, test_path){
	  var myregexp = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
	  var key = myregexp.exec(url);
	  console.log(key);
	  console.log(test_path);
	  var mymatch = myregexp.exec(test_path);
	  console.log(mymatch);
	  var string="";
	  if (mymatch === null) {
	    var print=true;
	    var tempString="";
	    for (var x = 1; x < 4; x++) {
	        if(typeof key[x] === 'undefined')
	        {
	          print =false;
	        }
	        else if (x == 3) 
	        {
	          tempString+=("."+key[x]);
	        }
	        else
	          tempString+=key[x];
	    }
	    if (print) 
	    {
	      //{bool:  , message: , url: string, path: string}
	      return {bool: false,message: "error in url returned by query <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>"+
	      "This means that the link recieved from website doesn't come with complete link to new episodes <br>",
	       url: tempString, path: test_path};
	    }
	    else
	      return {bool: false,message: "error in url returned by query <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>"+
	      "This means that the link recieved from website doesn't come with complete link to new episodes <br>",
	      url: "", path: test_path};
	  }
	  else if(key === null)
	  {
	    return {bool: false,message:  "error in url typed <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>",
	    url: "", path: ""};
	  }
	  else
	  {
	     string="test_path size:"+mymatch.length+" <br> url:"+ key.length+"<br>"+
	     "main url: "+url+"<br>"+"Example url: "+test_path+"<br>";
	    var counter=0;
	    for (var i = 1; i < key.length; i++) 
	    {
	      if(typeof key[i] === 'undefined' || typeof mymatch[i]=== 'undefined')
	        ;
	      else if(key[i] ==mymatch[i])
	        counter++;
	    }
	    string+= "Percentage of url being recieved from website : " + (counter/(key.length-2)) * 100+" %";
	    //return string;
	     return {bool: true,message: string,
	    url: "", path: ""};
	  }
	}
	 //attempt to check if only the main section of the url typed in or custom url typed
	 //works for fixing the route for the anime given by website
	$scope.addMainUrl = function(url, path, temp, callback)
	{
		var query;
		var sucessfulUrl;
		var $target = $(".datareply");
		if(temp["domainNeeded"])
		{
			query = 'select * from html where url ="'+ temp["domain"]+path +'" and xpath="//@href"';   
			sucessfulUrl=temp["domain"];
		}
		else
		{
			query = 'select * from html where url ="'+ url+path +'" and xpath="//@href"';
			sucessfulUrl=url;
		}
		console.log(query);
		var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
		$http.get(yqlAPI)
		.then(function(r){
			var cutTest;       
			if($scope.checkForErrors(r))
			{
			  console.log("Error");
			  $target.append("---------------------------------------------------------------");
			  $target.append("Error attempt to try better path didn't work <br> try custom url");
			  $("#custom").toggle();
			  $target.addClass('alert alert-dismissable alert-danger');

			  callback ({bool: false, url: ""}, temp);
			}
			else if(temp["type"]=="html")
			 {
			    $.each(r.data.query.results.a, function(){ 
			 if(typeof this.href === 'undefined')
			  {
			    $target.addClass('alert alert-dismissable alert-danger');
			    callback({bool: false, url: ""}, temp);
			  }
			  else
			    return;
			}); // close each
			$target.addClass('alert alert-dismissable alert-success');
			    console.log("2nd attempt sucess should return");  
			   $target.append("--------------------------------------------------------------- <br>");
			   $target.append("Success 2nd attempt <br> url: "+sucessfulUrl);
			   callback({bool: true, url: sucessfulUrl}, temp);
			 }
		});
	} 
	//filtering already went through link is ready to be submited
	$scope.isReady = function(MainUrlTest, temp) {
	    $("#confirmation").show();
	    var $target = $("#readysumbit");
	    $target.prop({ disabled: false});
	    //tested 2nd url either from user input or just mainurl from provided url
	    if(MainUrlTest.bool)
	    {
	      temp["domainNeeded"]=true;
	      temp["domain"]=MainUrlTest.url;
	      $("#output").append(JSON.stringify(temp));
	    }
	    else
	    {
	      //main url typed returned a url so should be workin.
	      $("#output").append(JSON.stringify(temp));
	        $target.prop('checked',true);
	       if(temp["website"] == "http://www.gogoanime.com/")
	       {
	          temp["xpath"]='xpath="//div[@class=\'post\']//li"';
	       }
	       if (temp["xpath"] == "//@href") 
	       {
	        temp["xpath"] = 'xpath="//@href"';
	       }
	    }
        //save url to list
       console.log(temp);
       $scope.animeUpdatesArray.push(temp);
       alert("successfully submitted");
       $scope.resetAddUpdatesUrl();
	}
	$scope.resetAddUpdatesUrl = function()
	{
	    $("#xpath").hide();
	    $("#custom").hide();
	    $("#confirmation").hide();
	    $("#addUpdates")[0].reset();
	    $("#output").html("");
	    $(".datareply").html("");

	}
});

