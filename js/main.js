//main js file
var schemaType = [], currentSpecies="Homo sapiens", dynamicPages= []; //to store schema type of events , to store dynamic nested pages
	
$(document).on('pageinit', '#frontPage', function () 		
{
	//first call starts here, ajax on page load	
	ajaxCaller(frontPageURLFor("homo sapiens"),jsonParser,$("#frontPage").find("#pathwayList"));
	
	$('body').on("click","li .expand",function(e) {
		var dbId = this.id;
		var url = urlFordbId(dbId);
		
		if(checkSchema($(this).attr("id"))) //only 'schemaclass = pathway' will expand
		{
			var newPageId = createNestedPage($(this).text(), $.mobile.activePage.attr('id'));
			var list=$('<ul data-inset="true" data-split-icon="info" data-split-theme="c">'); 
			$("#"+newPageId).find("#pathwayList").append(list);
			list.listview();	
			ajaxCaller(url,nestedListCreate,list);		
		}
		else createPopup(dbId);
	});
	
	//detail button
	$('body').on("click", ".details", function(e) {
		ajaxCaller(urlFordbId($(this).attr("id")),getSummationId,$("#detailsContent"));	
		$.mobile.changePage("#detailsPage");
	});
	
	//for sidebar species change
	$('body').on("click","#sideBar li",function(e) {
		if (!$(this).is(':first-child')) {
			currentSpecies=$(this).text();
			$.mobile.activePage.find('#sideBar').panel("close"); 		
			$('#frontPage').find('#pathwayList').empty();
			
			if (!onDetails) { //if user is not on details page
				$.mobile.changePage("#frontPage");	
				ajaxCaller(frontPageURLFor(currentSpecies),jsonParser,$("#frontPage").find("#pathwayList"));
			}
			else {
				checkOrthologousEvent(); //function is in orthologus.js	
				removeDynamicPages();
			}
		}
	});	
	
	//error handling test
	$('#errorRefresh').on("click", function(e) {
		ajaxCaller(frontPageURLFor("homo sapiens"),jsonParser,$("#pathwayList"));
	});
	
	$(document).on("pagechangefailed", function(event) { 
		console.log("page change failed");
		$.mobile.changePage("#frontPage");
	});
	
});

$(document).on('pageshow',"#frontPage", function(event) {
	removeDynamicPages();	
	$(this).find('a[data-rel=back]').buttonMarkup({iconpos: 'notext'});
});

jsonParser = function (data, ul) {
	
	schemaType.length=0; //on species change
    $("#heading").text(currentSpecies);
	var topUl= $('<ul data-role="listview" data-inset="true" data-theme="d" data-split-icon="info" data-split-theme="c">');

    for (var i in data) {			
        var icon = getIcon(data[i].schemaClass);
		var topLi= returnLi(icon, data[i].dbId, data[i].displayName);
		insertSchema(data[i].dbId,data[i].schemaClass);
		topUl.append(topLi);
    }
	ul.append(topUl);
    topUl.listview();
	
	//no sidebar in case of dialog box
	if ($.mobile.activePage.attr('id') != "dialog")  {
		ajaxCaller(urlForSpeciesList(),setSpeciesData,null); 
	}		
}

ajaxCaller = function (url, callback, selector) {
	
    $.ajax({
		type: 'GET',
		beforeSend: ajaxStart,
		url: url,
		dataType: 'json',
		success: function (data) {
			ajaxStop();
			callback(data, selector);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log("error :" + XMLHttpRequest.responseText);
			$.mobile.changePage("#error", {
				role: "dialog"
			});
		}
	});
}

//for creating nested list
nestedListCreate = function (data, list) {
    
    list.append('<li data-role="list-divider">' + data.displayName + '</li>');
	
    for (var i in data.hasEvent) {			
		var icon = getIcon(data.hasEvent[i].schemaClass);			
		var li= returnLi(icon, data.hasEvent[i].dbId, data.hasEvent[i].displayName);
		list.append(li);		
        insertSchema(data.hasEvent[i].dbId,data.hasEvent[i].schemaClass);
    }
    list.listview('refresh');
}

