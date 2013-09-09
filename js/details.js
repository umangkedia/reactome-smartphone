//js for details page
var detailsHeading, inferredFrom, inferredSpecies; 
var onDetails, detailsData, detailsSpecies; //onDetails: whether user is on details page.. detailsData stores JSON of the item shown on details page

$(document).on('pageinit', '#detailsPage', function () {
			
	$('body').on("change","#pathwaySelect",function(e) {
		ajaxCaller(urlFordbId($("#pathwaySelect option:selected").val()),getSummationId,$("#detailsContent"));
	});
	
	$('#inferredDiv, #referenceDiv, #ancestorDiv, #authorDiv, #reviewDiv').on('expand', function () { 		
		if (this.id == 'inferredDiv' && $("#inferred").is(':empty')) 
			ajaxCaller(urlFordbId(inferredFrom), getInferred, $("#inferred"));
		else if (this.id == 'referenceDiv' && $("#reference").is(':empty'))
			getReference();
		else if (this.id == 'ancestorDiv' && $("#ancestor").is(':empty')) 
			ajaxCaller(urlQueryEventAncestors(detailsData.dbId), getAncestor, $("#ancestor"));
		else if (this.id == 'reviewDiv' && $("#review").is(':empty')) 
			getReviewers();
		else if (this.id == 'authorDiv' && $("#author").is(':empty')) 
			getAuthors();
	});
	
	var timeout; 	
	$("#detailsPage").on("pagehide",function(event,ui) {
		onDetails=false;
		clearTimeout(timeout);
	});
		
	$("#detailsPage").on("pageshow",function(event,ui) {
		onDetails=true;		
		shrinkHeading(); //set heading to default state
		timeout = setTimeout(expandHeading, 6000); //hide heading after some time interval 
	});

	$("#detailsPage").on("vclick",function(event,ui) {
		shrinkHeading();
		clearTimeout(timeout);
		timeout = setTimeout(expandHeading, 6000);		
	});
});

getSummationId = function (data,selector) {
	
	$.mobile.changePage("#detailsPage");
	detailsData = data;
	detailsHeading = data.displayName;
	detailsSpecies = data.species[0].displayName;
	$("#detailsCollapsible").children().trigger( "collapse" );
	$("#author, #review, #inferred, #reference, #ancestor").empty();
	createDropdown(data);
	
	if (JSON.stringify(data.isInferred) == "true") {
		$("#inferredDiv").show();
		inferredFrom = data.inferredFrom[0].dbId;
	} 
	else 
		$("#inferredDiv").hide();

	if (typeof(data.authored) != "undefined")
		$("#authorDiv").show();
	else 
		$("#authorDiv").hide();	
	
	if (typeof(data.reviewed) != "undefined") 
		$("#reviewDiv").show();
	else 
		$("#reviewDiv").hide();
	
	if (typeof(data.literatureReference) != "undefined") 
		$("#referenceDiv").show();
	else 
		$("#referenceDiv").hide();
	
	try {
		ajaxCaller(urlFordbId(data.summation[0].dbId), createDetails, selector);
	} catch (err) {
		$("#detailsDiv").text("Summary not available");
		redrawFrontPage();
	}
	
	$("#detailsCollapsible").collapsibleset('refresh');
	markSidebar(detailsSpecies);
}

createDetails = function (data, selector) {
	$newText = $($.parseHTML(data.text));
	
	//REST api contains a dead link when the details are inferred from some species
	if (JSON.stringify(detailsData.isInferred) == "true") {
		$newText.find('a:first').attr('href', 'http://www.reactome.org/electronic_inference_compara.html');
	}
	
	$("#detailsHeading").text(detailsHeading);
	$("#detailsDiv").empty()
		.append("<p style='color:#000;'><strong>Event Name: </strong>"+detailsHeading + " ("+detailsSpecies+")</p>")
		.append($newText);
	
	redrawFrontPage(); 
}

