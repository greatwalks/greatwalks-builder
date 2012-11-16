#! /bin/bash

cat bootstrap-javascript/bootstrap-transition.js \
    bootstrap-javascript/bootstrap-alert.js \
    bootstrap-javascript/bootstrap-modal.js \
    bootstrap-javascript/bootstrap-dropdown.js \
    bootstrap-javascript/bootstrap-scrollspy.js \
    bootstrap-javascript/bootstrap-tab.js \
    bootstrap-javascript/bootstrap-tooltip.js \
    bootstrap-javascript/bootstrap-popover.js \
    bootstrap-javascript/bootstrap-button.js \
    bootstrap-javascript/bootstrap-collapse.js \
    bootstrap-javascript/bootstrap-carousel.js \
    bootstrap-javascript/bootstrap-typeahead.js \
    bootstrap-javascript/bootstrap-affix.js \
    > ../greatwalks/js/vendor/bootstrap.js

cat javascript/*.js > ../greatwalks/js/app.js
