//var baseURL="http://reactomews.oicr.on.ca:8080/ReactomeRESTfulAPI/RESTfulWS/"
var baseURL="http://localhost:8080/ReactomeRESTfulAPI/RESTfulWS/";

function frontPageURLFor(species) {
	var key = species.toLowerCase().replace(/\s/g,"+");
	return baseURL+"frontPageItems/"+key;
}

function urlForSpeciesList() {
	return baseURL + "speciesList";
}

//sub pathways based on dbID
function urlFordbId(dbId) {
	return baseURL + "queryById/Pathway/" + dbId;
}

//sub pathways based on dbID
function urlForQueryByIds() {
	return baseURL + "queryByIds/Pathway/";
}

function urlListByName(key, species) {
	key = key.toLowerCase().replace(/\s/g,"+");
	species = species.toLowerCase().replace(/\s/g,"+");
	return baseURL + "listByName/Event/" + key + "/"+species;
}

//gene search
function urlQueryHitPathways() {
	return baseURL + "queryHitPathways";
}

function urlQueryEventAncestors(key) {
	return baseURL + "queryEventAncestors/" + key;
}

//for search queries
function urlForSearchSummation() {
	return baseURL + "queryEventSpeciesAndSummation/";
}