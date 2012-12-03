/*globals window map_details */
/* ===========================================================
 * map.js v1
 * Developed at Department of Conservation by Matthew Holloway
 * <matth@catalyst.net.nz>
 * -----------------------------------------------------------
 *
 * Provides maps with pinchzoom, drag scrolling etc with popups.
 *
 * ========================================================== */
(function($){
    "use strict";
    
    var drag_offset = {base_x:0,base_y:0,x:0,y:0},
        map__zoom_init = function(event){
            //based on code from http://eightmedia.github.com/hammer.js/zoom/index2.html
            var $window = $(window),
                window_width = $window.width(),
                window_height = $window.height(),
                $image = $("#map"),
                $youarehere_offmap = $("#youarehere").find(".offmap"),
                hammer,
                height,
                offset,
                screenOffset,
                origin,
                prevScale,
                scale = map_details.map_initial_scale,
                translate,
                width,
                screenOrigin,
                touch_position = {width:undefined, height: undefined},
                $locations = $(".location"),
                redraw = function(){
                    var map_transform,
                        icon_scale,
                        css;
                    if(scale < 0.1) {
                        scale = 0.1;
                    } else if(scale > 3) {
                        scale = 3;
                    }
                    map_transform = 'translate3d(' + drag_offset.x + 'px, ' + drag_offset.y + 'px, 0) scale3d(' + scale + ', ' + scale + ', 1)';
                    css = {'-webkit-transform': map_transform};

                    //if(touch_position.cssOrigin) {
                    //    css['-webkit-transform-origin'] = touch_position.cssOrigin;
                    //    console.log(touch_position.cssOrigin)
                    //}
                    $image.css(css);

                    // Want to scale icons independently of the map? Enable this.
                    // icon_scale = (1 / scale) * 30;
                    // if(icon_scale > 50) {
                    //    icon_scale = 50;
                    // }
                    //$locations.width(icon_scale).height(icon_scale);
                    //$youarehere_offmap.css("fontSize", (icon_scale / 2) + "px");
                    window.hide_all_popovers();
                },
                no_touch_zoom_init = function(){
                    var $no_touch_zoom = $("#no-touch-zoom"),
                        $zoom_out = $no_touch_zoom.find("a.zoom-out"),
                        $zoom_in = $no_touch_zoom.find("a.zoom-in");
                    $zoom_out.click(function(event){
                        scale -= 0.1;
                        redraw();
                    });
                    $zoom_in.click(function(event){
                        scale += 0.1;
                        redraw();
                    });
                    $("#no-touch-zoom").show();
                };

            if(window.Modernizr && !window.Modernizr.touch) {
                no_touch_zoom_init();
            }

            offset = $image.offset();

            $image.css({
                "left": ((-map_details.map_pixel_width / 2) + (window_width / 2)) + "px",
                "top": ((-map_details.map_pixel_height / 2) + ($window.height() / 2) - $("#logo").height() ) + "px"
            });

            scale = (window_width - 50) / map_details.map_pixel_width; //ensure that the map is sized for the device width...
            if(scale * map_details.map_pixel_height > window_height) { //..unless that's still too high, in which case scale for height
                scale = (window_height - 50) / map_details.map_pixel_height;
            }

            redraw();

            $image.show();

            width = $image.width();
            height = $image.height();
            
            screenOrigin = {
                x: 0,
                y: 0
            };
            origin = {
                x: 0,
                y: 0
            };
            translate = {
                x: 0,
                y: 0
            };
            screenOffset = {
                x: 0,
                y: 0
            };

            prevScale = scale;

            hammer = $image.hammer({
                prevent_default: true,
                scale_treshold: 0,
                drag_min_distance: 0
            });

            hammer.bind('dragend', function(event) {
                drag_offset.base_x = drag_offset.x;
                drag_offset.base_y = drag_offset.y;
                redraw();
            });

            hammer.bind('drag', function(event) {
                drag_offset.x = drag_offset.base_x + event.distanceX;
                drag_offset.y = drag_offset.base_y + event.distanceY;
                //$image.css('-webkit-transform', 'translate3d(' + drag_offset.x + 'px, ' + drag_offset.y + 'px, 0) scale3d(' + scale + ', ' + scale + ', 1)');
                redraw();
            });

            hammer.bind('transformstart', function(event) {
                screenOrigin.x = (event.originalEvent.touches[0].clientX + event.originalEvent.touches[1].clientX) / 2;
                return screenOrigin.y = (event.originalEvent.touches[0].clientY + event.originalEvent.touches[1].clientY) / 2;
            });

            hammer.bind('transform', function(event) {
                var newHeight,
                    newWidth;
                    //offset = $image.offset();
                scale = prevScale * event.scale;
                

                //touch_position.width = event.position.width / scale;
                //touch_position.height = event.position.height / scale;
                //touch_position.cssOrigin = event.position.x + "px " + event.position.y +"px";

                newWidth = $image.width() * scale;
                newHeight = $image.height() * scale;

                origin.x = screenOrigin.x - offset.left - translate.x;
                origin.y = screenOrigin.y - offset.top - translate.y;

                translate.x += -origin.x * (newWidth - width) / newWidth;
                translate.y += -origin.y * (newHeight - height) / newHeight;

                //$image.css('-webkit-transform', "translate3d(" + drag_offset.x + "px, " + drag_offset.y + "px, 0) scale3d(" + scale + ", " + scale + ", 1)");
                redraw();
                width = newWidth;

                return height = newHeight;/*IGNORE JSLINT*/ /*UNFORTUNATELY JSLINT DOESN'T CURRENTLY ALLOW IGNORE ON LINES OF CODE (I THINK)*/
            });

            hammer.bind('transformend', function(event) {
                return prevScale = scale;/*IGNORE JSLINT*/ /*UNFORTUNATELY JSLINT DOESN'T CURRENTLY ALLOW IGNORE ON LINES OF CODE (I THINK)*/
            });
        };

    window.pageload(map__zoom_init, "/map-");
}(jQuery));