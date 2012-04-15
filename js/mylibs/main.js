/**
 * @author Christopher Fricke
 */
/* Load in Libraries */

dojo.require("esri.dijit.Legend");
dojo.require("esri.map");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("esri.arcgis.utils");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.geometry");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Select");
dojo.require("dojox.charting.widget.Chart2D");
dojo.require("dojox.charting.themes.Electric");


/* Global Variables */
var map;
var locator = new esri.tasks.Locator(config.utilities.geocoder.url);
var gsvc = new esri.tasks.GeometryService(config.utilities.geometry.url);
var basemapGallery;

$(document).ready(function() {
	
	/* Make header,content and sidebar content panels */
	$('body').layout({ 
   		applyDefaultStyles: true,
   		north:{
   			resizable:false,
   			slidable:false,
   			closable:false,
   		},
   		center:{
   			onresize_end: function(){
   				$('#map').css("width","100%");
   				$('#map').css("height","100%");
   				$('#map_root').css("width","100%");
   				$('#map_root').css("height","100%");
   				map.resize();
   			}
   		},
   		east:{
   			size:400,
      	},
   	});
   	/* Add officials accordian panel*/
	$("#officials").accordion({ 
		header: "h3",
		autoHeight: false,
 	});
 	
 	$("#statistics").accordion({ 
		header: "h3",
		autoHeight: false,
 	});
	
	/* Create tabed sidebar */
	$('#sidebarTabs').tabs({header:"h2"});
	
});
function clearGeocode(){
	map.graphics.clear();
}
function makeMap(){
	/* Build Map */
	var initExtent = new esri.geometry.Extent(config.extent);
	map = new esri.Map("map", {extent:esri.geometry.geographicToWebMercator(initExtent)});	
	
	/* Basemap */
	var basemap = new esri.layers.ArcGISTiledMapServiceLayer(config.layers.basemap.service, {
			id : config.layers.basemap.id,
	});
   	map.addLayer(basemap);
   	
   	/* Setup Query Layers */
   	addQueryLayers();
   	
   	/* Operational Layers */
   	legendLayers = addDynamicLayers();
   	
   	/* Geocode Graphics */
	geocodeLayer = new esri.layers.GraphicsLayer({id:"lyrGeocode"});
	map.addLayer(geocodeLayer);
	map.reorderLayer(geocodeLayer,1);
   	
   	
   	// on click, update stats  
   	dojo.connect(dojo.byId('addressSearch'), 'onchange', function(evt){locate(evt.target.value)});
  	dojo.connect(locator, "onAddressToLocationsComplete", showAddress); 	
   	dojo.connect(dojo.byId('legendCombobox'), 'onchange', function(evt){setVisibleLayers(evt.target.value)});
	
	dojo.connect(map, "onClick", function(evt) {
		queryOfficial(evt.mapPoint);
		queryStatistics(evt.mapPoint);
	});
	
   	/* Add Legend */
   	dojo.connect(map,'onLayersAddResult',function(results){
	   	var legend = new esri.dijit.Legend({
	            map:map,
	            layerInfos:legendLayers,
	          },"legendDiv");
	    
		legend.startup();
	});
}
dojo.addOnLoad(makeMap);
