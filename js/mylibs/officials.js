/**
 * @author Christopher Fricke
 */

function getOfficialCallback(data){
	if (data.response){
		for (var l in data.response.legislators){
			var oData = officialModel(data.response.legislators[l].legislator);
			
			if (oData["Legislator Info"]["District"] === 'Senior Seat'){
				$('#senSenior h3 a').html(oData["General"]["Full Title"]);
				$('#senSenior div').html(officialView(oData));
			}
			else if(oData["Legislator Info"]["District"] === 'Junior Seat'){
				$('#senJunior h3 a').html(oData["General"]["Full Title"]);
				$('#senJunior div').html(officialView(oData));
			}
			else {
				$('#congress h3 a').html(oData["General"]["Full Title"]);
				$('#congress div').html(officialView(oData));
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

function queryOfficial(point) {
 	var outSR = new esri.SpatialReference({ wkid: 4326});
	gsvc.project([ point ], outSR, function(projectedPoints){
		var slurl = config.sunlight.url + config.sunlight.tools.legFromLatLng + "?&jsonp=getOfficialCallback&apikey=" + config.sunlight.apikey + "&longitude=" + projectedPoints[0].x + "&latitude=" +  projectedPoints[0].y;
		dojo.io.script.get({
			url:slurl,
			callbackParamName: "getOfficialCallback",
			load:function(data){}
		});
	});
}