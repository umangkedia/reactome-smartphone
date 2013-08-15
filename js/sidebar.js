var speciesAjax =0,speciesData; //to check whether we have got the species list before

$(document).on('pagebeforeshow', '[data-role="page"]', function()
{
	//workaround to include panel on every page
	if ($.mobile.activePage.find('#sideBar').length == 0) {
		$('<div>').attr({
			'id':'sideBar',
			'data-role':'panel',
			'data-position':'right',
			'data-display': 'overlay',
			'data-theme':'c',}).appendTo($(this));
		
		fillSidebar($.mobile.activePage.find('#sideBar'));
		createControlGroup();		
	}
	else 
		markSidebar(currentSpecies);	
	
	$(document).on('click', '#open-panel', function() {   
         $.mobile.activePage.find('#sideBar').panel("open");    
	});
});

function fillSidebar(panel) {
	createSidebar(speciesData,panel);
}

function setSpeciesData(data,selector) {
	speciesData=data;
	createSidebar(speciesData,$.mobile.activePage.find('#sideBar'));
}

createSidebar = function(data, selector) {
	
	if (typeof data !== "undefined") {
		selector.empty();
		var list = $('<ul data-role="listview" data-theme="c" data-inset="false" id="ulSidebar">');	
		list.append("<li data-theme='b' style='text-align:center;'>Switch Species</li>");
		for (var i in data) {
			list.append("<li id=" + data[i].dbId + " data-icon='false'><a href='#'>" + data[i].displayName + "</a></li>");
		}
		selector.append(list);
		list.listview();
		$.mobile.activePage.find('#sideBar').panel();
		markSidebar(currentSpecies);
	}		
}

//create dynamic control group on every page
//http://jsfiddle.net/androdify/WAzs6/

function createControlGroup() {
	
	$currentPage=$.mobile.activePage;
	var $ctrlgrp = $("<div/>", {
		"data-type": "horizontal",
		"data-role": "controlgroup",
		"class": "ui-btn-right",
	});
	$currentPage.find('div[data-role="header"]').append($ctrlgrp);
	$currentPage.trigger('create');
	
	if ($currentPage.attr('id') !== 'searchPage') {
		$ctrlgrp.controlgroup("container")["append"]('<a href="#searchPage" data-role="button" data-icon="search" data-iconpos="notext" id="search-button"></a>');
		$currentPage.find('#search-button').button();
		$ctrlgrp.controlgroup("container")["append"]('<a href="#" data-role="button" data-icon="cladogram" data-iconpos="notext" id="open-panel"></a>');
		$currentPage.find('#open-panel').button();	
	}
	$ctrlgrp.controlgroup( "refresh" );
}

//change theme of selected species in sidebar
function markSidebar(species)
{
	$("#ulSidebar li").not(':first-child').each(function(index) {
		if ($(this).text() == species) {
			$(this).attr('data-theme','b').removeClass("ui-btn-up-c").addClass("ui-btn-up-b");
		}
		else 
			$(this).attr('data-theme','c').removeClass("ui-btn-up-b").addClass("ui-btn-up-c");
	});
}