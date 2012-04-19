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
			opacity: layer.opacity,
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
	var symbol = new esri.symbol.SimpleMarkerSymbol();
		
	symbol.setStyle(config.utilities.geocoder.symbology.symbol);
	symbol.setColor(new dojo.Color(config.utilities.geocoder.symbology.color))
        
	dojo.every(candidates,function(candidate){
	  	if (candidate.score > 80) {
	    	geom = candidate.location;
	    	var graphic = new esri.Graphic(geom, symbol);
	    	//add a graphic to the map at the geocoded location
	    	map.graphics.add(graphic);
	    	queryOfficial(candidate.location);
	    	queryStatistics(candidate.location);
	    	setTimeout(clearGeocode, 5000)
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


function getValue(object, value, template){
	try{
		if(template.length && object[value].length){
			return template.replace('{' + value + '}', object[value]);
		}
		else if(object[value]){
			return object[value];
		}
		else{
		return ""
		}
	}
	catch(err){
		return " "
	}
}
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
function getFloat(object, value, template){
	try{
		if(object[value]){
			r = "";
			if(template == "comma"){r = addCommas(parseFloat(object[value]));}
			else{r = parseFloat(object[value]);}
			
			return r;
		}
		else{
			return 0;
		}
	}
	catch(err){
		return 0
	}
}

