/*global navigator document */
(function($){
    "use strict";
    var walk_init = function(){
        $(".walk-detail-header").click(function(){
            $(this).toggleClass("open").next(".walk-detail").slideToggle();
        });
        $(".dont-miss").click();
        $("a.icon").click(window.toggle_popover);
    };

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", walk_init, false);
    } else {
        $(document).ready(walk_init);
    }
}(jQuery));