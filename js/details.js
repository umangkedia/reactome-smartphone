//js for details page
var detailsHeading,inferredFrom,inferredSpecies; //inferredFrom contains dbId and InferredSpecies contains speciesname

$(document).bind('ready' , function () 		
{		
	$('body').on("click",".details",function(e) {
		console.log("details clicked"+$(this).attr("id"));
		ajaxCaller(urlFordbId($(this).attr("id")),getSummationId,$("#detailsContent"));	
		$.mobile.changePage("#detailsPage");
	});
	
	$('body').on("change","#pathwaySelect",function(e) {
		ajaxCaller(urlFordbId($("#pathwaySelect option:selected").val()),getSummationId,$("#detailsContent"));
		if($.mobile.activePage.attr('id')!="detailsPage")$.mobile.changePage("#detailsPage");				
	});
	
	$('#inferredDiv').bind('expand', function () { //delegating inferred data
		if($("#inferred").is(':empty')) ajaxCaller(urlFordbId(inferredFrom),getInferred,$("#inferred"));
	});
});

getSummationId =function (data,selector)
{
	detailsHeading=data.displayName;
	$("#detailsCollapsible").children().trigger( "collapse" );
	$("#stableId, #author, #review, #inferred").empty();
	createDropdown(data);
	console.log("details page"+data.dbId);
	
	if (JSON.stringify(data.isInferred) == "true") //was returning a json object
	{
		$("#inferredDiv").show();
		inferredFrom = data.inferredFrom[0].dbId;
	} 
	else $("#inferredDiv").hide();

	try {
		$("#stableId").text(data.stableIdentifier.displayName);
	} catch (err) {
		$("#stableId").text("Content not available");
	}

	try {
		var ul = $('<ul data-role="listview" data-inset="true">');
		for (var i in data.authored)
			ul.append("<li>" + data.authored[0].displayName + "</li>");		
		$("#author").append(ul).trigger('create');
	} catch (err) {
		$("#author").text("Content not available");
	}	

	try {
		var ul = $('<ul data-role="listview" data-inset="true">');
		for (var i in data.reviewed)
			ul.append("<li>" + data.reviewed[0].displayName + "</li>");
		$("#review").append(ul).trigger('create');
	} catch (err) {
		$("#review").text("Content not available");
	}	
	
	$("#detailsCollapsible").collapsibleset('refresh');

	try {
		ajaxCaller(urlFordbId(data.summation[0].dbId), createDetails, selector);
	} catch (err) {
		$("#detailsDiv").text("Summary not available");
	}
}

createDetails = function (data, selector)
{
	$("#detailsHeading").text(detailsHeading);
	$("#detailsDiv").empty();
	$("#detailsDiv").append($.parseHTML(data.text));
}

createDropdown = function (data)
{
	$select= $('<select id="pathwaySelect" data-native-menu="false" data-iconpos="notext" data-divider-theme="a">');
	$("#detailsPage").find("#pathwaySelect").remove();
	if(data.schemaClass.toUpperCase()==="PATHWAY")
	{
		var optgroup= $('<optgroup label="Sub Pathway"></optgroup>');		
		
		for(var i in data.hasEvent)
		{
			console.log(data.hasEvent[i].displayName);
			optgroup.append('<option value="'+data.hasEvent[i].dbId+'">'+data.hasEvent[i].displayName+'</option>');
		}
		$select.append(optgroup);
		$.mobile.activePage.find('div[data-role="controlgroup"]').controlgroup("container")["append"]($select);		
		$select.selectmenu();
		$.mobile.activePage.find('div[data-role="controlgroup"]').controlgroup( "refresh" );
	}
}

//for getting inferred data

getInferred = function (data,selector)
{
	inferredSpecies= data.species[0].displayName;
	ajaxCaller(urlFordbId(data.summation[0].dbId), createInferred, selector);
}

createInferred = function (data,selector)
{
	selector.append("<p><b>"+inferredSpecies+":</b> "+data.text+"</p>");
}
	

