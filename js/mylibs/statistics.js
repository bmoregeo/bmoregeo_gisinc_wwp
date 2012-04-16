/**
 * @author Christopher Fricke
 */

function queryStatistics(point){
	var id = $("#statsCombobox").val();
	queryTask = new esri.tasks.QueryTask(config.utilities.query.url + id);
	query = new esri.tasks.Query();
	query.returnGeometry = true;
	query.outFields = ["*"];
	query.outSpatialReference = map.spatialReference;
	query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
	query.geometry = point
	var deferred = queryTask.execute(query);
	
	deferred.addCallback(function(response) {
		console.log(response.features);
		if (response.features.length){
			qData = statisticsModel(response.features[0].attributes);
			$('#statsDiv').html('');
			for (var item in qData){
				statisticsView(qData[item]);
			}
		}
		else{
			$('#statsDiv').html("No Informtion Available");
		}
	});
}


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
}

function statisticsView(info){
	var text = "";
	if (info.type === "table"){
		var x = 0;
		for (var key in info.data){
			x = x + 1;
			$('#statsDiv').append(table('stat_' + x, key, info.data[key]));
		}
	}
	else if(info.type === 'Columns'){
		var c = 0;
		for (var key in info.data){
			c = c + 1;
			id = 'statchart_'+ key.replace(/\s/g,"_") + '_' + c
			$('#statsDiv').append('<div id="' + id + '" class="statChart"><h3>'+ key +'</h3></div>');
			chart(id, key, info.data[key], info.type);
		}
	}
	return text;
}




function getStatCallback(data){
	if (data.response){
		for (var l in data.response.legislators){
			var oData = officialModel(data.response.legislators[l].legislator);
			
			if (oData["Legislator Info"]["District"] === 'Senior Seat'){
				$('#statState h3 a').html(oData["General"]["Full Title"]);
				$('#statState div').html(officialView(oData));
			}
			else if(oData["Legislator Info"]["District"] === 'Junior Seat'){
				$('#statState h3 a').html(oData["General"]["Full Title"]);
				$('#statState div').html(officialView(oData));
			}
			else {
				$('#statState h3 a').html(oData["General"]["Full Title"]);
				$('#statState div').html(officialView(oData));
			}
		}
	}
	else{
		$('#senSenior h3 a').html("Senior Senetor");
		$('#senSenior div').html("No Information Available");
		$('#senJunior h3 a').html("Junior Senator");
		$('#senJunior div').html("No Information Available");
		$('#congress h3 a').html("Congressperson");
		$('#congress div').html("No Information Available");
	}
}
