var redraw=false; //this is to check whether to redraw frontpage. If it is orthologous event, the front page is drawn

function checkOrthologousEvent()
{	
	var data= detailsData;
	if(data.species[0].displayName.toUpperCase()==="HOMO SAPIENS")
	{
		console.log("species is homo sapiens");
		compareEvent(data, $("#detailsContent")); //if species is human we need not make additional REST call
	}
	else
	{
		console.log("second ajax call for orthologous");
		ajaxCaller(urlFordbId(data.orthologousEvent[0].dbId),compareEvent,$("#detailsContent"));
	}			
}

function compareEvent(data,selector)
{
	var postData= "ID="+data.dbId;
	
	if(data.orthologousEvent.length!=0)
	{		
		for(var i in data.orthologousEvent)
		{
			postData+=","+data.orthologousEvent[i].dbId;
		}
		ajaxPOSTCaller(checkOrthologousSpecies, selector, postData);
	}
	else ajaxCaller(frontPageURLFor(currentSpecies),jsonParser,$("#pathwayList"));		
}

//for POST request only
function  ajaxPOSTCaller (callback, selector, postData) {
	
    $.ajax({
		type: 'POST',
		beforeSend: ajaxStart,
		url: "http://reactomews.oicr.on.ca:8080/ReactomeRESTfulAPI/RESTfulWS/queryByIds/Pathway",
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

function checkOrthologousSpecies(data, selector)
{
	redraw=true;
	var flag=false;
	for(var i in data)
	{
		if(data[i].species[0].displayName.toUpperCase()===currentSpecies.toUpperCase())
		{
			console.log("orthologous event found"+currentSpecies);
			flag=true;
			if($("#detailsPage").find("#goUp").length===0)
			{
				$("#detailsBack").remove();
				$('<a href="#frontPage" id="goUp" data-role="button" data-icon="arrow-u" class="ui-btn-left">Home</a>').appendTo('#detailsHeader');
				$("#goUp").button();
			}
			getSummationId(data[i],$("#detailsContent"));
			break;
		}
	}
	
	if(!flag) 
	{		
		redrawFrontPage();
		ajaxStop();
		$("#msg").empty();
		$("#msg").append("<b>"+detailsData.displayName+"</b> event is not present in <b>"+ currentSpecies+"</b>. Click OK to go to homepage");
		$.mobile.changePage("#dialog", {
			role: "dialog"
		});
	}		
}

function redrawFrontPage()
{
	if(redraw)
	{
		redraw=false;
		console.log("front page redrawn");		
		ajaxCaller(frontPageURLFor(currentSpecies),jsonParser,$("#pathwayList"));		
	}
}