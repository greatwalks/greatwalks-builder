(function($){
    "use strict";
    var make_blank = function() {
        if ( navigator.userAgent.match(/iphone|ipad|ipod/i) ) {
            $('ul.banners li a').attr('target', "_blank");
        }
    }

    window.pageload(make_blank, '/offers');
}(jQuery));
