(function($){
	"use strict";
	if(window.location.toString().indexOf("index.html") === -1) return;
	var $carousel,
		$carousel_items,
		$navbar_bottom,
		$navbar_top,
		hammer_defaults = {
            prevent_default: true,
            scale_treshold: 0,
            drag_min_distance: 0
		},
		drag_distanceX_threshold = 10,
		drag_distanceX,
		drag_carousel = function(event){
			drag_distanceX = event.distanceX;
		},
		dragend_carousel = function(event){
			if(drag_distanceX === undefined) return;
			if(Math.abs(drag_distanceX) < drag_distanceX_threshold) return;
			if(drag_distanceX > 0) {
				$carousel.carousel('prev');
			} else {
				$carousel.carousel('next');
			}
			drag_distanceX = undefined;
		},
		adjust_carousel_height = function(event){
			var height = $(window).height() - $navbar_top.height() - $navbar_bottom.height() + 2,
				width =  $(window).width() + 1;
			$carousel.height(height);
			$carousel_items.height(height);
		},
	 	index_init = function(event){
			$carousel = $('#carousel').carousel();
			$carousel_items = $carousel.find(".item");
			$navbar_bottom = $(".navbar-fixed-bottom");
			$navbar_top = $(".navbar-fixed-top");
			$(window).bind("resize orientationchange", adjust_carousel_height);
			adjust_carousel_height();
			if(!Modernizr.touch) {
				$carousel.find(".carousel-control").show();
			}
			$carousel_items.hammer(hammer_defaults).bind('drag', drag_carousel);
			$carousel_items.hammer(hammer_defaults).bind('dragend', dragend_carousel);
		}
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", index_init, false);
    } else {
        $(document).ready(index_init);
    }
}(jQuery));