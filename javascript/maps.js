(function($){
    "use strict";
    if(window.location.pathname.toString().indexOf("maps.html") === -1) return;
    var $wrapper,
        $navbar_top,
        $window,
        adjust_maps_height = function(event){
            var height = $window.height() - $navbar_top.height();
            if(height > 0) {
                $wrapper.height(height);
            }
        },
        maps_init = function(event){
            $wrapper = $("#wrapper");
            $navbar_top = $(".navbar-fixed-top");
            $window = $(window);
            $(window).bind("resize orientationchange", adjust_maps_height).resize();
        };

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", maps_init, false);
    } else {
        $(document).ready(maps_init);
    }
}(jQuery));

