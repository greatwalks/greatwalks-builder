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
        $locations,
        $visitor_centres_list,
        geolocationSuccess = function(position){
            var locations;
            /*
            Latitude:          position.coords.latitude
            Longitude:         position.coords.longitude
            Altitude:          position.coords.altitude
            Accuracy:          position.coords.accuracy
            Altitude Accuracy: position.coords.altitudeAccuracy
            Heading:           position.coords.heading
            Speed:             position.coords.speed
            */
            $locations.each(function(){
                var $this = $(this),
                    location_coords = {
                        "longitude": $this.data("longitude"),
                        "latitude": $this.data("latitude")
                    },
                    distance_away = window.difference_between_positions_in_kilometers(position.coords.latitude, position.coords.longitude, location_coords.latitude, location_coords.longitude);
                $this.find(".distance_away").text(distance_away);
                $this.data("distance-away", distance_away);
            });

            locations = $locations.get();
            locations.sort(function(a,b){
                var $a = $(a),
                    $b = $(b),
                    a_distance_away = $a.data("distance-away"),
                    b_distance_away = $b.data("distance-away");
                if(a_distance_away > b_distance_away) return 1;
                if(a_distance_away < b_distance_away) return -1;
                return 0;
            });
            $.each(locations, function(index, item){ 
                $visitor_centres_list.append(item);
            });

            
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
        visitor_centre_init = function(){
            $locations = $(".visitor-centre-location");
            $visitor_centres_list = $("#visitor-centres-list");
            if(last_known_position_json) {
                 geolocationSuccess(JSON.parse(last_known_position_json));
            }
            geolocation_watchId = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, geolocationSettings);
        };
        
    

    window.pageload(visitor_centre_init, "visitor-centre.html");
}(jQuery));