var fs = require('fs');
var path = require('path');
var mustache = require("./mustache.js");

var scale_by = 0.5;

var template = fs.readFileSync("html/template.html").toString(),
	htmlf_paths = fs.readdirSync("html"),
	include_directory = path.join(path.resolve("html"), "includes"),
	walks_paths = fs.readdirSync("walks"),
	walks_template_path = path.resolve("walks/template.mustache"),
	great_walks = {"walks":[]};

//via http://www.greywyvern.com/?post=258
String.prototype.CSV = function(strDelimiter) {
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
         arrData[arrData.length - 1].push(strMatchedValue);
     }
     return (arrData);
 }

 String.prototype.CSVMap = function(strDelimiter) {
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
		tfw_path = path.join(walk_fullpath, "map.tfw"),
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
		}
		//map
		map_dimensions_json_string = execSync("imdim \"{\\\"width\\\":%w, \\\"height\\\":%h}\" \"" + map_fullpath + "\"");
		if(map_dimensions_json_string.indexOf("{\"width") >= 0) {
			var map_dimensions_json = JSON.parse(map_dimensions_json_string);
			mustache_data.map_pixel_width = map_dimensions_json.width * scale_by;
			mustache_data.map_pixel_height = map_dimensions_json.height * scale_by;
		}
		//offset
		try {
			map_data = fs.readFileSync(pgw_path).toString();
		} catch(exception) {
			try {
				map_data = fs.readFileSync(tfw_path).toString();
			} catch (exception) {
				process.stdout.write("Unable to find a tfw/pgw file. Unable to proceed")
			}
		}
		if(map_data !== undefined) {
			map_data_array = map_data.split("\n");
			map_details = {};
			map_details.latitude = extract_value_between(map_data_array, -60, -30);
			map_details.longitude = extract_value_between(map_data_array, 150, 180);
			map_details.pixel_degrees = extract_value_between(map_data_array, 0, 2) * scale_by;
			mustache_data.map_details = JSON.stringify(map_details);
			//process.stdout.write(JSON.stringify(map_details) + " " + JSON.stringify(map_data_array));
		}
		//locations
		try {
			locations_data = fs.readFileSync(locations_path).toString();
		} catch(exception) {
		}
		if(locations_data !== undefined){
			locations = locations_data.CSVMap("\t");
			for(var location_index = 0; location_index < locations.length; location_index++){
				location = locations[location_index];
				location.pixel_top = -parseInt((parseFloat(location.Lat) - parseFloat(map_details.latitude)) / parseFloat(map_details.pixel_degrees) * scale_by, 10);
				location.pixel_left = parseInt((parseFloat(location.Long) - parseFloat(map_details.longitude)) / parseFloat(map_details.pixel_degrees) * scale_by, 10);
			}
			mustache_data.locations = locations;
		}
		//generate page
		html_page = process_page(walks_template_path, walk_name, mustache_data);
	}

	if(html_page !== undefined) {
		new_filename = "walk-" + walk_sanitised_name + ".html";
		new_path = path.resolve("../greatwalks/" + new_filename);
		great_walks.walks.push({"id": walk_sanitised_name, "name": walk_name, "filename":new_filename})
		fs.writeFileSync(new_path, html_page);
		process.stdout.write("Building walk: " + new_filename + "\n");
	}

	html_page = undefined;
	map_data = undefined;
	locations_data = undefined;
}


for(var i = 0; i < htmlf_paths.length; i++){
	var htmlf_path = htmlf_paths[i],
		htmlf_fullpath = path.resolve("html/" + htmlf_path),
		htmlf_path_extension = htmlf_path.substr(htmlf_path.lastIndexOf(".") + 1),
		new_path = path.resolve("../greatwalks/" + htmlf_path.replace("." + htmlf_path_extension, ".html")),
		html_page = undefined;
	if(!fs.statSync(htmlf_fullpath).isDirectory()){
		html_page = process_page(htmlf_fullpath);
	}
	if(html_page !== undefined) {
		process.stdout.write("Building: " + htmlf_path + " to " + new_path + "\n");
		fs.writeFileSync(new_path, html_page);
	}
	html_page = undefined;
}


function process_page(htmlf_path, page_title, mustache_data){
	var htmlf_data = fs.readFileSync(htmlf_path).toString(),
		htmlf_path_extension = htmlf_path.substr(htmlf_path.lastIndexOf(".") + 1),
		htmlf_filename = path.basename(htmlf_path),
		html_page,

	htmlf_data = htmlf_data.replace(/<\!--#include(.*?)-->/g,
				function(match, contents, offset, s){
					var include_filename = contents.substr(contents.indexOf("=\"")+2),
						include_path;
					include_filename = include_filename.substr(0, include_filename.indexOf("\""));
					include_path = path.join(include_directory, include_filename);
					//process.stdout.write(" -- including : " + include_path + "\n");
					return fs.readFileSync(include_path).toString();
				});
	page_title = page_title || htmlf_path;

	switch(htmlf_path_extension){
		case "htmlf": //straight copy
			html_page = template
				.replace(/{{body}}/, htmlf_data)
				.replace(/{{title}}/, page_title);
			break;
		case "mustache": //mustache template - see http://mustache.github.com/
			var json_data = mustache_data || {},
				json_path = path.join("html", htmlf_path.replace("." + htmlf_path_extension, ".json"));
			if(fs.exists(json_path)) { //check for a .json file to use
				//NOTE THIS IS PROBABLY BROKEN. NEVER TESTED JUST AN IDEA
				process.stdout.write("Found a JSON file for " + json_path + "\n")
				json_data = JSON.parse(fs.readFileSync("html/" + json_path).toString());
			}
			switch(htmlf_filename) { //add any custom JSON data here
				case "walks.mustache":
					json_data = great_walks;
					//process.stdout.write("great_walks: " + JSON.stringify(great_walks) + "\n");
					break;
			}
			html_page = template
				.replace(/{{body}}/, mustache.to_html(htmlf_data, json_data))
				.replace(/{{title}}/, page_title);
			json_data = {};
			break;
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

