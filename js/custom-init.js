//for default initialization

$(document).bind("mobileinit", function() {
	$.mobile.defaultPageTransition = 'none';
	$.mobile.buttonMarkup.hoverDelay = 0;
	$.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});