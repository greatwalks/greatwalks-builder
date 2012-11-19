/*global process require __dirname Buffer*/
"use strict"; /* Ignore this JSLint complaint, it's a bit stupid*/

var fs = require('fs'),
    path = require('path'),
    approot = path.dirname(__dirname),
    greatwalks_phonegap_repo = path.join(path.dirname(approot), "greatwalks-phonegap"),
    greatwalks_repo = path.join(path.dirname(approot), "greatwalks"),
    walks_directory = path.join(approot, "walks"),
    walks_paths = fs.readdirSync(walks_directory),
    scale_by = 1, // the build-html.js has a scale_by=0.5 but this has scale_by=1.
                  // The reason for the difference is that build-html.js will display the images at 0.5
                  // but we still want the source images to be large for high DPI displays (e.g. 'retina display')
    ignore_names = ["Thumbs.db", ".DS_Store"],
    copyFileSync = function(srcFile, destFile) {
      //via http://procbits.com/2011/11/15/synchronous-file-copy-in-node-js/
      var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
      BUF_LENGTH = 64 * 1024;
      buff = new Buffer(BUF_LENGTH);
      fdr = fs.openSync(srcFile, 'r');
      fdw = fs.openSync(destFile, 'w');
      bytesRead = 1;
      pos = 0;
      while (bytesRead > 0) {
        bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
        fs.writeSync(fdw, buff, 0, bytesRead);
        pos += bytesRead;
      }
      fs.closeSync(fdr);
      return fs.closeSync(fdw);
    };

(function(){
    fs.mkdir(path.join(greatwalks_repo, "img")); //probably already exists
    fs.mkdir(path.join(greatwalks_repo, "img/walks"));//probably already exists
}());

(function(){
    var icons,
        i,
        icon,
        icon_sanitised_name;
    process.stdout.write("Copying images (ones that don't need processing)\n");
    copyFileSync(path.join(approot, "images/bootstrap-images/glyphicons-halflings.png"), path.join(greatwalks_repo, "img/glyphicons-halflings.png"));
    copyFileSync(path.join(approot, "images/bootstrap-images/glyphicons-halflings-white.png"), path.join(greatwalks_repo, "img/glyphicons-halflings-white.png"));
    copyFileSync(path.join(approot, "images/header-icons.png"), path.join(greatwalks_repo, "img/header-icons.png"));
    copyFileSync(path.join(approot, "images/slideout-menu.png"), path.join(greatwalks_repo, "img/slideout-menu.png"));
    copyFileSync(path.join(approot, "images/social-buttons.png"), path.join(greatwalks_repo, "img/social-buttons.png"));
    copyFileSync(path.join(approot, "images/table.png"), path.join(greatwalks_repo, "img/table.png"));
    copyFileSync(path.join(approot, "images/weta_land.png"), path.join(greatwalks_repo, "img/weta_land.png"));
    copyFileSync(path.join(approot, "images/weta_twitch.png"), path.join(greatwalks_repo, "img/weta_twitch.png"));
    copyFileSync(path.join(approot, "images/youarehere.png"), path.join(greatwalks_repo, "img/youarehere.png"));
    copyFileSync(path.join(approot, "images/camera-placeholder.jpg"), path.join(greatwalks_repo, "img/camera-placeholder.jpg"));
    copyFileSync(path.join(approot, "images/missing-icon.png"), path.join(greatwalks_repo, "img/missing-icon.png"));
    copyFileSync(path.join(approot, "images/homepage-sign.png"), path.join(greatwalks_repo, "img/homepage-sign.png"));
    copyFileSync(path.join(approot, "images/homepage-buttons.png"), path.join(greatwalks_repo, "img/homepage-buttons.png"));
    copyFileSync(path.join(approot, "images/content-buttons.png"), path.join(greatwalks_repo, "img/content-buttons.png"));
    copyFileSync(path.join(approot, "images/walk-icons.png"), path.join(greatwalks_repo, "img/walk-icons.png"));
    icons = fs.readdirSync(path.join(approot, "images/map-icons"));
    for(i = 0; i < icons.length; i++){
        icon = icons[i];
        icon_sanitised_name = icon.toLowerCase().replace(/ /g, "-");
        if(ignore_names.indexOf(icon) !== -1) continue;
        copyFileSync(path.join(approot, "images/map-icons", icon), path.join(greatwalks_repo, "img/icon-map-" + icon_sanitised_name));
    }
    icons = fs.readdirSync(path.join(approot, "images/content-icons"));
    for(i = 0; i < icons.length; i++){
        icon = icons[i];
        icon_sanitised_name = icon.toLowerCase().replace(/ /g, "-");
        if(ignore_names.indexOf(icon) !== -1) continue;
        copyFileSync(path.join(approot, "images/content-icons", icon), path.join(greatwalks_repo, "img/icon-content-" + icon_sanitised_name));
    }
    process.stdout.write(" - Complete.\n");
}());

