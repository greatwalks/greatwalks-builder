/*
 * 
 */ 
(function($){
	"use strict";
	var navbar_init = function(){
		$("#share-social a").click(window.toggle_popover);
	}

	

	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", navbar_init, false);
    } else {
        $(document).ready(navbar_init);
    }
}(jQuery));