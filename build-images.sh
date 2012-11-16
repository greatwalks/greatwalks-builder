#! /bin/bash

mkdir -p "../greatwalks/img/walks/abel-tasman-coast-track" \
mkdir -p "../greatwalks/img/walks/heaphy-track"
mkdir -p "../greatwalks/img/walks/kepler-track"
mkdir -p "../greatwalks/img/walks/lake-waikaremoana"
mkdir -p "../greatwalks/img/walks/milford-track"
mkdir -p "../greatwalks/img/walks/rakiura-track---stewart-island"
mkdir -p "../greatwalks/img/walks/routeburn-track"
mkdir -p "../greatwalks/img/walks/tongariro-northern-circuit"
mkdir -p "../greatwalks/img/walks/whanganui-journey"
mkdir -p "../greatwalks/img/walks/wellington"

node build-images.js

inkscape images/great-walks-logo.svg -z --export-png=../greatwalks/img/logo-x150.png --export-width=150
inkscape images/great-walks-logo.svg -z --export-png=../greatwalks/img/logo-x225.png --export-width=225
inkscape images/great-walks-logo.svg -z --export-png=../greatwalks/img/logo-x300.png --export-width=300
inkscape images/great-walks-logo.svg -z --export-png=../greatwalks/img/logo-x600.png --export-width=600
inkscape images/great-walks-logo.svg -z --export-png=../greatwalks/img/logo-x1200.png --export-width=1200

inkscape images/great-walks-icon.svg -z --export-png=../greatwalks-phonegap/res/drawable-hdpi/ic_launcher.png --export-width=72
inkscape images/great-walks-icon.svg -z --export-png=../greatwalks-phonegap/res/drawable-ldpi/ic_launcher.png --export-width=36
inkscape images/great-walks-icon.svg -z --export-png=../greatwalks-phonegap/res/drawable-mdpi/ic_launcher.png --export-width=48
inkscape images/great-walks-icon.svg -z --export-png=../greatwalks-phonegap/res/drawable-xhdpi/ic_launcher.png --export-width=96


./yresize -i"images/tongariro-home.jpg" -o"../greatwalks/img/tongariro-home.jpg" -s640x430
./yresize -i"images/Abel-NEW-home.jpg" -o"../greatwalks/img/Abel-NEW-home.jpg" -s640x430
./yresize -i"images/heaphy-home_0.jpg" -o"../greatwalks/img/heaphy-home_0.jpg" -s640x430
./yresize -i"images/Kepler-NEW-home.jpg" -o"../greatwalks/img/Kepler-NEW-home.jpg" -s640x430
./yresize -i"images/Milford-home.jpg" -o"../greatwalks/img/Milford-home.jpg" -s640x430
./yresize -i"images/rakiura-home.jpg" -o"../greatwalks/img/rakiura-home.jpg" -s640x430
./yresize -i"images/Routeburn-home.jpg" -o"../greatwalks/img/Routeburn-home.jpg" -s640x430
./yresize -i"images/Waikaremoana-NEW-home.jpg" -o"../greatwalks/img/Waikaremoana-NEW-home.jpg" -s640x430
./yresize -i"images/Whanganui-Journey-home.jpg" -o"../greatwalks/img/Whanganui-Journey-home.jpg" -s640x430

# cp images/map-background.png ../greatwalks/img/map-background.png

cp images/tongariro-home.jpg ../greatwalks/img/tongariro-home@2x.jpg
cp images/Abel-NEW-home.jpg ../greatwalks/img/Abel-NEW-home@2x.jpg
cp images/heaphy-home_0.jpg ../greatwalks/img/heaphy-home_0@2x.jpg
cp images/Kepler-NEW-home.jpg ../greatwalks/img/Kepler-NEW-home@2x.jpg
cp images/Milford-home.jpg ../greatwalks/img/Milford-home@2x.jpg
cp images/rakiura-home.jpg ../greatwalks/img/rakiura-home@2x.jpg
cp images/Routeburn-home.jpg ../greatwalks/img/Routeburn-home@2x.jpg
cp images/Waikaremoana-NEW-home.jpg ../greatwalks/img/Waikaremoana-NEW-home@2x.jpg
cp images/Whanganui-Journey-home.jpg ../greatwalks/img/Whanganui-Journey-home@2x.jpg

cp images/header-icons.png ../greatwalks/img/header-icons.png
cp images/slideout-menu.png ../greatwalks/img/slideout-menu.png

cp images/table.png ../greatwalks/img/table.png
cp images/weta_land.png ../greatwalks/img/weta_land.png
cp images/weta_twitch.png ../greatwalks/img/weta_twitch.png

cp images/icons/airport.png ../greatwalks/img/icon-airport.png
cp images/icons/alert.png ../greatwalks/img/icon-alert.png
cp images/icons/bird-or-animal-species.png ../greatwalks/img/icon-bird-or-animal-species.png
cp images/icons/camp_hut.png ../greatwalks/img/icon-camp_hut.png
cp images/icons/camping.png ../greatwalks/img/icon-camping.png
cp images/icons/carpark.png ../greatwalks/img/icon-carpark.png
cp images/icons/hotsprings.png ../greatwalks/img/icon-hotsprings.png
cp images/icons/huts.png ../greatwalks/img/icon-huts.png
cp images/icons/icons.png ../greatwalks/img/icon-icons.png
cp images/icons/information.png ../greatwalks/img/icon-information.png
cp images/icons/plantspecies.png ../greatwalks/img/icon-plantspecies.png
cp images/icons/shelter.png ../greatwalks/img/icon-shelter.png
cp images/icons/toilets.png ../greatwalks/img/icon-toilets.png
cp images/icons/trailhead.png ../greatwalks/img/icon-trailhead.png
cp images/icons/viewpoints.png ../greatwalks/img/icon-viewpoints.png
cp images/icons/volcano.png ../greatwalks/img/icon-volcano.png
cp images/icons/waterfall.png ../greatwalks/img/icon-waterfall.png

cp images/youarehere.png ../greatwalks/img/youarehere.png
cp images/camera-placeholder.jpg ../greatwalks/img/camera-placeholder.jpg
cp images/missing-icon.png ../greatwalks/img/missing-icon.png
cp images/homepage-sign.png ../greatwalks/img/homepage-sign.png
cp images/homepage-buttons.png ../greatwalks/img/homepage-buttons.png
cp images/content-buttons.png ../greatwalks/img/content-buttons.png

cp images/walk-icons.png ../greatwalks/img/walk-icons.png
