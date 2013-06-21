var speciesAjax =0,speciesData; //to check whether we have got the species list before

$(document).on('pagebeforeshow', '[data-role="page"]', function()
{
	//workaround to include panel on every page
	if($.mobile.activePage.find('#sideBar').length ==0)
	{
		$('<div>').attr({
			'id':'sideBar',
			'data-role':'panel',
			'data-position':'right',
			'data-display': 'overlay',
			'data-theme':'c',}).appendTo($(this));
		
		fillSidebar($.mobile.activePage.find('#sideBar'));
		createControlGroup();		
	}
	else markSidebar();	
	
	$(document).on('click', '#open-panel', function(){   
         $.mobile.activePage.find('#sideBar').panel("open");    
	});
    
	$(document).on('swipeleft', 'body', function(){   
         $.mobile.activePage.find('#sideBar').panel("open");       
    });
});

//front page change based on species
$(document).bind('ready' , function () {	
	
	$('body').on("click","#sideBar li",function(e) {
		console.log("sidebar clicked"+$(this).text());
		currentSpecies=$(this).text();
		$.mobile.activePage.find('#sideBar').panel("close"); 
		$.mobile.changePage("#frontPage");
		$('#pathwayList').empty();
		ajaxCaller(frontPageURLFor($(this).text()),jsonParser,$("#pathwayList"));
	});
});

function fillSidebar(panel){
	createSidebar(speciesData,panel);
}

function setSpeciesData(data,selector){
	speciesData=data;
	createSidebar(speciesData,$.mobile.activePage.find('#sideBar'));
}

createSidebar = function(data, selector) {
	
	if(typeof data!=="undefined")
	{
		selector.empty();
		var list = $('<ul data-role="listview" data-theme="c" data-inset="false" id="ulSidebar">');	
		list.append("<li data-theme='b' style='text-align:center;'>Switch Species</li>");
		for (var i in data) {
			list.append("<li id=" + data[i].dbId + " data-icon='false'><a href='#'>" + data[i].displayName + "</a></li>");
		}
		selector.append(list);
		list.listview();
		$.mobile.activePage.find('#sideBar').panel(); //.panel() must be called when something is inserted in panel
		markSidebar();
	}		
}

function createControlGroup() //create dynamic control group on every page
{
	//http://jsfiddle.net/androdify/WAzs6/
	var $ctrlgrp = $("<div/>", {
		"data-type": "horizontal",
		"data-role": "controlgroup",
		"class": "ui-btn-right",
		"data-mini": "true"
	});
	$.mobile.activePage.find('div[data-role="header"]').append($ctrlgrp);
	$.mobile.activePage.trigger('create');
	$ctrlgrp.controlgroup("container")["append"]('<a href="#" data-role="button" data-icon="bars" data-iconpos="notext" id="open-panel"></a>');
	$.mobile.activePage.find('#open-panel').button();
	$ctrlgrp.controlgroup( "refresh" );
}

//change theme of selected species in sidebar
function markSidebar()
{
	$("#ulSidebar li").each(function(index)
	{
		if($(this).text() == currentSpecies)
		{
			$(this).attr('data-theme','b').removeClass("ui-btn-up-c").addClass("ui-btn-up-b");
		}
	});
}