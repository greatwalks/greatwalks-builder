/* globals window Modernizr Hammer */
/* Simple click wrapper */
(function($){
    window.pageload = function(callback, pathname_contains){
        if(pathname_contains && window.location.pathname.indexOf(pathname_contains) === -1 ) return;
        if (window.Media && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", callback, false);
        } else {
            $(document).ready(callback);
        }
    };
}(jQuery));