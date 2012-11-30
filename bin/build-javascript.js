/*global process require __dirname Buffer*/
"use strict"; /* Ignore this JSLint complaint, it's a bit stupid*/
var fs = require('fs'),
    path = require('path'),
    approot = path.dirname(__dirname),
    greatwalks_repo = path.join(path.dirname(approot), "greatwalks"),
    // Twitter Bootstrap JavaScript needs to be aggregated in a particular order to be valid
    bootstrap_javascripts = ['bootstrap-transition.js', 'bootstrap-alert.js',
        'bootstrap-modal.js', 'bootstrap-dropdown.js', 'bootstrap-scrollspy.js',
        'bootstrap-tab.js', 'bootstrap-tooltip.js', 'bootstrap-popover.js',
        'bootstrap-button.js', 'bootstrap-collapse.js', 'bootstrap-carousel.js',
        'bootstrap-typeahead.js', 'bootstrap-affix.js'],
    bootstrap_javascript_path,
    app_javascripts = fs.readdirSync(path.join(approot, "javascript")),
    app_javascript_path,
    vendor_javascripts = fs.readdirSync(path.join(approot, "javascript/vendor")),
    vendor_javascript_path,
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
    },
    file_handle,
    i;

process.stdout.write("Generating JavaScript\n");

(function(){
    fs.mkdir(path.join(greatwalks_repo, "js")); //probably already exists
    fs.mkdir(path.join(greatwalks_repo, "js/vendor"));//probably already exists
}());

(function(){
  // copy over the Phonegap vendor JavaScript
  copyFileSync(path.join(approot, "javascript/cordova/android.js"), path.join(greatwalks_repo, "cordova.js"));
  //Copy over a NodeJS web server (used only for debug purposes)
  copyFileSync(path.join(approot, "javascript/debug-web-server/web.js"), path.join(greatwalks_repo, "web.js"));
  for(i = 0; i < vendor_javascripts.length; i++){
      vendor_javascript_path = path.join(approot, "javascript/vendor", vendor_javascripts[i]);
      if(ignore_names.indexOf(vendor_javascript_path) !== -1) continue;
      copyFileSync(vendor_javascript_path, path.join(greatwalks_repo, "js/vendor", vendor_javascripts[i]));
  }
  process.stdout.write(" - Copied static files\n");
}());

(function(){
  // Agregate Bootstrap JavaScript
  var bootstrap_path = path.join(greatwalks_repo, "js/vendor/bootstrap.js");
  var indicator_of_standard_bootstrap_js_without_greatwalks_modifications = "insertAfter(this.$element)";
  file_handle = fs.openSync(bootstrap_path, 'w');
  fs.writeSync(file_handle, "/*This file is built from source files. Please do not edit this file directly*/\n\n\n");
  for(i = 0; i < bootstrap_javascripts.length; i++){
      bootstrap_javascript_path = path.join(approot, "javascript/bootstrap-javascript", bootstrap_javascripts[i]);
      if(ignore_names.indexOf(bootstrap_javascript_path) !== -1) continue;
      fs.writeSync(file_handle, fs.readFileSync(bootstrap_javascript_path, 'utf8').toString());
  }
  fs.closeSync(file_handle);
  if(fs.readFileSync(bootstrap_path).toString().indexOf(indicator_of_standard_bootstrap_js_without_greatwalks_modifications) !== -1) {
    throw "ERROR - Looks like you're running a newer version of Bootstrap's JavaScript without the necessary modifications which break tooltips (particularly on map pages). Find this line in build-javascript.js for the changes that you'll need to make.";
    /*

      In javascript/bootstrap-javascript/bootstrap-tooltip.js replace

      $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })
          .insertAfter(this.$element)

      With,

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })
          .insertAfter($("body"))

      AND if you get an exception when clicking a popover about
      'cannot read currentTarget of undefined' then replace,

        toggle: function (e) {
          var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      With,
      
        toggle: function (e) {
          var self = (e) ? $(e.currentTarget)[this.type](this._options).data(this.type) : this

    */
  }
  
  process.stdout.write(" - Aggregated Bootstrap JavaScript\n");
}());

(function(){
  // Agregate App JavaScript
  file_handle = fs.openSync(path.join(greatwalks_repo, "js/app.js"), 'w');
  fs.writeSync(file_handle, "/*This file is built from source files. Please do not edit this file directly*/\n\n\n");
  app_javascripts.sort(function(a, b){ //we want pageload.js to be the first item
    if (a === "pageload.js") return -1;
    if (b === "pageload.js") return 1;
    return 0;
  });
  for(i = 0; i < app_javascripts.length; i++){
      app_javascript_path = path.join(approot, "javascript", app_javascripts[i]);
      if(ignore_names.indexOf(app_javascript_path) !== -1) continue;
      if(!fs.statSync(app_javascript_path).isDirectory()) {
          fs.writeSync(file_handle, "/* BEGINNING OF " + path.basename(app_javascript_path) + " */\n" + fs.readFileSync(app_javascript_path, 'utf8').toString() + "/* END OF " + path.basename(app_javascript_path) + " */\n\n");
      }
  }
  fs.closeSync(file_handle);
  process.stdout.write(" - Aggregated application JavaScript\n");
}());

process.stdout.write("Success\n\n");
