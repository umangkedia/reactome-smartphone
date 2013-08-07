var searchEvent=true,searchData, start=0, end;//event search or gene search
	
$(document).on('pageinit','#searchPage',function() {	
	
	$("#go").on('click', function() {
		if($.trim($("#search").val())!="")
		{
			var postData=$.trim($("#search").val());
			if(!searchEvent) {	
				ajaxPOSTCaller(urlQueryHitPathways(),createSearchResult, $("#searchList"), postData);
			}
			else {
				var speciesName=$("#searchSpeciesList option:selected").val();
				ajaxCaller(urlListByName(postData,speciesName),createSearchResult,$("#searchList"));
			}
		}
	});	
	
	$("#geneSearch").on('click', function () {
		searchEvent=false;
		$("#search").val('');
		$("#eventSearch").removeClass('ui-btn-active ui-state-persist');
		$(this).addClass('ui-btn-active ui-state-persist');
		$("#search").attr('placeholder','Search by gene...');
	});
	
	$("#eventSearch").on('click', function () {
		searchEvent=true;
		$("#geneSearch").removeClass('ui-btn-active ui-state-persist');
		$(this).addClass('ui-btn-active ui-state-persist');
		$("#search").attr('placeholder','Search by Name...');
	});
	
	$("#prevResult").on('click' , function() {
		end=start;
		start=start-20;
		getSearchResult(start,end,$("#searchList"));
	});
	
	$("#nextResult").on('click' , function() {		
		start=end;
		end= (end+20 < searchData.length) ? end+20 : searchData.length;
		getSearchResult(start,end,$("#searchList"));
	});
	
	if(typeof speciesData !=='undefined') setSpeciesSelect(speciesData,$('#searchSpeciesList'));
	else ajaxCaller(urlForSpeciesList(),setSpeciesSelect,$("#searchSpeciesList"));
});

$(document).on('pageshow', '#searchPage', function() {
	$(this).find("#sideBar").remove();
	console.log("sidebar removed"); 	
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
	searchData= data;
	
	if(data.length==0) 	{		
		selector.empty();
		$("#searchText").text("No results found");
		var li=$("<li>No result for your query</li>");
		selector.append(li);
		$("#prevResult, #nextResult").hide();			
		selector.listview('refresh');
	}
	else
	{
		start=0; end = (data.length > 20) ? 20: data.length;
		getSearchResult(start,end,selector);		
	}	
}

function getSearchResult(start, end, selector)
{
	window.scroll(0,0)
	selector.empty();	
		
	var postData="";	
	for(var i = start; i < end; i++) {
		postData+=searchData[i].dbId;
		if(i<end-1) postData+=",";
	}
	ajaxPOSTCaller(urlForSearchSummation(),printSearchDetails, selector, postData);
	
	if(start ===0) $("#prevResult").hide();
	else $("#prevResult").show();
	
	if(end < searchData.length) $("#nextResult").show();
	else $("#nextResult").hide();
}

function printSearchDetails(data, selector) //for printing species name and summation in search results
{
	var speciesName=$("#searchSpeciesList option:selected").val();
	var count = 0;
	
	for(var i in data)
	{
		if (speciesName === "null" || speciesName == data[i].species[0].displayName)
		{
			count++;
			var li = $('<li data-icon="false">');
			var icon = getIcon(data[i].schemaClass);
			
			var printText = data[i].summation[0].text;
			
			var anchor=$('<a href="#" class="details" id="' + data[i].dbId + '" >');
			anchor.append('<h4 class="wrap" style="font-size:11pt; color:#4a6b82;"><img src="css/images/'+icon+'.gif"/>&nbsp;&nbsp;'+data[i].displayName+' ('+data[i].species[0].displayName+')</h4>')
				  .append("<p class='wrap'>"+printText.substr(0, 175).replace(/<(?:.|\n)*?>/gm, '')+"...</p>");
			li.append(anchor);
			selector.append(li);
		}
	}
	
	$("#searchText").text("Showing "+(start+1)+" - "+(start+count)+" of "+ searchData.length+" results for \""+ $.trim($('#search').val())+"\"")
					.show();
	selector.listview('refresh');
}