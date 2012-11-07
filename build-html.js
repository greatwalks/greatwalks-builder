/*
 *  Builds HTML for the site.
 *
 */

var fs = require('fs'),
    path = require('path'),
    mustache = require("./mustache.js"),
    scale_by = 0.5; // the build-images.js has a scale_by=1 but this has scale_by=0.5.
                    // The reason for the difference is that build-images.js should render images at full resolution
                    // but the html should display these at half-size for high DPI displays (e.g. 'retina display')
    template = fs.readFileSync("html/template.html").toString(),
	htmlf_paths = fs.readdirSync("html"),
	include_directory = path.join(path.resolve("html"), "includes"),
	walks_paths = fs.readdirSync("walks"),
	walks_template_path = path.resolve("walks/template.mustache"),
	great_walks = {"walks":[]},
	template_slideout_walks = "";

String.prototype.CSV = function(strDelimiter) {
	// Normally I wouldn't extend a prototype in JavaScript
	// but in a short-lived build script it's harmless

	//via http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
     strDelimiter = (strDelimiter || ",");
     var objPattern = new RegExp(
     (
     "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
     "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
     "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
     var arrData = [
         []
     ];
     var arrMatches = null;
     while (arrMatches = objPattern.exec(this)) {
         var strMatchedDelimiter = arrMatches[1];
         if(strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
             arrData.push([]);
         }
         if (arrMatches[2]) {
             var strMatchedValue = arrMatches[2].replace(
             new RegExp("\"\"", "g"), "\"");
         } else {
             var strMatchedValue = arrMatches[3];
         }
         if(strMatchedValue.length !== 0){
         	arrData[arrData.length - 1].push(strMatchedValue);
         } else {
         }
     }
     if(arrData[arrData.length - 1].length === 0 ) {
     	arrData[arrData.length - 1].pop();
     }
     return (arrData);
}

String.prototype.CSVMap = function(strDelimiter) {
	//I wouldn't extend a prototype in a browser but
	// in a short-lived build script it's harmless
	
 	//presumes that first line is are the keys
 	var csv_array = this.CSV(strDelimiter),
 		first_row = csv_array[0],
 		keyed_map = [],
 		keyed_row,
 		row;
 	for(var i = 1; i < csv_array.length; i++){ //start from row 1 not 0
 		row = csv_array[i];
 		keyed_row = {}
 		for(var x = 0; x < row.length; x++){
			keyed_row[first_row[x]] = row[x];
 		}
 		keyed_map.push(keyed_row);
 	}
 	return keyed_map;
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function resolve_includes(html){
	return html.replace(/<\!--#include(.*?)-->/g,
		function(match, contents, offset, s){
			var include_filename = contents.substr(contents.indexOf("=\"")+2),
				include_path;
			include_filename = include_filename.substr(0, include_filename.indexOf("\""));
			include_path = path.join(include_directory, include_filename);
			//process.stdout.write(" -- including : " + include_path + "\n");
			return fs.readFileSync(include_path).toString();
		})
};

var share_social_details = {
	"default": 
		{
		"social_text": "I'm going on a Great Walk in New Zealand",
		"facebook_url": "http://greatwalks.co.nz/",
		"facebook_image": "http://www.greatwalks.co.nz/sites/all/themes/sparks_responsive/logo.png",
		"twitter_url": "http://bit.ly/SLFPlX"
		},
	"abel-tasman-coast-track":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the ABEL TASMEN COAST TRACK",
		"facebook_url": "http://www.greatwalks.co.nz/abel-tasman-coast-track",
		"twitter_url": "http://bit.ly/PBKyah"
		},
	"heaphy-track":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the HEAPHY TRACK",
		"facebook_url": "http://www.greatwalks.co.nz/heaphy-track",
		"twitter_url": "http://bit.ly/REibYQ"
		},
	"kepler-track":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the KEPLER TRACK",
		"facebook_url": "http://www.greatwalks.co.nz/kepler-track",
		"twitter_url": "http://bit.ly/VRNca2"
		},
	"lake-waikaremoana-track":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the WAIKAREMOANA TRACK",
		"facebook_url": "http://www.greatwalks.co.nz/lake-waikaremoana",
		"twitter_url": "http://bit.ly/PBKBTA"
		},
	"milford-track":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the MILFORD TRACK",
		"facebook_url": "http://www.greatwalks.co.nz/milford-track",
		"twitter_url": "http://bit.ly/SYbOOu"
		},
	"rakiura-track---stewart-island":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the RAKIURA TRACK ON STEWART ISLAND",
		"facebook_url": "http://www.greatwalks.co.nz/rakiura-track",
		"twitter_url": "http://bit.ly/XhJHyJ"
		},
	"routeburn-track":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the ROUTEBURN TRACK",
		"facebook_url": "http://www.greatwalks.co.nz/routeburn-track",
		"twitter_url": "http://bit.ly/UhPxQ8"
		},
	"tongariro-northern-circuit":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the TONGARIRO NORTHERN CIRCUIT",
		"facebook_url": "http://www.greatwalks.co.nz/tongariro-northern-circuit",
		"twitter_url": "http://bit.ly/YUBHSI"
		},
	"whanganui-journey":
		{
		"social_text": "I'm going on a Great Walk in New Zealand, the WHANGANUI JOURNEY",
		"facebook_url": "http://www.greatwalks.co.nz/whanganui-journey",
		"twitter_url": "http://bit.ly/Rf9sL6"
		}
}


