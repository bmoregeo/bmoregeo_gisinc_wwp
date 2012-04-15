var config = {
	"layers": {
	"basemap": {"service": "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer", 
				"title": "Street Map",
				"id": "esriStreetMap"},
		"dynamicLayers": [{
				"service": "http://wwp.gisinc.com/ArcGIS/rest/services/FRICKE/ApprovedWW/MapServer",
				"title": "Approved WWP",
				"id": "AWWP",
				"visible":true,
				},{
				"service": "http://wwp.gisinc.com/ArcGIS/rest/services/FRICKE/PendingWW/MapServer",
				"title": "Pending WWP",
				"id": "PWWP",
				"visible":false,
				},{
				"service": "http://wwp.gisinc.com/ArcGIS/rest/services/FRICKE/Volunteers/MapServer",
				"title": "Volunteers",
				"id": "VWWP",
				"visible":false,
				},{
				"service": "http://services.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Population_Density/MapServer",
				"title": "Population Density",
				"id": "PopDensity",
				"visible":false,
				},
				
				]
	},	
	"extent": {"xmin": -135.46, "ymin": 37.73, "xmax": -67.36, "ymax": 37.77, "spatialReference": {"wkid": 4326}},
	"utilities": {
		"geocoder": {
			"url": "http://tasks.arcgisonline.com/ArcGIS/rest/services/Locators/TA_Address_NA_10/GeocodeServer/findAddressCandidates",
			"symbology": {
				"symbol": esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
				"color": [0,0,255,0.75],
			},
		},
		"query":{
			"url": "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/",
			"layers":[
				{"title": "National", "id":5, "fields":[]},
				{"title": "Congressional", "id":5, "fields":[]},
				{"title": "State", "id":5, "fields":[]},
				{"title": "County", "id":2, "fields":[]},

			]
		},
		"geometry":{
			"url": "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer/project",
		}
	},
	"sunlight": {
		"url": "http://services.sunlightlabs.com/api/",
		"apikey": "357f86221c7349f89afce32088594644",
		"tools": {
			"legFromLatLng": "legislators.allForLatLong.json",
		},
	}		
};

function table(id, title, data){
	var text = [];
	text = text.concat(['<table class="officialTable" id="', title.replace(" ","_"), "_", id, '">']);
	text = text.concat(["<th class='title', colspan=2>", title, "</th>"]);
	//console.log(data);
	for (var field in data){
		if (data[field]){
			text = text.concat(["<tr><th class='key'>", field, ":</th><td class='value'>", data[field], "</td></tr>"]);
		}
	}
	text = text.concat("</table>");
	return text.join("")
}
function chart(id, title, infoData, type){
	var data = [];
	var labels = [];
	var x = 0;
	var chart = new dojox.charting.Chart2D(id,{fill:'black'});
	
	for (var i in infoData){
		x = x + 1;
		data.push(infoData[i]);
		labels.push({value: x, text: i});
	}
	chart.setTheme(dojox.charting.themes.Electric);
	chart.addPlot("default", {
		type: type,
		fontColor:'#fff',
		fill:'#000',
		stroke:'#000',
	});
	chart.addSeries(title, data,{stroke: {color:"#fff"}, fill: "#75ABFF"});
	chart.addAxis("x", {labels:labels, majorLabels:true, stroke:'white', fontColor:'white'});
	chart.addAxis("y", {vertical: true, min:0, fontColor:'white', stroke:'white'});
	chart.render();
}