var fs = require('fs');
var path = require('path');

var	walks_paths = fs.readdirSync("walks");

for(var i = 0; i < walks_paths.length; i++){
	var walk_name = walks_paths[i],
		walk_sanitised_name = walk_name.toLowerCase().replace(/ /g, "-"),
        walk_fullpath = path.resolve("walks/" + walk_name),
        map_path = path.join("walks", walk_name, "map.png"),
        map_fullpath = path.resolve(map_path),
		width = 0,
		height = 0;

	var map_dimensions_json_string = execSync("imdim \"{\\\"width\\\":%w, \\\"height\\\":%h}\" \"" + map_fullpath + "\"");

	if(map_dimensions_json_string.indexOf("{\"width") >= 0) {
		var map_dimensions_json = JSON.parse(map_dimensions_json_string);
		width = map_dimensions_json.width;
		height = map_dimensions_json.height;
	}

    var exec  = require('child_process').exec;

    var resize_command = "resize -i\"walks\\" + walk_name + "\\map.png\" -o\"..\\greatwalks\\img\\walks\\" + walk_sanitised_name + "\\map.jpg\" -s" + width + "x" + height;
    process.stdout.write(resize_command + "\n");

    exec(resize_command);
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