/* 
 *  BEGIN BUILDING HTML
 */

//  Delete resulting CSVs (while leaving source files)
for(var i = 0; i < walks_paths.length; i++){
	var walk_name = walks_paths[i],
		walk_fullpath = path.resolve("walks/" + walk_name),
		walk_sanitised_name = walk_name.toLowerCase().replace(/ /g, "-"),
		walk_csv_path;
	if(fs.statSync(walk_fullpath).isDirectory()) {
		template_slideout_walks += '<li><a href="walk-' + walk_sanitised_name + '.html">' + walk_name + '</a></li>';
		walk_csv_path = path.join(walk_fullpath, "locations.csv");
		try {
			fs.unlinkSync(walk_csv_path);
		} catch (exception) {

		}
		// Write the header line of the CSV
		fs.writeFileSync(walk_csv_path, "Name,Description,Type,Long,Lat\n");
	}
}

template = resolve_includes(template).replace(/{{slide-walks}}/g, template_slideout_walks);

//  Aggregate all CSVs and write them into each Great Walk directory.
for(var i = 0; i < walks_paths.length; i++){
	var walk_file = walks_paths[i],
		walk_fullpath = path.resolve("walks/" + walk_file),
		location_id_mapping = {
			"LakeWaikaremoana":"Lake Waikaremoana Track",
			"WellingtonWaterfront":"Wellington",
			"TongariroNorthernCircuit":"Tongariro Northern Circuit",
			"WhanganuiJourney":"Whanganui Journey",
			"AbelTasmanCoastTrack":"Abel Tasman Coast Track",
			"HeaphyTrack":"Heaphy Track",
			"RouteburnTrack":"Routeburn Track",
			"MilfordTrack":"Milford Track",
			"KeplerTrack":"Kepler Track",
			"RakiuraTrack":"Rakiura Track - Stewart Island",
		},
		walk_csv_path,
		row,
		location_data_by_location = {},
		serialized_row = "";
	if(!fs.statSync(walk_fullpath).isDirectory() && walk_file.endsWith(".csv")){
		locations_data = fs.readFileSync(walk_fullpath).toString().CSVMap();
		for(var y = 0; y < locations_data.length; y++){
			row = locations_data[y];
			if(row.Long !== undefined) { //'Long' (longitude) is arbitrary field chosen to see if it's present in the data, to test whether this this infact a row of data or a blank line
				if(location_data_by_location[row.GreatWalk] === undefined) {
					location_data_by_location[row.GreatWalk] = [];
				}
				row.GreatWalkId = location_id_mapping[row.GreatWalk];
				if(row.GreatWalkId === undefined) {
					throw "Unable to find GreatWalkId for " + row.GreatWalk;
				}
				walk_csv_path = path.resolve(path.join("walks", row.GreatWalkId, "locations.csv"));
				if(row.NAME) {
					serialized_row = row.NAME + ", ," + row.Point + "," + row.Long + "," + row.Lat + "\n";
				} else if(row.POIIconType) {
					serialized_row = row.Name + "," + row.Description + " ," + row.POIIconType + "," + row.Long + "," + row.Lat + "\n";
				} else {
					throw "Unrecognised CSV columns: " + JSON.stringify(row);
				}
				fs.appendFileSync(walk_csv_path, serialized_row);
				location_data_by_location[row.GreatWalk].push(row);
			}
		}
	}
}

