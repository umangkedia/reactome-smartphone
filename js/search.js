var searchEvent=true, searchData, start=0, end, resultsPerPage = 20;//event search or gene search
	
$(document).on('pageinit','#searchPage',function() {	
		
	$("#go").on('click', function() {
		var query = $.trim($("#search").val());
		if (query != "") {			
			if (!searchEvent) {	
				ajaxPOSTCaller(urlQueryHitPathways(), createSearchResult, $("#searchList"), query);
			}
			else {
				var speciesName=$("#searchSpeciesList option:selected").val();
				ajaxCaller(urlListByName(query, speciesName), createSearchResult, $("#searchList"));
			}
		}
	});	
	
	$("#geneSearch").on('click', function () {
		searchEvent=false;
		$("#eventSearch").removeClass('ui-btn-active ui-state-persist');
		$(this).addClass('ui-btn-active ui-state-persist');
		$("#search").attr('placeholder','Search by Gene...');
	});
	
	$("#eventSearch").on('click', function () {
		searchEvent = true;
		$("#geneSearch").removeClass('ui-btn-active ui-state-persist');
		$(this).addClass('ui-btn-active ui-state-persist');
		$("#search").attr('placeholder','Search by Name...');
	});
	
	$("#prevResult").on('click' , function() {
		end = start;
		start = start - resultsPerPage;
		getSearchResult(start,end,$("#searchList"));
	});
	
	$("#nextResult").on('click' , function() {		
		start = end;
		end = (end + resultsPerPage < searchData.length) ? end + resultsPerPage : searchData.length;
		getSearchResult(start,end,$("#searchList"));
	});
	
	if (typeof speciesData !== 'undefined')
		setSpeciesSelect(speciesData,$('#searchSpeciesList'));
	else 
		ajaxCaller(urlForSpeciesList(),setSpeciesSelect,$("#searchSpeciesList"));	

	$(document).on('pageshow', '#searchPage', function() {
		$(this).find("#sideBar").remove();
	});
});

function setSpeciesSelect(data, selector) {
	for (var i in data)	{
		selector.append("<option value='" + data[i].displayName + "'>" + data[i].displayName + "</option>");
	}
	selector.selectmenu('refresh');
}

function createSearchResult(data, selector) {	
	searchData = data;
	start=0; end = (data.length > resultsPerPage) ? resultsPerPage: data.length;
	getSearchResult(start,end,selector);			
}

function getSearchResult(start, end, selector) {
	window.scroll(0,0)
	selector.empty();

	if (start != end) {		
		var postData="";	
		for(var i = start; i < end; i++) {
			postData += searchData[i].dbId;
			if(i < end - 1) 
				postData+=",";
		}
		ajaxPOSTCaller(urlForSearchSummation(), printSearchDetails, selector, postData);
	}
	
	else {
		$("#searchText").text("No results found");
		var li = $("<li>No result for your query</li>");
		selector.append(li)			
				.listview('refresh');
	}		
	
	if (start === 0) 
		$("#prevResult").hide();
	else 
		$("#prevResult").show();
	
	if (end < searchData.length) 
		$("#nextResult").show();
	else 
		$("#nextResult").hide();
}

function printSearchDetails(data, selector) //for printing species name and summation in search results
{
	var speciesName = $("#searchSpeciesList option:selected").val();
	var count = 0;
	
	for (var i in data) {
		
		if (speciesName === "null" || speciesName == data[i].species[0].displayName) {
			
			count++;
			var li = $('<li data-icon="false">');
			var icon = getIcon(data[i].schemaClass);			
			var resultSummary = data[i].summation[0].text;			
			var anchor = $('<a href="#" class="details" id="' + data[i].dbId + '" >');
			
			anchor.append('<h4 class="wrap" style="font-size:11pt; color:#4a6b82;"><img src="css/images/'+icon+'.gif"/>&nbsp;&nbsp;'+data[i].displayName+' ('+data[i].species[0].displayName+')</h4>')
				  .append("<p class='wrap'>"+resultSummary.substr(0, 175).replace(/<(?:.|\n)*?>/gm, '')+"...</p>");
			li.append(anchor);
			selector.append(li);
		}
	}
	
	$("#searchText").text("Showing "+(start + 1)+" - "+(start + count)+" of "+ searchData.length+" results for \""+ $.trim($('#search').val())+"\"")
					.show();
	selector.listview('refresh');
}