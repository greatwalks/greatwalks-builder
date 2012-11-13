/*global require process*/
var fs = require('fs');
var path = require('path');
var walks_paths = fs.readdirSync("walks");
var scale_by = 1; // the build-html.js has a scale_by=0.5 but this has scale_by=1.
                  // The reason for the difference is that build-html.js will display the images at 0.5
                  // but we still want the source images to be large for high DPI displays (e.g. 'retina display')

(function () {
  "use strict";
    fs.copy = function (src, dst) {
        //process.stdout.write("Copied " + dst);
        execSync('copy /b "' + src + '" "' + dst + '"');
        //process.stdout.write("...done\n");
    };
}());

for(var i = 0; i < walks_paths.length; i++){
    var walk_name = walks_paths[i],
        walk_sanitised_name = walk_name.toLowerCase().replace(/ /g, "-"),
        walk_fullpath = path.resolve("walks/" + walk_name),
        map_path = path.join("walks", walk_name, "map.png"),
        national_path = path.join("walks", walk_name, "national.gif"),
        national_destination_path = path.resolve(path.join("../greatwalks/img/walks", walk_sanitised_name, "national.gif")),
        map_fullpath = path.resolve(map_path),
        width = 0,
        height = 0,
        command = "imdim \"{\\\"width\\\":%w, \\\"height\\\":%h}\" \"" + map_fullpath + "\"",
        map_dimensions_json_string,
        map_dimensions_json,
        resize_command;
    
    if(fs.statSync(walk_fullpath).isDirectory()) {
        map_dimensions_json_string = execSync(command);
        if(map_dimensions_json_string.indexOf("{\"width") >= 0) {
            map_dimensions_json = JSON.parse(map_dimensions_json_string);
            width = parseInt(map_dimensions_json.width * scale_by, 10);
            height = parseInt(map_dimensions_json.height * scale_by, 10);
            resize_command = "resize -i\"walks\\" + walk_name + "\\map.png\" -o\"..\\greatwalks\\img\\walks\\" + walk_sanitised_name + "\\map.jpg\" -s" + width + "x" + height;
            execSync(resize_command);
        } else {

        }
        fs.copy(national_path, national_destination_path);
        process.stdout.write("Finished " + walk_sanitised_name + "\n");
    } else {
        //process.stdout.write("Not a directory " + walk_fullpath + "\n");
    }
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
} /* JSLINT IGNORE */ /* JSLINT DOESN'T HAVE AN IGNORE FEATURE (I THINK) */
