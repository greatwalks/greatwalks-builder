/* globals window Modernizr Hammer */
/* Geolocation */
(function($){
    var $html,
        one_second_in_milliseconds = 1000,
        geo = {
            watch_id: undefined,
            settings: {
                maximumAge:600000,
                enableHighAccuracy: true,
                timeout: one_second_in_milliseconds * 15
            },
            timer: undefined,
            last_known_position: undefined,
            localStorage_position_cache_key: "geolocation-last-known-position",
            trigger_frequency_milliseconds: 2000,
            trigger_update: function(){
                if(geo.last_known_position === undefined) return;
                $html.trigger("doc:geolocation:success", geo.last_known_position);
                geo.timer = setTimeout(geo.trigger_update, geo.trigger_frequency_milliseconds);
            },
            init: function(){
                $html = $("html");
                var last_known_position_json = localStorage[geo.localStorage_position_cache_key];
                    
                if(last_known_position_json !== undefined) {
                    geo.last_known_position = JSON.parse(last_known_position_json);
                    current_time_in_epoch_milliseconds = (new Date()).getTime();
                    $html.trigger("doc:geolocation:success", geo.last_known_position);
                }

                if (navigator.geolocation) {
                    geo.watch_id = navigator.geolocation.watchPosition(geo.success, geo.failure, geo.settings);
                } else {
                    geo.error();
                }

                if(geo.timer){
                    clearTimeout(geo.timer);
                }
                geo.timer = setTimeout(geo.trigger_update, geo.trigger_frequency_milliseconds);
            },
            success: function(position){
                $html.trigger("doc:geolocation:success", position);
                geo.last_known_position = position;
                localStorage[geo.localStorage_position_cache_key] = JSON.stringify(position);
            },
            error: function(msg){
                try{
                    geolocation.clearWatch(geolocationWatchId);
                } catch(exception){
                }
                if(geo.settings.enableHighAccuracy === true) { //high accuracy failed so retry with low accuracy
                    geo.settings.enableHighAccuracy = false;
                    geo.watch_id = navigator.geolocation.watchPosition(geo.success, geo.error, geo.settings);
                } else {
                    $html.trigger("doc:geolocation:failure");
                }
            }
        };
    window.pageload(geo.init);
    window.geolocation_get_settings = function(){
        return geo.settings;
    };
    window.geolocation_get_last_position = function(){
        return geo.last_known_position;
    };
}(jQuery));