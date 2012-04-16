/**
 * @author Christopher Fricke
 */
function initIdentStat(){
	var iLayers = dojo.map(config.utilities.query.layers, function(layer){
		return layer.id;
	});
	identifyTask = new esri.tasks.IdentifyTask(config.utilities.query.url);
	identifyParams = new esri.tasks.IdentifyParameters();
	identifyParams.tolerance = 1;
	identifyParams.returnGeometry = false;
	identifyParams.layerIds = iLayers;
	identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
	identifyParams.width  = map.width;
	identifyParams.height = map.height;
}

function identStat(point){
	identifyParams.geometry = point;
	identifyParams.mapExtent = map.extent;
	identifyTask.execute(identifyParams, function(idResults) { identResultCallback(idResults); });
}
/*
function statisticsModel(statFeature){
	var info = [
		{"data":{
			"Projected":{
				"5 - 17": getValue(statFeature, "AGE_5_17", ""),
				"18 - 21": getValue(statFeature, "AGE_18_21", ""),
				"22 - 29": getValue(statFeature, "AGE_22_29", ""),
				"30 - 39": getValue(statFeature, "AGE_30_39", ""),
				"40 - 49": getValue(statFeature, "AGE_40_49", ""),
				"50 - 64": getValue(statFeature, "AGE_50_64", ""),
				"65+": getValue(statFeature, "AGE_65_UP", "")
			}
		},
		"type": "table"
	},{"data":{
			"Population Age Breakdown":{
				"5 - 17": getValue(statFeature, "AGE_5_17", ""),
				"18 - 21": getValue(statFeature, "AGE_18_21", ""),
				"22 - 29": getValue(statFeature, "AGE_22_29", ""),
				"30 - 39": getValue(statFeature, "AGE_30_39", ""),
				"40 - 49": getValue(statFeature, "AGE_40_49", ""),
				"50 - 64": getValue(statFeature, "AGE_50_64", ""),
				"65+": getValue(statFeature, "AGE_65_UP", "")
			}
		},
		"type": "Columns"
	},
	]
	return info;
}*/
function statisticsModel(statFeature){
	return [
		{"data":{
			"Example":{
				"Shape_Length": getValue(statFeature, "Shape_Length", ""),
				"Shape_Area": getValue(statFeature, "Shape_Area", ""),
				"ObjectID": getValue(statFeature, "OBJECTID", ""),
			}
		},
		"type":"table",
		}
	]
}

function statisticsView(div, info){
	info = info[0];
	console.log(info[0]);
	var text = "";
	if (info.type === "table"){
		var x = 0;
		for (var key in info.data){
			x = x + 1;
			$(div).append(table('stat_' + x, key, info.data[key]));
		}
	}
	else if(info.type === 'Columns'){
		var c = 0;
		for (var key in info.data){
			c = c + 1;
			id = 'statchart_'+ key.replace(/\s/g,"_") + '_' + c
			$(div).append('<div id="' + id + '" class="statChart"><h3>'+ key +'</h3></div>');
			chart(id, key, info.data[key], info.type);
		}
	}
	else{alert('nope');}
	return text;
}

function identResultCallback(results){
	var ids = []
	if(results){
		dojo.forEach(results, function(result){
			if (!(result.layerId in ids)){
				//console.log(result);
				ids.push(result.layerName);
				var iData = statisticsModel(result.feature.attributes);
				if (result.layerName === 'STATE'){
					$('#statState div').html("");
					statisticsView('#statState div', iData);
				} else if(result.layerName === 'CONGRESSIONALDISTRICT'){
					$('#statCongress div').html("");
					statisticsView('#statCongress div', iData);
				} else if(result.layerName === 'COUNTY'){
					$('#statCounty div').html("");
					statisticsView('#statCounty div', iData);
				} else if(result.layerName === 'ZIP'){
					$('#statZip div').html("");
					statisticsView('#statZip div', iData);
				} else {console.log("does not work");}
			}
		});
	} else {
		$('#statState h3').html("State");
		$('#statState div').html("No Information Available");
		$('#statCongress h3').html("Congressional");
		$('#statCongress div').html("No Information Available");
		$('#statCounty h3').html("County");
		$('#statCounty div').html("No Information Available");
		$('#statZip h3').html("State");
		$('#statZip div').html("No Information Available");
	}
}