//  Generate Maps
for(var i = 0; i < walks_paths.length; i++){
	var walk_name = walks_paths[i],
		walk_sanitised_name = walk_name.toLowerCase().replace(/ /g, "-"),
		walk_fullpath = path.resolve("walks/" + walk_name),
		map_path = path.join("walks", walk_name, "map.png"),
		map_fullpath = path.resolve(map_path),
		locations_path = path.join(walk_fullpath, "locations.csv"),
		locations_data = undefined,
		location = undefined,
		pgw_path = path.join(walk_fullpath, "map.pgw"),
		map_data = undefined,
		map_data_array = undefined,
		map_details = undefined,
		html_page = undefined,
		mustache_data = {},
		new_path,
		new_filename,
		map_dimensions_json_string;

	if(fs.statSync(walk_fullpath).isDirectory()) {
		mustache_data = {
			map_id: walk_sanitised_name,
			map_pixel_width: 100,
			map_pixel_height: 100
		},
		imdim_command = "imdim \"{\\\"width\\\":%w, \\\"height\\\":%h}\" \"" + map_fullpath + "\"";
		//map
		//process.stdout.write("map dimensions:\n " + imdim_command + "\n\n");
		map_dimensions_json_string = execSync(imdim_command);
		//process.stdout.write("/map dimensions");
		if(map_dimensions_json_string.indexOf("{\"width") >= 0) {
			var map_dimensions_json = JSON.parse(map_dimensions_json_string);
			mustache_data.map_pixel_width = Math.floor(map_dimensions_json.width * scale_by);
			mustache_data.map_pixel_height = Math.floor(map_dimensions_json.height * scale_by);
		}

		//offset
		try {
			map_data = fs.readFileSync(pgw_path).toString();
		} catch(exception) {
			process.stdout.write("Unable to find a pgw file. Unable to proceed")
		}
		if(map_data !== undefined) {
			map_data_array = map_data.split("\n");
			map_details = {};
			map_details.latitude = parseFloat(extract_value_between(map_data_array, -60, -30));
			map_details.longitude = parseFloat(extract_value_between(map_data_array, 150, 180));
			map_details.map_pixel_width = mustache_data.map_pixel_width;
			map_details.map_pixel_height = mustache_data.map_pixel_height;
			map_details.degrees_per_pixel = parseFloat(extract_value_between(map_data_array, 0, 2) / scale_by);
			map_details.extent_latitude = map_details.latitude - (mustache_data.map_pixel_height * map_details.degrees_per_pixel);
			map_details.extent_longitude = map_details.longitude + (mustache_data.map_pixel_width * map_details.degrees_per_pixel);
			mustache_data.map_details = JSON.stringify(map_details);
		}
		//locations
		try {
			locations_data = fs.readFileSync(locations_path).toString();
		} catch(exception) {
		}
		mustache_data.locations = [];
		if(locations_data !== undefined){
			locations = locations_data.CSVMap(",");
			mustache_data.locations = []
			for(var location_index = 0; location_index < locations.length; location_index++){
				location = locations[location_index];
				if(location.Long !== undefined) {  //'Long' (longitude) is arbitrary field chosen to see if it's present in the data, to test whether this this infact a row of data or a blank line
					try {
						location.pixel = pixel_location(map_details.latitude, map_details.longitude, mustache_data.map_pixel_width, mustache_data.map_pixel_height, map_details.degrees_per_pixel, location.Lat, location.Long, walk_name, location.DESCRIPTIO);
						location.percentage = {left: location.pixel.left / map_details.map_pixel_width * 100, top: location.pixel.top / map_details.map_pixel_height * 100 };
						mustache_data.locations.push(location);
					} catch(exception) {
						process.stdout.write(exception.message + " | " + JSON.stringify(location));
						//throw exception
					}
				}
			}
		}
		//generate page
		html_page = process_page(walks_template_path, walk_name, mustache_data, "map");
	}

	if(html_page !== undefined) {
		new_filename = "map-" + walk_sanitised_name + ".html";
		new_path = path.resolve("../greatwalks/" + new_filename);
		great_walks.walks.push({"id": walk_sanitised_name, "name": walk_name, "filename":new_filename})
		fs.writeFileSync(new_path, html_page);
		process.stdout.write("Building map: " + new_filename + "\n");
	}

	html_page = undefined;
	map_data = undefined;
	locations_data = undefined;
}

