/*global require __dirname */
(function(){
    "use strict";
    var fs = require('fs'),
        path = require('path'),
        approot = path.dirname(__dirname),
        less = require(path.join(approot, "bin/lib/less.js"));
        

    less.what();

}());
//cscript //nologo css\windows-less\lessc.wsf css/bootstrap-css/bootstrap.less ../greatwalks/css/bootstrap.css
//cscript //nologo css\windows-less\lessc.wsf css/bootstrap-css/responsive.less ../greatwalks/css/bootstrap-responsive.css
//cscript //nologo css\windows-less\lessc.wsf css/main.less ../greatwalks/css/main.css
//copy /Y css\normalize.css ..\greatwalks\css\normalize.css