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
            hammer_defaults = {
                prevent_default: true,
                scale_treshold: 0,
                drag_min_distance: 0
            },
            last_known_position = localStorage["geolocation-last-known-position"],
            one_second_in_milliseconds = 1000,
            geolocationWatchId,
            geolocationSettings = {
                maximumAge:600000,
                enableHighAccuracy: true,
                timeout: one_second_in_milliseconds * 15
            },
            pixels_to_longitude_latitude = function(map_x, map_y){
                return {
                    longitude: map_details.longitude + (map_x / map_details.degrees_per_pixel),
                    latitude: map_details.latitude + (map_y / map_details.degrees_per_pixel)
                };
            },
            longitude_latitude_to_pixels = function(longitude, latitude){
                return {
                    left: Math.abs((longitude - map_details.longitude) / map_details.degrees_per_pixel) + "px",
                    top: Math.abs((latitude - map_details.latitude) / map_details.degrees_per_pixel) + "px"
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
                    window.centerMap(x, y);
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

            current_time_in_epoch_milliseconds,
            user_actions = {
                $user_actions_panel: $("#user_actions"),
                $photo_preview: $("#photo-preview"),
                initialize_user_photos: function(){
                    var user_photos_string = localStorage["user-photos"],
                        user_photos,
                        user_map_photos,
                        user_map_photo,
                        i;
                    if(user_photos_string === undefined) return;
                    user_photos = JSON.parse(user_photos_string);
                    if(user_photos[map_details.map_id] === undefined) return;
                    user_map_photos = user_photos[map_details.map_id];
                    for(i = 0; i < user_map_photos.length; i++){
                        user_map_photo = user_map_photos[i];
                        user_actions.add_photo_to_map(user_map_photo.imageURI, user_map_photo.latitude, user_map_photo.longitude);
                    }
                },
                panel_toggle: function(event){
                    var user_is_off_map = $("#youarehere").find(".offmap").is(":visible"),
                        error_html;
                    if(navigator.camera && !user_is_off_map) {
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
                    var $photo = user_actions.$photo_preview,
                        $this = $(this);
                    $photo.attr("src", $this.data(user_actions.data_photo_uri_key)).show();
                },
                hide_user_photo: function(event){
                    var $photo = user_actions.$photo_preview;
                    $photo.hide();
                },
                add_photo_to_map: function(imageURI, latitude, longitude, display_immediately, add_to_localStorage){
                    var user_photo_data = {
                        "longitude": longitude,
                        "latitude": latitude
                        },
                        user_photo_style,
                        user_photos,
                        user_photo;
                    if(latitude !== undefined && longitude !== undefined) {
                        user_photo_style = longitude_latitude_to_pixels(longitude, latitude);
                        user_photo_style.position = "absolute";
                    }
                    user_photo_data[user_actions.data_photo_uri_key] = imageURI;
                    var $photo_icon = $("<a/>").addClass("location location-icon location-user-photo").data(user_photo_data);
                    if(user_photo_style){
                        $photo_icon.css(user_photo_style);
                    }
                    $("#map").append($photo_icon);
                    if(Modernizr.touch) {
                        $photo_icon.hammer(hammer_defaults).bind('tap', user_actions.show_user_photo);
                    } else {
                        $photo_icon.click(user_actions.show_user_photo);
                    }
                    if(display_immediately === true) {
                        user_actions.show_user_photo.call($photo_icon); //I could unwrap it with .get(0) but it'll still work in show_user_photo
                    }
                    if(add_to_localStorage === true) {
                        user_photos = localStorage["user-photos"];
                        if(user_photos === undefined) {
                            user_photos = {};
                        }
                        if(user_photos[map_details.map_id] === undefined){
                            user_photos[map_details.map_id] = [];
                        }
                        user_photo = {
                            "imageURI": imageURI,
                            "latitude": latitude,
                            "longitude": longitude
                        };
                        user_photos[map_details.map_id].push(user_photo);
                        localStorage["user-photos"] = JSON.stringify(user_photos);
                    }
                },
                take_photo: function(){
                    var camera_success = function(imageURI) {
                            var $photo_preview = $("#photo-preview");
                            $photo_preview.attr("src", imageURI);
                            last_known_position = localStorage["geolocation-last-known-position"];
                            if(last_known_position !== undefined) {
                                last_known_position = JSON.parse(last_known_position);
                                user_actions.add_photo_to_map(imageURI, last_known_position.coords.latitude, last_known_position.coords.longitude, true, true);
                            } else {
                                user_actions.add_photo_to_map(imageURI, undefined, undefined, true, true);
                            }
                            user_actions.$user_actions_panel.addClass("hidden");
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
            youarehere_hammer;

        if(last_known_position !== undefined) {
            last_known_position = JSON.parse(last_known_position);
            current_time_in_epoch_milliseconds = (new Date()).getTime();
            if(last_known_position.timestamp < current_time_in_epoch_milliseconds - position_expires_after_milliseconds) {
                window.centerMap();
            } else {
                geolocationSuccess(last_known_position);
            }
        } else {
            window.centerMap();
        }

        if (navigator.geolocation) {
            geolocationWatchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, geolocationSettings);
        } else {
            geolocationError();
        }
        
        
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
        user_actions.initialize_user_photos();
        user_actions.$camera_error.click(user_actions.camera_error_hide);
    };

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", map_start, false);
    } else {
        $(document).ready(map_start);
    }
}(jQuery));