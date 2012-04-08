/**
 * @author Christopher Fricke
 */

function addQueryLayers(){
	
	dojo.forEach(config.utilities.query.layers, function(layer) {
		$("#statsCombobox").append("<option value=" + layer.id + ">" + layer.title + "</option>");
	});
}

function addDynamicLayers() {
	layers = [];
	legendLayers = [];
	dojo.forEach(config.layers.dynamicLayers, function(layer) {
		id =  "legendDiv_" + layer.id;

		l = new esri.layers.ArcGISDynamicMapServiceLayer(layer.service, {
			id : layer.id,
			visible: layer.visible,
		});
		$("#legendCombobox").append("<option value=" + layer.id + ">" + layer.title + "</option>");
		legendLayers.push({title: layer.title, layer: l});
		layers.push(l);
	});
	
	map.addLayers(layers);
	return legendLayers;
}

function setVisibleLayers(value){
   	dojo.forEach(config.layers.dynamicLayers, function(layer){
   		map.getLayer(layer.id).setVisibility((layer.id == value));
   	});
}

function locate(address) {
	/* Locator Utility*/
	
	var address = {"SingleLine": address};
	var options = {
        	address: address,
       	outFields: ["Loc_name"]
    };
    locator.outSpatialReference = map.spatialReference;
    locator.addressToLocations(options);
}

function showAddress(candidates){
	var candidate;
	var geom;
	var geocodeLayer = new esri.layers.GraphicsLayer();
	map.addLayer(geocodeLayer);
	map.reorderLayer(geocodeLayer,1);
	
	var symbol = new esri.symbol.SimpleMarkerSymbol();
	symbol.setStyle(config.utilities.geocoder.symbology.symbol);
	symbol.setColor(new dojo.Color(config.utilities.geocoder.symbology.color))
        
	dojo.every(candidates,function(candidate){
	  	if (candidate.score > 80) {
	    	console.log(candidate.location);
	    	geom = candidate.location;
	    	var graphic = new esri.Graphic(geom, symbol);
	    	//add a graphic to the map at the geocoded location
	    	map.graphics.add(graphic);
	    	queryOfficial(candidate.location);
	    	geocodeLayer.add(symbol);
	    	return false; //break out of loop after one candidate with score greater  than 80 is found.
	  	}
	  	else{
	  		$("#addressError").innerHTML("Location not found");
	  	}
	});
	if(geom !== undefined){
		map.centerAndZoom(geom,12);
	}
}

function queryData(point){
	var id = $("#statsCombobox").val();;
	queryTask = new esri.tasks.QueryTask(config.utilities.query.url + id);
	query = new esri.tasks.Query();
	query.returnGeometry = true;
	query.outFields = ["*"];
	query.outSpatialReference = map.spatialReference;
	query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
	query.geometry = point
	var deferred = queryTask.execute(query);
	
	deferred.addCallback(function(response) {
		console.log(response);
		qData = statisticsModel(response.features[0].attributes);
    });
}
