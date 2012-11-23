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
            $html = $("html").bind("popover-click", disable_all_dont_miss);

        $("body").on("click", ".audio", function(event){
            console.log("Trying to play");
            /*
            //1. HTML5 Audio approach
            var $audio = $("audio"),
                $this = $(this),
                audio_element;
            if($audio.length === 0) {
                $audio = $("<audio src=\"" + $this.data("audio") + "\" />");
                $("body").append($audio);
                audio_element = $audio.get(0);
                audio_element.addEventListener("load", function(){
                    audio_element.play();
                    console.log("Playing?");
                });
            } else {
                $audio.attr("src", $this.data("audio"));
                audio_element = $audio.get(0);
            }
            audio_element.load();
            audio_element.play();
            */
            //2. Phonegap Media approach
            var $this = $(this),
                onSuccess = function(){
                    console.log("playAudio():Audio Success");
                },
                onError = function onError(error) {
                    alert('code: '    + error.code    + '\nmessage: ' + error.message + '\n');
                },
                audio_path = "/android_asset/www/" + $this.data("audio");
            console.log("Trying to play " + audio_path);
            var my_media = new Media(audio_path, onSuccess, onError);
            my_media.play();
            
            
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