createDropdown = function (data) {
	
	$select = $('<select id="pathwaySelect" data-native-menu="false" data-iconpos="notext" data-divider-theme="a">');
	$("#detailsPage").find("#pathwaySelect").remove();
	if (data.schemaClass.toUpperCase() === "PATHWAY")
	{
		var optgroup = $('<optgroup label="Sub Pathway">');
		optgroup.append("<option></option>"); //blank option so that first option is not selected
		
		for (var i in data.hasEvent) {
			optgroup.append('<option value="'+data.hasEvent[i].dbId+'">'+data.hasEvent[i].displayName+'</option>');
		}
		$select.append(optgroup);
		$.mobile.activePage.find('div[data-role="controlgroup"]').controlgroup("container")["prepend"]($select);		
		$select.selectmenu();		
	}
	$.mobile.activePage.find('div[data-role="controlgroup"]').controlgroup( "refresh" ); 
}

//for getting inferred data
getInferred = function (data,selector) {
	inferredSpecies= data.species[0].displayName;
	ajaxCaller(urlFordbId(data.summation[0].dbId), createInferred, selector);
}

createInferred = function (data,selector) {
	selector.append("<p><b><a href='#' class='details' id='" + detailsData.inferredFrom[0].dbId + "' >"+inferredSpecies+":</a></b> "+data.text+"</p>");
}

getReference = function() {
	data=detailsData;
	var postData= "ID=";	
			
	for (var i in data.literatureReference)	{
		if (i > 0) 
			postData+=",";
		postData+=data.literatureReference[i].dbId;
	}
	ajaxPOSTCaller(urlForQueryByIds(),createReference, "#reference", postData);	
}

getAuthors = function() {
	var ul = $('<ul data-role="listview" data-inset="true">');
	for (var i in detailsData.authored)
		ul.append("<li>" + detailsData.authored[0].displayName + "</li>");		
	$("#author").append(ul).trigger('create');
}

getReviewers = function() {
	var ul = $('<ul data-role="listview" data-inset="true">');
	for (var i in detailsData.reviewed)
		ul.append("<li>" + detailsData.reviewed[0].displayName + "</li>");
	$("#review").append(ul).trigger('create');
}

function createReference(data, selector) {
	var ul = $('<ul data-role="listview" data-inset="true" data-theme="c">');
	for (var i in data) {
		var text= "";
		for (var j in data[i].author) {
			if (j > 0)
				text+=", ";
			text+=data[i].author[j].displayName;
		}
		$content1 = $("<h2 style='font-size:14px; white-space:normal;'>"+text+": "+data[i].displayName+"</h2>");
		$content2 = $("<p style='text-indent:0; font-style:italic; font-size:13px;'><strong>"+data[i].journal+" "+data[i].year+", "+data[i].pages+"</strong></p>");
		var anchor= $("<a href='http://www.ncbi.nlm.nih.gov/pubmed/"+data[i].pubMedIdentifier+"?dopt=Abstract' target='_blank'>").append($content1)
																																 .append($content2);
		var li= $("<li data-icon='false'>").append(anchor);
		ul.append(li);
	}
			
	$(selector).append(ul).trigger('create');	
}

function getAncestor(data, selector) {
	var $p = $("<p>");
	for (var i in data[0].databaseObject) {
		$p.append('<a href="#" class="details" id="'+ data[0].databaseObject[i].dbId +'">'+data[0].databaseObject[i].displayName+'</a>');
		if (i < data[0].databaseObject.length - 1)
			$p.append('&nbsp;&#8834;&nbsp;');
    }
	$(selector).append($p).trigger('create');
}

//expand heading after hiding button
function expandHeading() { 
	$("#detailsPage").find('div[data-role="controlgroup"]').fadeOut('fast');
	$("#detailsPage").find('a[data-rel="back"]').fadeOut('fast');
	$("#detailsHeading").removeClass('ui-title1').addClass('ui-title2');
}

function shrinkHeading() {
	$("#detailsPage").find('a[data-rel="back"]').fadeIn('fast');
	$("#detailsPage").find('div[data-role="controlgroup"]').fadeIn('fast');
	$("#detailsHeading").removeClass('ui-title2').addClass('ui-title1');
}	
