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
			return false;
		});
		$(window).scroll(function(){
			if(navbar_timer !== undefined) {
				window.clearTimeout(navbar_timer);
				navbar_timer = undefined;
			}
			navbar_timer = window.setTimeout(hide_social_popout, 100);
		});
		$("#show_slideout_navigation").change(function(event){
			// When on a very small screen AND when the slideout navigation is exposed hide the logo because it will mess up the display
			var $this = $(this),
				$logo;
			if($(window).height() > 400 && $(window).width() > 400) return;
			$logo = $("#logo");
			if($this.is(":checked")) {
				$logo.hide();
			} else {
				$logo.show();
			}
			
			
		});
	};

    window.pageload(navbar_init);
}(jQuery));