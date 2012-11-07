/*
 * Handles the navbars (including the bottom one, if it's there)
 */ 
(function($){
	"use strict";
	var navbar_init = function(){
		var $navbar_social = $("#share-social a"),
			navbar_timer,
			hide_social_popout = function(event){
				window.hide_popover.bind($navbar_social)(event);
			};
		$navbar_social.click(function(event){
			if(navbar_timer !== undefined) {
				clearTimeout(navbar_timer);
				navbar_timer = undefined;
			}
			window.toggle_popover.bind($navbar_social)(event);
		});
		$(window).scroll(function(){
			if(navbar_timer !== undefined) {
				window.clearTimeout(navbar_timer);
				navbar_timer = undefined;
			}
			navbar_timer = window.setTimeout(hide_social_popout, 100);
		});
	}

	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", navbar_init, false);
    } else {
        $(document).ready(navbar_init);
    }
}(jQuery));