// Generate Walk Info Page
for(var i = 0; i < walks_paths.length; i++){
	var walk_name = walks_paths[i],
		walk_sanitised_name = walk_name.toLowerCase().replace(/ /g, "-"),
		walk_fullpath = path.resolve("walks/" + walk_name);


}

for(var i = 0; i < htmlf_paths.length; i++){
	var htmlf_path = htmlf_paths[i],
		htmlf_fullpath = path.resolve("html/" + htmlf_path),
		htmlf_path_extension = htmlf_path.substr(htmlf_path.lastIndexOf(".") + 1),
		new_path = path.resolve("../greatwalks/" + htmlf_path.replace("." + htmlf_path_extension, ".html")),
		html_page = undefined,
		basename = path.basename(htmlf_path),
		filename_extension = path.extname(htmlf_path),
		basename_without_extension = path.basename(htmlf_path, filename_extension);
	if(!fs.statSync(htmlf_fullpath).isDirectory()){
		html_page = process_page(htmlf_fullpath, "", {}, basename_without_extension);
	}
	if(html_page !== undefined) {
		process.stdout.write("Building: " + htmlf_path + " to " + new_path + "\n");
		fs.writeFileSync(new_path, html_page);
	}
	html_page = undefined;
}


function process_page(htmlf_path, page_title, mustache_data, page_id){
	var htmlf_data = resolve_includes(fs.readFileSync(htmlf_path).toString()),
		htmlf_path_extension = htmlf_path.substr(htmlf_path.lastIndexOf(".") + 1),
		htmlf_filename = path.basename(htmlf_path),
		html_page,
		share_social_detail_key,
		chosen_share_social,
		chosen_share_social_key,
		social_item_key
		page_key = htmlf_path;

	if(mustache_data && mustache_data.map_id !== undefined) {
		page_key = mustache_data.map_id;
	}

	for(share_social_detail_key in share_social_details){
		if(page_key.indexOf(share_social_detail_key) !== -1) {
			chosen_share_social = share_social_details[share_social_detail_key];
			chosen_share_social_key = share_social_detail_key;
		}
	}
	if(chosen_share_social === undefined) {
		chosen_share_social_key = "default";
		chosen_share_social = share_social_details[chosen_share_social_key];
	}
	for(social_item_key in share_social_details.default){
		if(chosen_share_social[social_item_key] === undefined) {
			chosen_share_social[social_item_key] = share_social_details.default[social_item_key];
		}
	}

	page_title = page_title || htmlf_path;

	switch(htmlf_path_extension){
		case "htmlf": //straight copy
			html_page = template
				.replace(/{{body}}/, htmlf_data)
				.replace(/{{title}}/, page_title)
				.replace(/{{pageid}}/, page_id);
			break;
		case "mustache": //mustache template - see http://mustache.github.com/
			var json_data = mustache_data || {},
				json_path = path.join("html", htmlf_path.replace("." + htmlf_path_extension, ".json"));
			switch(htmlf_filename) { //add any custom JSON data here
				case "walks.mustache":
					json_data = great_walks;
					//process.stdout.write("great_walks: " + JSON.stringify(great_walks) + "\n");
					break;
			}
			html_page = template
				.replace(/{{body}}/, mustache.to_html(htmlf_data, json_data))
				.replace(/{{title}}/, page_title)
				.replace(/{{pageid}}/, page_id);
			json_data = {};
			break;
	}
	if(html_page !== undefined){
		html_page = html_page
						.replace(/{{social_text}}/g, encodeURIComponent(chosen_share_social.social_text).replace(/'/g, "%27"))
						.replace(/{{twitter_url}}/g, encodeURIComponent(chosen_share_social.twitter_url).replace(/'/g, "%27"))
						.replace(/{{facebook_image}}/g, encodeURIComponent(chosen_share_social.facebook_image).replace(/'/g, "%27"))
						.replace(/{{facebook_url}}/g, encodeURIComponent(chosen_share_social.facebook_url).replace(/'/g, "%27"));
	}
	return html_page;
}

function extract_value_between(map_data_array, greater_than, less_than) {
	for(var i = 0; i < map_data_array.length; i++){
		var item = parseFloat(map_data_array[i]);
		if(!isNaN(item) && item > greater_than && item < less_than) {
			return item;
		}
	}
	return undefined;
}

function pixel_location(map_latitude, map_longitude, map_pixel_width, map_pixel_height, degrees_per_pixel_scaled_by, location_latitude, location_longitude, map_name, location_name){
	var pixel = {
		"latitude": location_latitude,
		"longitude": location_longitude,
		"latitude_offset": location_latitude - map_latitude,
		"longitude_offset": location_longitude - map_longitude
		},
		offmap = false,
		offmap_message = "WARNING location out of bounds " + map_name + ": " + location_name + "\n";
	pixel.left = Math.round(pixel.longitude_offset / degrees_per_pixel_scaled_by);
	pixel.top = -Math.round(pixel.latitude_offset / degrees_per_pixel_scaled_by);
	if(pixel.left > map_pixel_width || pixel.top > map_pixel_height) {
		offmap = true;
	} else if (pixel.left.toString() === "NaN" || pixel.top.toString() === "NaN") {
		offmap = true;
	}
	if(offmap){
		throw { 
		    name: "OutOfBounds", 
    		message: offmap_message
		}
	}
	//process.stdout.write("[" + pixel.left.toString() + "]");
	return pixel;
}

function execSync(cmd) {
	// nodeJS doesn't have a synchronous exec (e.g. execSync()).
	// full credit and blame for this function goes to
	// http://stackoverflow.com/questions/4443597/node-js-execute-system-command-synchronously/9051718#9051718

    var exec  = require('child_process').exec;
    var fs = require('fs');
    //for linux use ; instead of &&
    //execute your command followed by a simple echo 
    //to file to indicate process is finished
    exec(cmd + " > c:\\stdout.txt && echo done > c:\\sync.txt");
    while (true) {
        //consider a timeout option to prevent infinite loop
        //NOTE: this will max out your cpu too!
        try {
            var status = fs.readFileSync('c:\\sync.txt', 'utf8');
            if (status.trim() == "done") {
                var res = fs.readFileSync("c:\\stdout.txt", 'utf8');
                fs.unlinkSync("c:\\stdout.txt"); //cleanup temp files
                fs.unlinkSync("c:\\sync.txt");
                return res;
            }
        } catch(e) { } //readFileSync will fail until file exists
    }
};

