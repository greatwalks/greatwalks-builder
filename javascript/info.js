/*globals window localStorage JSON geolocation navigator */
(function($){
    "use strict";
    var one_second_in_milliseconds = 1000,
        geolocation_watchId,
        geolocation_key = "geolocation-last-known-position",
        last_known_position_json = localStorage[geolocation_key],
        geolocationSettings = {
            maximumAge:600000,
            enableHighAccuracy: true,
            timeout: one_second_in_milliseconds * 15
        },
        $report_error,
        report_error_template = "mailto:greatwalks@doc.govt.nz?subject=Issue on Great Walks track- please fix&body=The issue is near {{Latitude}}/{{Longitude}} (Lat/Long)",
        geolocationSuccess = function(position){
            $report_error.attr("href", report_error_template
                .replace(/\{\{Longitude\}\}/, position.coords.longitude)
                .replace(/\{\{Latitude\}\}/, position.coords.latitude)
            );
            window.localStorage[geolocation_key] = JSON.stringify(position);
        },
        geolocationError = function(msg) {
            try{
                geolocation.clearWatch(geolocation_watchId);
            } catch(exception){
            }
            if(geolocationSettings.enableHighAccuracy === true) { //high accuracy failed so retry with low accuracy
                geolocationSettings.enableHighAccuracy = false;
                geolocation_watchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, geolocationSettings);
            } else {
                // No GPS available, silently ignore
            }
        },
        info_init = function(){
            $report_error = $(".report_error");
            if(last_known_position_json) {
                 geolocationSuccess(JSON.parse(last_known_position_json));
            }
            geolocation_watchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, geolocationSettings);
        };
    window.pageload(info_init, "info.html");
}(jQuery));