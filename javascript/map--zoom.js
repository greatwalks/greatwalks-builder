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
    if(window.location.pathname.toString().indexOf("map-") === -1) return;
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
                $locations = $(".location"),
                redraw = function(){
                    var map_css,
                        icon_scale;
                    if(scale < 0.1) {
                        scale = 0.1;
                    } else if(scale > 3) {
                        scale = 3;
                    }
                    icon_scale = (1 / scale) * 30;
                    if(icon_scale > 50) {
                        icon_scale = 50;
                    }
                    map_css = 'translate3d(' + drag_offset.x + 'px, ' + drag_offset.y + 'px, 0) scale3d(' + scale + ', ' + scale + ', 1)';
                    $image.css('-webkit-transform', map_css);
                    $locations.width(icon_scale).height(icon_scale);
                    $youarehere_offmap.css("fontSize", (icon_scale / 2) + "px");
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

            prevScale = 1;

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
                var newHeight, newWidth;
                scale = prevScale * event.scale;

               

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

    window.centerMap = function(x, y){
            return;
            var $map = $("#map"),
                $window = $(window),
                window_width = $window.width(),
                window_height = $window.height(),
                map_offset = $map.offset(),
                map_css;
            if(x === undefined && y === undefined) { //if no coordinates are given then center on middle of map
                x = -(map_offset.left + (map_details.map_pixel_width / 2) - (window_width / 2));
                y = -(map_offset.top + (map_details.map_pixel_height / 2) - (window_height / 2));
                
            }
            if(x > 0 && x < window_width / 2) {
                x = -map_offset.left;
            } else if(x > window_width / 2 && x < map_details.map_pixel_width - (window_width / 2)) {
                x = -map_offset.left - (x / 2);
            } else {
                x =  -map_details.map_pixel_width + window_width;
                
            }

            if(y > 0 && y < window_height / 2) {
                y = 0;
            } else if(y > window_height / 2 && y < map_details.map_pixel_height - (window_height / 2)) {
                y = -map_offset.top - (y / 2);
            } else {
                y = -map_offset.top - map_details.map_pixel_height + window_height;
            }
            
            map_css = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
            $map.css('-webkit-transform', map_css);
            drag_offset.base_x = x;
            drag_offset.base_y = y;
        };
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", map__zoom_init, false);
    } else {
        $(document).ready(map__zoom_init);
    }
}(jQuery));