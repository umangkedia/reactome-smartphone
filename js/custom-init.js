//for default initialization

$(document).bind("mobileinit", function(){
	console.log("JQM loaded");
	$.mobile.defaultPageTransition = 'slidefade';  
	$.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});