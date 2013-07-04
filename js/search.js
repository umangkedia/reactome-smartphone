var searchEvent=true;//event search or gene search
	
$(document).on('pageinit','#searchPage',function() {	
	
	$("#go").on('click', function()
	{
		if($.trim($("#search").val())!="")
		{
			var postData=$.trim($("#search").val());
			if(!searchEvent) {	
				console.log("gene search");
				ajaxPOSTCaller(urlQueryHitPathways(),createSearchResult, $("#searchList"), postData);
			}
			else {
				console.log("event search");
				var speciesName=$("#searchSpeciesList option:selected").val();
				ajaxCaller(urlListByName(postData,speciesName),createSearchResult,$("#searchList"));
			}
		}
	});	
	
	$("#geneSearch").on('click', function ()
	{
		searchEvent=false;
		$("#search").val('');
		$("#eventSearch").removeClass('ui-btn-active ui-state-persist');
		$(this).addClass('ui-btn-active ui-state-persist');
		$("#search").attr('placeholder','Search gene symbols...');
		$("#searchSpeciesList").closest('.ui-select').fadeOut();
	});
	
	$("#eventSearch").on('click', function ()
	{
		searchEvent=true;
		$("#geneSearch").removeClass('ui-btn-active ui-state-persist');
		$(this).addClass('ui-btn-active ui-state-persist');
		$("#search").attr('placeholder','Search by Event Name...');
		$("#searchSpeciesList").closest('.ui-select').fadeIn();
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
		$("#searchText").text(data.length+" results found for "+ $.trim($('#search').val()));
		for(var i in data)
		{
			var li = $('<li data-icon="false">');
			var anchor=$('<a href="#" class="details" id="' + data[i].dbId + '" >');
			var icon = getIcon(data[i].schemaClass);
			anchor.append('<img src="css/images/'+icon+'.gif" class="ui-li-icon ui-corner-none">'+ data[i].displayName);
			li.append(anchor);
			selector.append(li);		
		}
	}	
	selector.listview('refresh');	
}