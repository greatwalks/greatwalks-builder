/* globals window Modernizr Hammer */
/* Simple click wrapper */
(function($){
    window.pageload = function(callback, pathname_prefix){
        if(pathname_prefix && window.location.pathname.toString().substr(0, pathname_prefix.length) !== pathname_prefix) return;
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", callback, false);
        } else {
            $(document).ready(callback);
        }
    };
}(jQuery));