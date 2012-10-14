var fs = require('fs');
var path = require('path');
var mustache = require("./mustache.js");

template = fs.readFileSync("html/template.html").toString().replace(/<!--.*?-->/g, "");
htmlf_paths = fs.readdirSync("html");

for(var i = 0; i < htmlf_paths.length; i++){
	var htmlf_path = htmlf_paths[i],
		htmlf_data = fs.readFileSync("html/" + htmlf_path).toString(),
		html_page,
		htmlf_path_extension = htmlf_path.substr(htmlf_path.lastIndexOf(".") + 1),
		new_path = path.resolve("../greatwalks/" + htmlf_path.replace("." + htmlf_path_extension, ".html"));

	switch(htmlf_path_extension){
		case "htmlf": //straight copy
			html_page = template
				.replace(/{{body}}/, htmlf_data)
				.replace(/{{title}}/, htmlf_path);
			break;
		case "mustache": //mustache template - see http://mustache.github.com/
			var json_data = {},
				json_path = path.resolve("../greatwalks/" + htmlf_path.replace("." + htmlf_path_extension, ".json"));
			if(fs.exists(json_path)) { //check for a .json file to use
				json_data = JSON.parse(fs.readFileSync("html/" + json_path).toString());
				process.stdout.write("what");
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
	if(html_page !== null) {
		process.stdout.write("Building: " + htmlf_path + " to " + new_path + "\n");
		fs.writeFileSync(new_path, html_page);
	}
	html_page = null;
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};