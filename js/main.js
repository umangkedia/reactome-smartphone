//main js file
var schemaType = [], currentSpecies="Homo sapiens"; //to store schema type of events

$(document).bind('pageinit', function()
{	
	$.mobile.page.prototype.options.addBackBtn = true;
});

$(document).bind('ready' , function () 		
{	
	//first call starts here, ajax on page load	
	ajaxCaller(frontPageURLFor("homo sapiens"),jsonParser,$("#pathwayList"));
	
	//nested list event when clicked on li's anchor tag
	$('body').on("click","li .expand",function(e) {
		console.log("List click event"+$(this).text()+$(this).attr("id"));
		var dbId = $(this).attr("id");
		var url = urlFordbId(dbId);
		
		if(checkSchema($(this).attr("id"))) //only 'schemaclass = pathway' will expand
		{		
			var list=$('<ul data-inset="true" data-split-icon="grid">'); //creating ul before because jquery mobile ajax is getting completed before our ajax
			$(this).closest('li').append(list);
			$(this).closest('ul').listview('refresh');			
			ajaxCaller(url,nestedListCreate,list);		
		}		
	});
});

jsonParser = function (data, ul) {
	
    console.log("jsonParser");
	schemaType.length=0; //on species change
    $("#heading").text(currentSpecies);
	var topUl= $('<ul data-role="listview" data-inset="true" data-theme="d" data-split-icon="grid">');

    for (var i in data) {			
        var icon = getIcon(data[i].schemaClass);
		var topLi= returnLi(icon, data[i].dbId, data[i].displayName);
		insertSchema(data[i].dbId,data[i].schemaClass);
		topUl.append(topLi);
    }
	ul.append(topUl);
    $("#frontPage").trigger('create');
	
	if($.mobile.activePage.attr('id')!= "dialog") //no sidebar in case of dialog box
	{
		ajaxCaller(urlForSpeciesList(),setSpeciesData,null); //prevent concurrent ajax call
	}
}

ajaxCaller = function (url, callback, selector) {
	
    $.ajax({
		type: 'GET',
		async: true,
		beforeSend: ajaxStart,
		url: url,
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

//for creating nested list
nestedListCreate = function (data, list) {
    
    list.append('<li data-role="list-divider">' + data.displayName + '</li>');
	
    for (var i in data.hasEvent) {		
        //console.log(data.hasEvent[i].displayName+" "+data.hasEvent[i].dbId);		
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

function returnLi(icon, dbId, displayName) //return li to nested list
{
	var li = $("<li>");
	var anchor=$('<a href="#" class="expand" id="' + dbId + '">');
	anchor.append('<img src="css/images/'+icon+'.gif" class="ui-li-icon ui-corner-none">'+ displayName);
	li.append(anchor);
	li.append('<a href="#" class="details" id="' + dbId + '">Click for details</a>');
	return li;
}

function checkSchema(dbId)
{
	for(var i=0;i<schemaType.length;i++) {
		if(schemaType[i].dbId == dbId && schemaType[i].schemaClass.toUpperCase() === "PATHWAY") return true;		
	}	
	return false;
}

function getIcon(schemaClass) //get icon based on schemaclass
{
	if(schemaClass.toUpperCase() == 'PATHWAY') return 'pathway';
	else if(schemaClass.toUpperCase() == 'BLACKBOXEVENT') return 'blackbox';
	
	return 'reaction';
}

function ajaxStart() {
    var interval = setInterval(function () {
        $.mobile.loading('show', {
            text: "Fetching data...",
            textVisible: true
        });
        clearInterval(interval);
    }, 1);
}

function ajaxStop() {
    var interval = setInterval(function () {
        $.mobile.loading('hide');
        clearInterval(interval);
    }, 1);
}