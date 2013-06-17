//main js file

$(document).bind('pageinit' , function () 		
{
	//for parsing xml hierarchy
	xmlParser = function(xml,ul) {
		console.log(xml);
		$(xml).find("Pathway").each(function(i, el)
		{
			console.log(el.nodeName);
			if(el.nodeName.toUpperCase() == "PATHWAY")
			{
				console.log($(this).attr("displayName"));
				$("<li>").text($(this).attr("displayName")).appendTo($(ul).find('ul:last')); 
				ul=$(ul).find('li:last').append('<ul>');
				$(ul).find('li').last().append(xmlParser($(el),$("ul:last")));
			}
		});
		return ul;
	}
	
	console.log("page loaded");
	$.ajax({
        type: 'GET',
        url: 'http://reactomews.oicr.on.ca:8080/ReactomeRESTfulAPI/RESTfulWS/pathwayHierarchy/homo+sapiens',
        dataType: 'xml',
        success: function(data){
			var $ul= xmlParser(data,$('#pathwayList'));
		},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("error :"+XMLHttpRequest.responseText);
        }
    });
	
	
});