insertSchema = function (dbId, schema)
{
	for(var i=0;i<schemaType.length;i++){
		if(schemaType[i].dbId == dbId) return;
	}	
	var obj = {dbId:dbId , schemaClass:schema}; //store dbId with schemaClass
	schemaType.push(obj);	
}

function createNestedPage(heading, currentPage)
{
	if(currentPage==='frontPage') 
		var nextPageId='2';	
	else 
		var nextPageId = (parseInt(currentPage) +1).toString();
	
	var found = $.inArray('nextPageId', dynamicPages);
	if(found === -1)
		dynamicPages.push(nextPageId); 
	
	$("#"+nextPageId).remove();
	var newPage = $("<div data-role='page' id='"+nextPageId+"'>" +
	"<div data-role='header' data-theme='b'> <a href='#frontPage' data-rel='back' data-icon='arrow-l' data-iconpos='notext'>Back</a>" +
	"<h1>"+heading+"</h1></div><div data-role='content' id='pathwayList'></div></div>");
	newPage.appendTo($.mobile.pageContainer);
	$.mobile.changePage('#'+nextPageId);
	return nextPageId;
}

function returnLi(icon, dbId, displayName) //return li to nested list
{
	var li = $("<li>");
	var anchor=$('<a href="#" class="expand" id="' + dbId + '">');
	anchor.append('<img src="css/images/'+icon+'.gif" class="ui-li-icon ui-corner-none">'+ displayName);
	li.append(anchor).append('<a href="#" class="details" id="' + dbId + '">Click for details</a>');
	return li;
}

function checkSchema(dbId)
{
	for(var i = 0; i < schemaType.length; i++) {
		if(schemaType[i].dbId == dbId && schemaType[i].schemaClass.toUpperCase() === "PATHWAY")
			return true;		
	}	
	return false;
}

function getIcon(schemaClass) //get icon based on schemaclass
{
	if(schemaClass.toUpperCase() == 'PATHWAY') 
		return 'pathway';
	else if(schemaClass.toUpperCase() == 'BLACKBOXEVENT') 
			return 'blackbox';
	
	return 'reaction';
}

function createPopup(position)
{
	var $popUp = $("<div/>",{
		'data-role':'popup',
        'data-transition' : "flow",
		'data-position-to': "window",
		'data-theme':'e',
		'data-overlay-theme':"a",
    }).on("popupafterclose", function() {
        $(this).remove();
    });
	
	$("<p/>", {
        text : "This is a reaction event and does not contain further pathways"
    }).appendTo($popUp);

	$.mobile.activePage.append($popUp);
	$popUp.popup().popup("open");
}

//for POST request only
function  ajaxPOSTCaller (url,callback, selector, postData) {
	
    $.ajax({
		type: 'POST',
		beforeSend: ajaxStart,
		url: url,
		data: postData,
		contentType: "application/json",
		dataType: 'json',
		success: function (data) {
			ajaxStop();
			callback(data, selector);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			console.log("error :" + XMLHttpRequest.responseText);
		}
	});
}

function removeDynamicPages()
{
	for(var j = 0; j < dynamicPages.length; j++)
		$("#"+dynamicPages[j]).remove();
	dynamicPages.length=0;
}

function ajaxStart() {
	$('body').append("<div class='ui-loader-background' id='loaderOverlay'> </div>");
    var interval = setInterval(function () {
        $.mobile.loading('show', {
            text: "Fetching data...",
            textVisible: true
        });
        clearInterval(interval);
    }, 1);
}

function ajaxStop() {
	$("#loaderOverlay").remove();
    var interval = setInterval(function () {
        $.mobile.loading('hide');
        clearInterval(interval);
    }, 1);
}