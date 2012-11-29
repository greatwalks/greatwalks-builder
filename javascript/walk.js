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
            $html = $("html").bind("popover-click", disable_all_dont_miss),
            $elevation_profile = $("#elevation-profile");

        $(".modal").click(function(){
            $(this).modal("hide");
        });
        setInterval(function(){
            console.log($("#elevation-profile").css("z-index"));
        }, 2000);
        //$('#carousel').carousel();

        $("body").on("click", ".audio", function(event){
            var $this = $(this),
                audio_path,
                media_player;
            if(window.Media) { //use Phonegap-style audio
               var  onSuccess = function(){},
                    onError = function onError(error) {
                        console.log('AUDIO ERROR code: '    + error.code    + '\nmessage: ' + error.message + '\n');
                    };
                audio_path = "/android_asset/www/" + $this.data("audio");
                media_player = new window.Media(audio_path, onSuccess, onError);
                media_player.play();
            } else {// Use HTML5 Audio approach
                var $audio = $("audio"),
                    audio_element;
                audio_path = $this.data("audio");
                if($audio.length === 0) {
                    $audio = $("<audio/>").attr("src", audio_path);
                    $("body").append($audio);
                } else {
                    $audio.attr("src", audio_path);
                }
                audio_element = $audio.get(0);
                audio_element.load();
                audio_element.play();
            }
        });
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