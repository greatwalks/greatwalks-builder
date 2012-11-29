/*global navigator document*/
(function($){
    "use strict";
    var modal_init = function(event){
        $(".modal").appendTo("body");
    };
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", modal_init, false);
    } else {
        $(document).ready(modal_init);
    }
}(jQuery));