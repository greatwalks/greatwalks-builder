var fs = require('fs');
var path = require('path');
var mustache = require("./mustache.js");

var template = fs.readFileSync("html/template.html").toString(),
	htmlf_paths = fs.readdirSync("html"),
	include_directory = path.join(path.resolve("html"), "includes");

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

walks_paths = fs.readdirSync("walks");
walks_template_path = path.resolve("walks/template.mustache");
great_walks = [];

//fs.readFileSync("walks/template.mustache").toString();

for(var i = 0; i < walks_paths.length; i++){
	var walk_name = walks_paths[i],
		walk_sanitised_name = walk_name.toLowerCase().replace(/ /g, "-"),
		walk_fullpath = path.resolve("walks/" + walk_name),
		map_path = path.join("walks", walk_name, "map.png"),
		map_fullpath = path.resolve(map_path),
		locations_path = path.join(walk_fullpath, "locations.csv"),
		tfw_path = path.join(walk_fullpath, "map.tfw"),
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

		map_dimensions_json_string = execSync("imdim \"{\\\"width\\\":%w, \\\"height\\\":%h}\" \"" + map_fullpath + "\"");
		if(map_dimensions_json_string.indexOf("{\"width") >= 0) {
			var map_dimensions_json = JSON.parse(map_dimensions_json_string);
			mustache_data.map_pixel_width = map_dimensions_json.width;
			mustache_data.map_pixel_height = map_dimensions_json.height;
		} else {
			//process.stdout.write(map_dimensions_json_string);
		}
		html_page = process_page(walks_template_path, walk_name, mustache_data);
	}

	if(html_page !== undefined) {
		new_filename = "walk-" + walk_sanitised_name + ".html";
		new_path = path.resolve("../greatwalks/" + new_filename);
		great_walks.push({"id": walk_sanitised_name, "name": walk_name, "filename":new_filename})
		fs.writeFileSync(new_path, html_page);
		process.stdout.write("Building: " + new_filename + "\n");
	}

	html_page = undefined;
}

function process_page(htmlf_path, page_title, mustache_data){
	var htmlf_data = fs.readFileSync(htmlf_path).toString(),
		htmlf_path_extension = htmlf_path.substr(htmlf_path.lastIndexOf(".") + 1),
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
				json_path = path.resolve("../greatwalks/" + htmlf_path.replace("." + htmlf_path_extension, ".json"));
			if(fs.exists(json_path)) { //check for a .json file to use
				json_data = JSON.parse(fs.readFileSync("html/" + json_path).toString());

			}
			switch(htmlf_path) { //add any custom JSON data here
				case "walks.mustache":
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

function execSync(cmd) {
	// nodeJS doesn't have a synchronous exec.
	// full credit for this function goes to http://stackoverflow.com/questions/4443597/node-js-execute-system-command-synchronously/9051718#9051718
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

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};