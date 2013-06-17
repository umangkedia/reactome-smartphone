var baseURL="http://reactomews.oicr.on.ca:8080/ReactomeRESTfulAPI/RESTfulWS/"
	
function frontPageURLFor(species) //frontpage url
{
	var key=species.toLowerCase().replace(/\s/g,"+");
	return baseURL+"frontPageItems/"+key;
}

function urlForSpeciesList() //species list
{
	return baseURL+"speciesList";
}

function urlFordbId(dbId) //sub pathways based on dbID
{
	return baseURL+"queryById/Pathway/"+dbId;
}