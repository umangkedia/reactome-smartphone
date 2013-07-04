//js for details page
var detailsHeading, inferredFrom, inferredSpecies; //inferredFrom contains dbId and InferredSpecies contains speciesname
var onDetails, detailsData, detailsSpecies; //onDetails: whether user is on details page.. for orthologous events,detailsData will store JSON in getsummationID

$(document).on('pageinit', '#detailsPage', function () {		
	
	$('body').on("change","#pathwaySelect",function(e) {
		ajaxCaller(urlFordbId($("#pathwaySelect option:selected").val()),getSummationId,$("#detailsContent"));
		if($.mobile.activePage.attr('id')!="detailsPage") $.mobile.changePage("#detailsPage");				
	});
	
	$('#inferredDiv, #referenceDiv, #ancestorDiv').on('expand', function () { 
		
		if(this.id=='inferredDiv' && $("#inferred").is(':empty')) ajaxCaller(urlFordbId(inferredFrom),getInferred,$("#inferred"));
		else if(this.id=='referenceDiv' && $("#reference").is(':empty')) getReference();
		else if(this.id=='ancestorDiv' && $("#ancestor").is(':empty')) ajaxCaller(urlQueryEventAncestors(detailsData.dbId),getAncestor,$("#ancestor"));
	});
	
	$("#detailsPage").on("pagehide",function(event,ui) {
		onDetails=false;
	});
	
	$("#detailsPage").on("pageshow",function(event,ui) {
		onDetails=true;
		//adding back button dynamically, because we need up button in case of orthologous event
		if($("#detailsPage").find("#detailsBack").length===0)
		{
			$("#goUp").remove();
			$('<a href="#frontPage" id="detailsBack" data-rel="back" data-icon="arrow-l" class="ui-btn-left">Back</a>').appendTo('#detailsHeader');
			$("#detailsBack").button();
		}
	});
});

getSummationId =function (data,selector)
{
	detailsHeading=data.displayName;
	detailsSpecies= data.species[0].displayName;
	$("#detailsCollapsible").children().trigger( "collapse" );
	$("#author, #review, #inferred, #reference, #ancestor").empty();
	createDropdown(data);
	
	detailsData=data;//store json for orthologous event
	console.log("details page"+data.dbId);
	
	if (JSON.stringify(data.isInferred) == "true") //was returning a json object
	{
		$("#inferredDiv").show();
		inferredFrom = data.inferredFrom[0].dbId;
	} 
	else $("#inferredDiv").hide();

	if(typeof(data.authored) != "undefined")
	{
		$("#authorDiv").show();
		var ul = $('<ul data-role="listview" data-inset="true">');
		for (var i in data.authored)
			ul.append("<li>" + data.authored[0].displayName + "</li>");		
		$("#author").append(ul).trigger('create');
	}
	else $("#authorDiv").hide();	
	
	if(typeof(data.authored) != "undefined")
	{
		$("#reviewDiv").show();
		var ul = $('<ul data-role="listview" data-inset="true">');
		for (var i in data.reviewed)
			ul.append("<li>" + data.reviewed[0].displayName + "</li>");
		$("#review").append(ul).trigger('create');
	}
	else $("#reviewDiv").hide();
	
	if(typeof(data.literatureReference)!= "undefined") $("#referenceDiv").show();
	else $("#referenceDiv").hide();
	
	$("#detailsCollapsible").collapsibleset('refresh');

	try {
		ajaxCaller(urlFordbId(data.summation[0].dbId), createDetails, selector);
	} catch (err) {
		$("#detailsDiv").text("Summary not available");
		redrawFrontPage();
	}
	
	markSidebar(detailsSpecies);
}

createDetails = function (data, selector)
{
	$("#detailsHeading").text(detailsHeading);
	$("#detailsDiv").empty()
		.append("<b>Species Name: </b>"+detailsSpecies+"<br/><br/>")
		.append($.parseHTML(data.text));
	
	redrawFrontPage(); // this is to check whether to redraw frontpage. If it is orthologous event, the front page is drawn
}

createDropdown = function (data)
{
	$select= $('<select id="pathwaySelect" data-native-menu="false" data-iconpos="notext" data-divider-theme="a">');
	$("#detailsPage").find("#pathwaySelect").remove();
	if(data.schemaClass.toUpperCase()==="PATHWAY")
	{
		var optgroup= $('<optgroup label="Sub Pathway">');
		optgroup.append("<option></option>"); //blank option so that first option is not selected
		
		for(var i in data.hasEvent) {
			optgroup.append('<option value="'+data.hasEvent[i].dbId+'">'+data.hasEvent[i].displayName+'</option>');
		}
		$select.append(optgroup);
		$.mobile.activePage.find('div[data-role="controlgroup"]').controlgroup("container")["prepend"]($select);		
		$select.selectmenu();		
	}
	$.mobile.activePage.find('div[data-role="controlgroup"]').controlgroup( "refresh" ); 
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

getReference = function()
{
	data=detailsData;
	var postData= "ID=";	
			
	for(var i in data.literatureReference)
	{
		if(i>0)postData+=",";
		postData+=data.literatureReference[i].dbId;
	}
	ajaxPOSTCaller(urlForQueryByIds(),createReference, "#reference", postData);	
}

function createReference(data, selector)
{
	var ul = $('<ol data-role="listview" data-inset="true">');
	for(var i in data)
	{
		var text= "";
		for(var j in data[i].author) 
		{
			if(j>0) text+=",";
			text+=data[i].author[j].displayName;
		}
		$content1=$("<h5>"+text+"</h5>");
		$content2=$("<p style='white-space:normal;text-indent: 0;'>"+data[i].displayName+"</p>");
		var anchor= $("<a href='http://www.ncbi.nlm.nih.gov/pubmed/"+data[i].pubMedIdentifier+"?dopt=Abstract' target='_blank'>").append($content1)
																																 .append($content2);
		var li= $("<li data-icon='false'>").append(anchor);
		ul.append(li);
	}
			
	$(selector).append(ul).trigger('create');	
}

function getAncestor(data, selector)
{
	var ul = $('<ol data-role="listview" data-inset="true">');
	for(var i in data[0].databaseObject)
	{
		var li= $("<li>"+data[0].databaseObject[i].displayName+"</li>");
		ul.append(li);
	}
			
	$(selector).append(ul).trigger('create');
}
	

