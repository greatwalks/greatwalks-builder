/*globals alert Modernizr window navigator document setTimeout clearTimeout*/
(function($){
    "use strict";
    if(window.location.pathname.toString().indexOf("find-an-adventure.html") === -1) return;
    var find_init = function(){
        var close_modal_timer;
        $(".resetFinder").click(function(event){
            $(".modal .active").removeClass("active");
            $("#no-results").hide();
            $("#results").hide();
        }),
        
        $(".modal").on("click", "a", function(event){
            var $this = $(this),
                $list_item = $this.closest("li"),
                $modal = $this.closest(".modal"),
                modal_id = $modal.attr("id"),
                $results = $("#results"),
                $no_results = $("#no-results"),
                $results_search = $results.find("li"),
                $modals = $(".modal"),
                $warning_one_two_days = $("#warning-1-2-days");
                
            if(modal_id === "where" || modal_id === "time") {
                $list_item.toggleClass("active").siblings().removeClass("active");
            } else if($modal.is("#see")) {
                $list_item.toggleClass("active");
            }
            $modal.modal('hide');

            if(close_modal_timer) {
                clearTimeout(close_modal_timer);
                close_modal_timer = undefined;
            }
            close_modal_timer = setTimeout(function(){ //give the user time to see their choice before closing the modal dialog
                $(".modal-backdrop").remove();
            }, 250);
            
            $results_search.show();
            $warning_one_two_days.hide();
            $modals.each(function(index){
                var $modal = $(this),
                    modal_id = $modal.attr("id"),
                    $active_selections = $modal.find(".active");

                $active_selections.each(function(){
                    var $active_selection = $(this),
                        active_selection_id = $active_selection.attr("id"),
                        selector = "." + active_selection_id;
                    $results_search.not(selector).hide();
                    $results_search = $results_search.filter(selector);
                    if(active_selection_id === "time-1-2-days") {
                        $warning_one_two_days.show();
                    }
                });
            });
            
            if($results_search.length > 0) {
                $results.show();
                $no_results.hide();
            } else {
                $results.hide();
                $no_results.show();
            }
            event.preventDefault();
        });
    };

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", find_init, false);
    } else {
        $(document).ready(find_init);
    }
}(jQuery));