(function () {
    var svg_source;
    process.stdout.write("Generating Phonegap Android icons\n");
    svg_source = path.join(approot, "images/great-walks-icon.svg");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=" + path.join(greatwalks_phonegap_repo, "res/drawable-hdpi/ic_launcher.png") + " --export-width=72");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=" + path.join(greatwalks_phonegap_repo, "res/drawable-ldpi/ic_launcher.png") + " --export-width=36");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=" + path.join(greatwalks_phonegap_repo, "drawable-mdpi/ic_launcher.png") + " --export-width=48");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=" + path.join(greatwalks_phonegap_repo, "drawable-xhdpi/ic_launcher.png") + " --export-width=96");
    process.stdout.write(" - Complete.\n");
    process.stdout.write("Generating logos\n");
    svg_source = path.join(approot, "images/great-walks-logo.svg");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=\"" + path.join(greatwalks_repo, "img/logo-x150.png") + "\" --export-width=150");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=\"" + path.join(greatwalks_repo, "img/logo-x225.png") + "\" --export-width=225");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=\"" + path.join(greatwalks_repo, "img/logo-x300.png") + "\" --export-width=300");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=\"" + path.join(greatwalks_repo, "img/logo-x600.png") + "\" --export-width=600");
    execSync("inkscape \"" + svg_source + "\" -z --export-png=\"" + path.join(greatwalks_repo, "img/logo-x1200.png") + "\" --export-width=1200");
    process.stdout.write(" - Complete.\n");
}());

(function(){
    var carousel_images_path = path.join(approot, "images/homepage-carousel"),
        carousel_images = fs.readdirSync(carousel_images_path),
        carousel_image,
        carousel_image_path,
        carousel_destination_path,
        i,
        resize_command,
        dimensions = [1024, 2048],
        y,
        dimension,
        sanitised_name;
    process.stdout.write("Generating carousel\n - Processing");
    for(i = 0; i < carousel_images.length; i++) {
        carousel_image = carousel_images[i];
        sanitised_name = carousel_image.toLowerCase().replace(/ /g, "-");
        carousel_image_path = path.join(approot, "images/homepage-carousel", carousel_image);
        for(y = 0; y < dimensions.length; y++) {
            dimension = dimensions[y];
            carousel_destination_path = path.join(greatwalks_repo, "img/homepage-carousel-x" + dimension + "-" + sanitised_name);
            resize_command = "convert \"" + carousel_image_path + "\" -resize " + dimension + "x \"" + carousel_destination_path + "\"";
            process.stdout.write("..");

            execSync(resize_command);
        }
    }
    process.stdout.write("complete. Carousel images resized.\n");
}());

(function(){
    process.stdout.write("Generating maps\n");
    for(var i = 0; i < walks_paths.length; i++){
        var walk_name = walks_paths[i],
            walk_sanitised_name = walk_name.toLowerCase().replace(/ /g, "-"),
            walk_fullpath = path.join(walks_directory, walk_name),
            map_path = path.join(approot, "walks", walk_name, "map.png"),
            national_path = path.join(approot, "walks", walk_name, "national.gif"),
            national_destination_path = path.join(greatwalks_repo, "img/walks", walk_sanitised_name, "national.gif"),
            width = 0,
            height = 0,
            command = "identify -format {\\\"width\\\":%w,\\\"height\\\":%h} \"" + map_path + "\"",
            map_dimensions_json_string,
            map_dimensions_json,
            resize_command;
        if(fs.statSync(walk_fullpath).isDirectory()) {
            fs.mkdir(path.join(greatwalks_repo, "img/walks", walk_sanitised_name)); //probably already exists
            process.stdout.write(" - Generating " + walk_name + " map ");
            map_dimensions_json_string = execSync(command);
            if(map_dimensions_json_string.toString().indexOf("{\"width") >= 0) {
                map_dimensions_json = JSON.parse(map_dimensions_json_string);
                process.stdout.write("(source parsed ");
                width = parseInt(map_dimensions_json.width * scale_by, 10);
                height = parseInt(map_dimensions_json.height * scale_by, 10);
                resize_command = "convert \"" + map_path + "\" -resize " + width + "x" + height + " \"" + path.join(greatwalks_repo, "img/walks", walk_sanitised_name, "map.jpg") + "\"";
                execSync(resize_command);
                process.stdout.write("and resized)");
            } else {
                process.stdout.write("ERROR parsing image dimensions. Command I tried to run was \n" + command + "\nIs ImageMagick installed?\n");
            }
            copyFileSync(national_path, national_destination_path);
            process.stdout.write(".\n");
        } else {
            //process.stdout.write("Not a directory " + walk_fullpath + "\n");
        }
    }
}());

function execSync(cmd) {
    // nodeJS doesn't have a synchronous exec e.g. execSync()
    // full credit (and blame!) for this function goes to
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
}
