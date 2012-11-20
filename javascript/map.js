/*globals map_details difference_between_positions_in_kilometers format_distance geolocation position_expires_after_milliseconds Modernizr Camera alert*/
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
    (function(){
        var PIx = 3.141592653589793,
            degrees_to_radians = function(degrees) {
                return degrees * PIx / 180;
            },
            kilometres_to_miles = 0.621371,
            one_hour_in_milliseconds = 60 * 60 * 1000;

        window.format_distance = function(kilometres){
             return (Math.round(kilometres * 100) / 100) + "km / " + (Math.round(kilometres * kilometres_to_miles * 100) / 100) + "mi";
        };

        window.difference_between_positions_in_kilometers = function(lat1, lon1, lat2, lon2, lat3, lon3){
            if(lat3 !== undefined && lon3 !== undefined) {
                //normally lat3/lon3 aren't given and this function just figures out the distance
                // between two points.
                // however if lat3/lon3 are given then this function finds out the distance between
                // a point and the closest side of a square (e.g. a map graphic).
                if(lat1 < lat3) {
                    lat2 = lat3;
                }
                if(lon1 > lon3) {
                    lon2 = lon3;
                }
            }
            // courtesy of http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points/27943#27943
            var R = 6371; // adverage radius of the earth in km
            var dLat = degrees_to_radians(lat2-lat1);  // Javascript functions in radians
            var dLon = degrees_to_radians(lon2-lon1);
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(degrees_to_radians(lat1)) * Math.cos(degrees_to_radians(lat2)) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c; // Distance in km
        };

        window.position_expires_after_milliseconds = one_hour_in_milliseconds;
    }());

    var map_start = function(){
        if(window.map_details === undefined) { //are we on a map page? If not, there's nothing to do so just return
            return;
        }
        var centered_once_upon_load = false,
            open_tooltip,
            last_known_position = localStorage["geolocation-last-known-position"],
            one_second_in_milliseconds = 1000,
            geolocationSettings = {
                maximumAge:600000,
                enableHighAccuracy: true,
                timeout: one_second_in_milliseconds * 15
            },
            drag_offset = {base_x:0,base_y:0,x:0,y:0},
            pixels_to_longitude_latitude = function(map_x, map_y){
                return {
                    longitude: map_details.longitude + (map_x / map_details.degrees_per_pixel),
                    latitude: map_details.latitude + (map_y / map_details.degrees_per_pixel)
                };
            },
            geolocationSuccess = function(position){
                /*
                Latitude:          position.coords.latitude
                Longitude:         position.coords.longitude
                Altitude:          position.coords.altitude
                Accuracy:          position.coords.accuracy
                Altitude Accuracy: position.coords.altitudeAccuracy
                Heading:           position.coords.heading
                Speed:             position.coords.speed
                */
                var youarehere_pixels = {
                        "top": -parseInt((position.coords.latitude - window.map_details.latitude) / window.map_details.degrees_per_pixel, 10),
                        "left": parseInt((position.coords.longitude - window.map_details.longitude) / window.map_details.degrees_per_pixel, 10)
                    },
                    edge_buffer_pixels = 10,
                    $youarehere = $("#youarehere").data("latitude", position.coords.latitude).data("longitude", position.coords.longitude),
                    $youarehere_offmap = $youarehere.find(".offmap"),
                    youarehere_css = {position: "absolute"},
                    youarehere_offmap_css = {position: "absolute", left: $youarehere.width() - 15, top: $youarehere.height()},
                    offmap = false,
                    difference_distance_in_kilometres = Math.round(
                            difference_between_positions_in_kilometers(
                                position.coords.latitude, position.coords.longitude,
                                window.map_details.latitude, window.map_details.longitude,
                                window.map_details.extent_latitude, window.map_details.extent_longitude
                            ) * 100) / 100;
                
                $youarehere_offmap.html("you are off the map by about " + format_distance(difference_distance_in_kilometres));
                if(youarehere_pixels.left < 0) {
                    youarehere_pixels.left = edge_buffer_pixels;
                    youarehere_offmap_css.left = edge_buffer_pixels;
                    offmap = true;
                } else if(youarehere_pixels.left > window.map_details.map_pixel_width){
                    youarehere_pixels.left = window.map_details.map_pixel_width - edge_buffer_pixels;
                    youarehere_offmap_css.left -= $youarehere_offmap.width() + edge_buffer_pixels;
                    offmap = true;
                }
                if(youarehere_pixels.top < 0) {
                    youarehere_pixels.top = edge_buffer_pixels;
                    youarehere_offmap_css.top = edge_buffer_pixels;
                    offmap = true;
                } else if(youarehere_pixels.top > window.map_details.map_pixel_height){
                    youarehere_pixels.top = window.map_details.map_pixel_height - edge_buffer_pixels;
                    youarehere_offmap_css.top = -$youarehere_offmap.height() - edge_buffer_pixels;
                    offmap = true;
                }
                youarehere_css.left = youarehere_pixels.left + "px";
                youarehere_css.top = youarehere_pixels.top + "px";
                youarehere_offmap_css.left += "px";
                youarehere_offmap_css.top += "px";
                if(!offmap){
                    if(geolocationSettings.enableHighAccuracy === true) {
                        $youarehere.removeClass("badAccuracy").addClass("goodAccuracy");
                    } else {
                        $youarehere.removeClass("goodAccuracy").addClass("badAccuracy");
                    }
                    $youarehere_offmap.hide();
                } else {
                    $youarehere.removeClass("badAccuracy goodAccuracy");
                    $youarehere_offmap.css(youarehere_offmap_css).show();
                }
                $youarehere.css(youarehere_css).show();
                if(centered_once_upon_load === false) {
                    var $map = $("#map"),
                        $window = $(window),
                        map_offset = $map.offset(),
                        x = Math.abs(youarehere_pixels.left),
                        y = Math.abs(youarehere_pixels.top);
                    
                    centered_once_upon_load = true;
                    centerMap(x, y);
                }
                last_known_position = position;
                localStorage["geolocation-last-known-position"] = JSON.stringify(position);
            },
            geolocationError = function(msg) {
                try{
                    geolocation.clearWatch(geolocationWatchId);
                } catch(exception){
                }
                if(geolocationSettings.enableHighAccuracy === true) { //high accuracy failed so retry with low accuracy
                    geolocationSettings.enableHighAccuracy = false;
                    geolocationWatchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, geolocationSettings);
                } else {
                    $("#no_gps").attr("title", msg.message).show();
                }
            },
            enable_map = function($image){
                //based on code from http://eightmedia.github.com/hammer.js/zoom/index2.html
                var hammer,
                    height,
                    offset,
                    screenOffset,
                    origin,
                    prevScale,
                    scale,
                    translate,
                    width,
                    screenOrigin,
                    redraw = function(){
                        var locations_css = 'scale3d(' + ( 1 / scale ) + ', ' + ( 1 / scale ) + ', 0)',
                            map_css = 'translate3d(' + drag_offset.x + 'px, ' + drag_offset.y + 'px, 0) scale3d(' + scale + ', ' + scale + ', 1)';
                        $image.css('-webkit-transform', map_css);
                        window.hide_all_popovers();
                    };

                //wrap = $('#wrap');
                width = $image.width();
                height = $image.height();
                offset = $image.offset();
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

                scale = 1;
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

                    if(scale < 0.3) {
                        scale = 0.3;
                    } else if(scale > 3) {
                        scale = 3;
                    }

                    newWidth = $image.width() * scale;
                    newHeight = $image.height() * scale;

                    origin.x = screenOrigin.x - offset.left - translate.x;
                    origin.y = screenOrigin.y - offset.top - translate.y;

                    translate.x += -origin.x * (newWidth - width) / newWidth;
                    translate.y += -origin.y * (newHeight - height) / newHeight;

                    //$image.css('-webkit-transform', "translate3d(" + drag_offset.x + "px, " + drag_offset.y + "px, 0) scale3d(" + scale + ", " + scale + ", 1)");
                    redraw();
                    width = newWidth;

                    return height = newHeight;/*IGNORE JSLINT COMPLAINT*/ /*UNFORTUNATELY JSLINT DOESN'T CURRENTLY ALLOW IGNORE ON LINES OF CODE (I THINK)*/
                });

                hammer.bind('transformend', function(event) {
                    return prevScale = scale;/*IGNORE JSLINT COMPLAINT*/ /*UNFORTUNATELY JSLINT DOESN'T CURRENTLY ALLOW IGNORE ON LINES OF CODE (I THINK)*/
                });
            },
            centerMap = function(x, y){
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
                //$("#debug").text(map_css);
                $map.css('-webkit-transform', map_css);
                drag_offset.base_x = x;
                drag_offset.base_y = y;
            },
            current_time_in_epoch_milliseconds,
            
            user_actions = {
                $user_actions_panel: $("#user_actions"),
                $photo_preview: $("#photo-preview"),
                panel_toggle: function(event){
                    var user_is_off_map = $("#youarehere").find(".offmap").is(":visible"),
                        error_html;
                    if(!navigator.camera && !user_is_off_map) {
                        if(user_actions.$user_actions_panel.hasClass("hidden")){
                            user_actions.$user_actions_panel.removeClass("hidden");
                        } else {
                            user_actions.$user_actions_panel.addClass("hidden");
                        }
                    } else {
                        if(navigator.camera && user_is_off_map) {
                            error_html = "You're off the map so we can't take location photos<br>Use your regular camera app";
                        } else if(!navigator.camera && user_is_off_map) {
                            error_html = "No camera available<br>(and you're off the map anyway so we can't take location photos)";
                        } else if(!navigator.camera && !user_is_off_map) {
                            error_html = "No camera available";
                        }
                        user_actions.$camera_error.html(error_html).fadeIn(function(){
                            if(user_actions.camera_error_timer) {
                                clearTimeout(user_actions.camera_error_timer);
                            }
                            user_actions.camera_error_timer = setTimeout(user_actions.camera_error_hide, 2000);
                        });
                    }
                },
                data_photo_uri_key: "content-image-uri",
                show_user_photo: function(event){
                    var $photo = user_actions.$photo_preview;
                    $photo.attr("src", $photo.data(user_actions.data_photo_uri_key)).show();
                },
                hide_user_photo: function(event){
                    var $photo = user_actions.$photo_preview;
                    $photo.hide();
                },
                add_photo_to_map: function(imageURI, latitude, longitude, display_immediately){
                    var $photo_icon = $("<a/>").addClass("location user-photo").data(user_actions.data_photo_uri_key, imageURI).click(user_actions.show_user_photo);
                    $("#map").append($photo_icon);
                    if(display_immediately) {
                        $photo_icon.click();
                    }
                    //TODO: store in localStorage too
                },
                take_photo: function(){
                    var camera_success = function(imageURI) {
                            var $photo_preview = $("#photo-preview");
                            $photo_preview.attr("src", imageURI);
                            last_known_position = localStorage["geolocation-last-known-position"];
                            if(last_known_position !== undefined) {
                                last_known_position = JSON.parse(last_known_position);
                                user_actions.add_photo_to_map(imageURI, last_known_position.coords.latitude, last_known_position.coords.longitude, true);
                            }
                        },
                        camera_fail = function onFail(message) {
                            alert('Failed because: ' + message);
                        };
                    navigator.camera.getPicture(camera_success, camera_fail, {quality: 50, destinationType: Camera.DestinationType.FILE_URI});
                    return false;
                },
                camera_error_timer:undefined,
                $camera_error: $("#camera_error"),
                camera_error_hide: function(){
                    user_actions.$camera_error.fadeOut();
                }
            },
            $locations = $(".location"),
            geolocationWatchId,
            youarehere_hammer,
            hammer_defaults = {
                prevent_default: true,
                scale_treshold: 0,
                drag_min_distance: 0
            };

        if(last_known_position !== undefined) {
            last_known_position = JSON.parse(last_known_position);
            current_time_in_epoch_milliseconds = (new Date()).getTime();
            if(last_known_position.timestamp < current_time_in_epoch_milliseconds - position_expires_after_milliseconds) {
                centerMap();
            } else {
                geolocationSuccess(last_known_position);
            }
        } else {
            centerMap();
        }

        if (navigator.geolocation) {
            geolocationWatchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, geolocationSettings);
        } else {
            geolocationError();
        }
        
        enable_map($("#map"));
        if(Modernizr.touch) {
            $("#weta").hammer(hammer_defaults).bind('touchstart', window.toggle_popover);
            $("#map .location").hammer(hammer_defaults).bind('touchstart', window.toggle_popover);
            $("#take-photo").hammer(hammer_defaults).bind('touchstart', user_actions.take_photo);
            $("#photo-preview").hammer(hammer_defaults).bind('touchstart', user_actions.hide_user_photo);
            //touch devices
        } else {
            $("#weta").click(window.toggle_popover);
            $("#map .location").click(window.toggle_popover);
            //anything for desktop browsers
            $("#take-photo").click(user_actions.take_photo);
            $("#photo-preview").click(user_actions.hide_user_photo);
            
        }
        youarehere_hammer = $("#youarehere, #no_gps").hammer(hammer_defaults);
        youarehere_hammer.bind("tap", user_actions.panel_toggle);
        user_actions.$camera_error.click(user_actions.camera_error_hide);

        
        
    };

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", map_start, false);
    } else {
        $(document).ready(map_start);
    }
}(jQuery));