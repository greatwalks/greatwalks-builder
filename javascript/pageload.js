/* globals window Modernizr Hammer */
/* Simple click wrapper */
(function($){
    window.pageload = function(callback, pathname_contains){
        if(pathname_prefix && window.location.pathname.indexOf(pathname_prefix) === -1 ) return;
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", callback, false);
        } else {
            $(document).ready(callback);
        }
    };
}(jQuery));