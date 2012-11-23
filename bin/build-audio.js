/*global process require __dirname Buffer*/
"use strict"; /* Ignore this JSLint complaint, it's a bit stupid*/
var fs = require('fs'),
    path = require('path'),
    approot = path.dirname(__dirname),
    greatwalks_repo = path.join(path.dirname(approot), "greatwalks"),
    audio_files = fs.readdirSync(path.join(approot, "audio")),
    audio_file,
    audio_path,
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
    i;

process.stdout.write("Generating Audio\n");

(function(){
    fs.mkdir(path.join(greatwalks_repo, "audio")); //probably already exists
}());

(function(){
  for(i = 0; i < audio_files.length; i++){
      audio_file = audio_files[i];
      audio_path = path.join(approot, "audio", audio_file);
      if(ignore_names.indexOf(audio_file) !== -1) continue;
      if(!fs.statSync(audio_path).isDirectory()) {
        copyFileSync(audio_path, path.join(greatwalks_repo, "audio/speech-" + audio_file));
      }
  }
  process.stdout.write(" - Copied static files\n");
}());

process.stdout.write("Success\n\n");
