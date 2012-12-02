/* globals window Modernizr Hammer */
/* Simple click wrapper */
(function($){
    var hammer_defaults = {
            prevent_default: true,
            scale_treshold: 0,
            drag_min_distance: 0
        },
        modernizr_touch = Modernizr.touch;
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
}(jQuery));