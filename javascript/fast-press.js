/* globals window Modernizr Hammer */
/* Simple click wrapper */
(function($){
    var hammer_defaults = {
            prevent_default: true,
            scale_treshold: 0,
            drag_min_distance: 0
        },
        modernizr_touch = Modernizr.touch,
        fastPress_hyperlink = function(event){
            var $this = $(this),
                this_href = $this.attr("href");
            //because #internal links aren't done 'fast' and neither are protocol links e.g. tel: http:// https://
            if(this_href.substr(0, 1) === "#" || this_href.indexOf(":") !== -1) {
                return true;
            }
            window.location = window.location.toString()
                .substr(
                    0,
                    window.location.toString().lastIndexOf("/") + 1) +
                this_href;
        },
        fast_press_init = function(event){
            if(!modernizr_touch) return;
            $("body").on("touchstart", "a", fastPress_hyperlink);
        };
    $.prototype.fastPress = function(callback){
        if(callback === undefined) {
            if(modernizr_touch) {
                return this.trigger('touchstart');
            }
            return this.trigger('click');
        }
        if(modernizr_touch) {
            this.hammer(hammer_defaults).bind('touchstart', callback);
            return this;
        }
        return this.click(callback);
    };
    window.pageload(fast_press_init);
}(jQuery));