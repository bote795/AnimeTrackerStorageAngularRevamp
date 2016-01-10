var app = angular.module('myApp', []);

app.directive('testDirective', function($compile) {
    return {
        restrict: 'EAC',
        template: '<button type="button" class="btn btn-default" data-container="body" data-toggle="popover"'+ 
                            'data-content=' +
                            '<form id=\"homelink\" class=\"form-horizontal\">'+
			                  '<fieldset>' +
			                    '<div class=\"form-group\">'+
			                      '<div class=\"col-lg-3\">'+
			                        '<input type=\"text\" class=\"form-control\" id='+i+' name=\"animeHome\" placeholder=\"Enter animes home url\">'+
			                        '<button type=\"submit\" class=\"btn btn-primary\" ng-click=\"test(anime)\">Submit</button>'+
			                      '</div>'+
			                    '</div>'+
			                 ' </fieldset><!--end fieldset -->'+
			              '</form>'+
                    'data-original-title="" title="" data-placement="left">Link</button>',
        scope:{},
	    controller : "@",
	    name:"controllerName", 

        link: function(scope, elements, attrs) {
            $('[data-toggle="popover"]').popover({
                'placement': 'top',
                'trigger': 'click',
                'html': true,
                'container': 'body',
                'content': function() {
                    return $compile($("#homelink").html())(scope);
                }
            });
  
        }
        ,
    }
});
/*        "<a id='pop-over-link' style='position: fixed; top: 100px; left: 100px;'>Show pop-over</a>" +
                  "<div id='pop-over-content' style='display:none'><button class='btn btn-primary' ng-click='testFunction()'>Ok</button></div>",*/