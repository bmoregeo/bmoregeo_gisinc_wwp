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
function officialModel(official){
	console.log(official);
	var info = {
		"General":{
			"ID":			getValue(official,'bioguide_id',''),
			"Full Name":	[getValue(official, 'title', ''), getValue(official, 'firstname', ''), getValue(official, 'lastname', '')].join(" "),
			"Full Title": 	[getValue(official, 'title', ''), getValue(official, 'firstname', ''), getValue(official, 'lastname', ''), "(" + getValue(official, 'party', '') + ")"].join(" "),
		},
		"Personal Info":{
			"Birth Date": 	getValue(official, "birthdate", ''),
			"Photo": 		getValue(official, 'bioguide_id', '<img class="headshot" src="img/100x125/{bioguide_id}.jpg" alt="Headshot Picture" />'),
		},
		"Legislator Info":{
			"State": 		getValue(official, 'state',''),
			"District": 	getValue(official, 'district',''),
			"Email": 		getValue(official, 'email',''),
			"Senate Class": getValue(official, 'senate_class',''),
		},
		"Contact Info":{
			"Phone": 		getValue(official, 'phone',''),
			"Fax": 			getValue(official, 'fax',''),
			"Address": 		getValue(official, 'congress_office'),
			"Email": 		getValue(official, 'email', '<a href="mailto:{email}">Email Link</a>'),
			"Web Address": 	getValue(official, 'website', '<a href="{website}">Website Link</a>'),
			"Congresspedia": getValue(official, 'congresspedia_url', '<a href="{congresspedia_url}">Congresspedia Link</a>'),
		},
		"Social Media Info":{
			"Twitter": 		getValue(official, 'twitter_id', '<a href="http://twitter.com/#!/{twitter_id}">Twitter Link</a>'),
			"YouTube":		getValue(official, 'youtube_url', '<a href="{youtube_url}">Youtube Link</a>'),
			"Facebook":		getValue(official, 'facebook_id', '<a href="http://facebook.com/{facebook_id}">Facebook Link</a>'),
			"RSS Feed":		getValue(official, 'official_rss', '<a href="{official_rss}">RSS Link</a>'),
			"Eventful":		getValue(official, 'eventful_id', '<a href="http://eventful.com/{eventful_id}">Eventful Link</a>'),
		}	
	};
	return info;
}
function officialView(info){
	var text = "";
	for (var section in info){
		if (!(section == 'General')){
			text = text + table(info["General"]["ID"], section, info[section]);
		}
	}
	return text;
}