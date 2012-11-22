/*global navigator document alert console */
(function($){
    "use strict";
    var walk_init = function(){
        var $dont_miss = $(".dont-miss"),
            $shadow = $dont_miss.find(".shadow"),
            is_shadowed = false,
            $current_dont_miss,
            disable_all_dont_miss = function(event){
                is_shadowed = false;
                if($current_dont_miss !== undefined) {
                    $current_dont_miss.css("z-index", "auto");
                    window.hide_all_popovers.apply($current_dont_miss);
                    $current_dont_miss = undefined;
                }
                $shadow.removeClass("shadow-visible");
            },
            $html = $("html").bind("popover-click", disable_all_dont_miss);


        $(".walk-detail-header").click(function(){
            $(this).toggleClass("open").next(".walk-detail").slideToggle();
        });
        $(".dont-miss").click();
        $("a.icon").click(window.toggle_popover);

        $dont_miss.find("a").click(function(){
            var $this = $(this);
            if(is_shadowed) {
                disable_all_dont_miss();
            } else {
                $current_dont_miss = $this;
                $current_dont_miss.css("z-index", "3");
                $shadow.addClass("shadow-visible");
                is_shadowed = true;
                window.show_popover.apply($current_dont_miss);
            }
            return false;
        });

        $shadow.click(disable_all_dont_miss);
    };

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", walk_init, false);
    } else {
        $(document).ready(walk_init);
    }
}(jQuery));