var baseURL="http://reactomews.oicr.on.ca:8080/ReactomeRESTfulAPI/RESTfulWS/"
//var baseURL="http://192.168.1.2:8080/ReactomeRESTfulAPI/RESTfulWS/";
	
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

function urlForQueryByIds() //sub pathways based on dbID
{
	return baseURL+"queryByIds/Pathway/";
}

function urlListByName(key, species)
{
	key=key.toLowerCase().replace(/\s/g,"+");
	species=species.toLowerCase().replace(/\s/g,"+");
	return baseURL+"listByName/Event/"+key+"/"+species;
}

function urlQueryHitPathways()
{
	return baseURL+"queryHitPathways";
}

function urlQueryEventAncestors(key)
{
	return baseURL+"queryEventAncestors/"+key;
}