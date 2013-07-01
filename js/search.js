$(document).on('pageinit','#searchPage',function() {	
	
	$("#go").on('click', function()
	{
		if($.trim($("#search").val())!="")
		{
			var postData=$.trim($("#search").val());
			if($("#geneSearch").is(':checked'))	{			
				ajaxPOSTCaller(urlQueryHitPathways(),createSearchResult, $("#searchList"), postData);
			}
			else {
				var speciesName=$("#searchSpeciesList option:selected").val();
				ajaxCaller(urlListByName(postData,speciesName),createSearchResult,$("#searchList"));
			}
		}
	});	
	
	$("#geneSearch").on('change', function ()
	{
		if(this.checked) $("#searchSpeciesList").closest('.ui-select').hide();
		else $("#searchSpeciesList").closest('.ui-select').show();		
		$("#searchGroup").controlgroup('refresh');
	});
	
	if(typeof speciesData !=='undefined') setSpeciesSelect(speciesData,$('#searchSpeciesList'));
	else ajaxCaller(urlForSpeciesList(),setSpeciesSelect,$("#searchSpeciesList"));
});

function setSpeciesSelect(data, selector)
{
	for(var i in data) 	{
		selector.append("<option value='" + data[i].displayName+"'>"+data[i].displayName+"</option>");
	}
	selector.selectmenu('refresh');
}

function createSearchResult(data,selector)
{
	selector.empty();
	$("#searchText").show();
	console.log(data);
	
	if(data.length==0) 	{
		$("#searchText").text("No results found");
		var li=$("<li>No result for your query</li>");
		selector.append(li);
	}
	else
	{
		$("#searchText").text(data.length+" results found");
		for(var i in data)
		{
			var heading = $("<h5 style='white-space:normal !important;'>"+data[i].displayName+"</h5>");
			var event = $("<p> Event type: "+data[i].schemaClass+"</p>");
			var li = $("<li>").append(heading).append(event);
			selector.append(li);		
		}
	}	
	selector.listview('refresh');	
}