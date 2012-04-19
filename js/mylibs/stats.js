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

function statisticsModel(statFeature){
	console.log(statFeature);
	return [{
			"data":{
				"Census Demographics":{
					"Population Density": getFloat(statFeature, "TOTPOP_CY", "comma"),
					"Percent Growth": getFloat(statFeature, "POPGRW00_CY ", "comma"),
					"Population Over 18": getFloat(statFeature, "POP18UP_CY", "comma"),
				}
			},
			"type":"table",
		},{
			"data":{
				"WWP Demographics":{
					"WWP Volunteers": getFloat(statFeature, "WWP_VOLUNTEER", "comma"),
					"Approved Members": getFloat(statFeature, "WWP_APPROVED", "comma"),
					"Pending Members": getFloat(statFeature, "WWP_PENDING", "comma"),
			}
		},
			"type":"table",
		},{
			"data":{
				"Veteran Population":{
					"2000": getFloat(statFeature, "P9_30_2000"),
					"2005": getFloat(statFeature, "P9_30_2005"),
					"2010": getFloat(statFeature, "P9_30_2010"),
					"2015": getFloat(statFeature, "P9_30_2015"),
					"2020": getFloat(statFeature, "P9_30_2020"),
					"2025": getFloat(statFeature, "P9_30_2025"),
					"2030": getFloat(statFeature, "P9_30_2030")
				}
			},
			"type": "Columns"
		},
		
	
	]
}

function statisticsView(div, infos){
	dojo.forEach(infos, function(info){
		console.log(info);
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
				id = div.replace(/\s/g,"_") + 'statchart_'+ key.replace(/\s/g,"_") + '_' + c
				$(div).append('<div id="' + id + '" class="statChart"><h3>'+ key +'</h3></div>');
				chart(id, key, info.data[key], info.type);
			}
		}
		else{alert('nope');}
		return text;
	});
}

function identResultCallback(results){
	var ids = []
	if(results){
		dojo.forEach(results, function(result){
			if (!(result.layerId in ids)){
				ids.push(result.layerName);
				var iData = statisticsModel(result.feature.attributes);				
				if (result.layerName === 'STATE'){
					$('#statState div').html("");
					statisticsView('#statState div', iData);
				} else if(result.layerName === 'CONGRESSIONAL'){
					$('#statCongress div').html("");
					statisticsView('#statCongress div', iData);
				} else if(result.layerName === 'COUNTY'){
					$('#statCounty div').html("");
					statisticsView('#statCounty div', iData);
				} else if(result.layerName === 'ZIP5'){
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

