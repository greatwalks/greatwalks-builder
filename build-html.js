var fs = require('fs');
var path = require('path');
var mustache = require("./mustache.js");

template = fs.readFileSync("html/template.html").toString();
htmlf_paths = fs.readdirSync("html");

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

function process_page(htmlf_path){
	var htmlf_data = fs.readFileSync(htmlf_path).toString(),
		htmlf_path_extension = htmlf_path.substr(htmlf_path.lastIndexOf(".") + 1),
		html_page,
		include_directory = path.join(path.dirname(htmlf_path), "includes");

	htmlf_data = htmlf_data.replace(/<\!--#include(.*?)-->/g,
				function(match, contents, offset, s){
					var include_filename = contents.substr(contents.indexOf("=\"")+2),
						include_path;
					include_filename = include_filename.substr(0, include_filename.indexOf("\""));
					include_path = path.join(include_directory, include_filename);
					process.stdout.write(" -- including : " + include_path + "\n");
					return fs.readFileSync(include_path).toString();
				});

	switch(htmlf_path_extension){
		case "htmlf": //straight copy
			html_page = template
				.replace(/{{body}}/, htmlf_data)
				.replace(/{{title}}/, htmlf_path);
			break;
		case "mustache": //mustache template - see http://mustache.github.com/
			var json_data = {}
,				json_path = path.resolve("../greatwalks/" + htmlf_path.replace("." + htmlf_path_extension, ".json"));
			if(fs.exists(json_path)) { //check for a .json file to use
				json_data = JSON.parse(fs.readFileSync("html/" + json_path).toString());

			}
			switch(htmlf_path) { //add any custom JSON data here
				case "walks.mustache":
					break;
			}
			html_page = template
				.replace(/{{body}}/, mustache.to_html(htmlf_data, json_data))
				.replace(/{{title}}/, htmlf_path);
			json_data = {};
			break;
	}
	return html_page;
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};