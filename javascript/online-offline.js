(function($){
	"use strict";

	var going_online = function(){
		$("#share-social").show();
	},
	going_offline = function(){
		$("#share-social").hide();
	}

	document.addEventListener("online", going_online, false);
	document.addEventListener("offline", going_offline, false);
}(jQuery));