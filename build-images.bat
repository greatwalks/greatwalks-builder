mkdir "..\greatwalks\img"
mkdir "..\greatwalks\img\walks"
mkdir "..\greatwalks\img\walks\abel-tasman-coast-track"
mkdir "..\greatwalks\img\walks\heaphy-track"
mkdir "..\greatwalks\img\walks\kepler-track"
mkdir "..\greatwalks\img\walks\lake-waikaremoana"
mkdir "..\greatwalks\img\walks\milford-track"
mkdir "..\greatwalks\img\walks\rakiura-track---stewart-island"
mkdir "..\greatwalks\img\walks\routeburn-track"
mkdir "..\greatwalks\img\walks\tongariro-northern-circuit"
mkdir "..\greatwalks\img\walks\whanganui-journey"
mkdir "..\greatwalks\img\walks\wellington"

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


resize -i"images/tongariro-home.jpg" -o"../greatwalks/img/tongariro-home.jpg" -s640x430
resize -i"images/Abel-NEW-home.jpg" -o"../greatwalks/img/Abel-NEW-home.jpg" -s640x430
resize -i"images/heaphy-home_0.jpg" -o"../greatwalks/img/heaphy-home_0.jpg" -s640x430
resize -i"images/Kepler-NEW-home.jpg" -o"../greatwalks/img/Kepler-NEW-home.jpg" -s640x430
resize -i"images/Milford-home.jpg" -o"../greatwalks/img/Milford-home.jpg" -s640x430
resize -i"images/rakiura-home.jpg" -o"../greatwalks/img/rakiura-home.jpg" -s640x430
resize -i"images/Routeburn-home.jpg" -o"../greatwalks/img/Routeburn-home.jpg" -s640x430
resize -i"images/Waikaremoana-NEW-home.jpg" -o"../greatwalks/img/Waikaremoana-NEW-home.jpg" -s640x430
resize -i"images/Whanganui-Journey-home.jpg" -o"../greatwalks/img/Whanganui-Journey-home.jpg" -s640x430

copy /Y images\map-background.png ..\greatwalks\img\map-background.png

copy /Y images\tongariro-home.jpg ..\greatwalks\img\tongariro-home@2x.jpg
copy /Y images\Abel-NEW-home.jpg ..\greatwalks\img\Abel-NEW-home@2x.jpg
copy /Y images\heaphy-home_0.jpg.jpg ..\greatwalks\img\heaphy-home_0@2x.jpg
copy /Y images\Kepler-NEW-home.jpg ..\greatwalks\img\Kepler-NEW-home@2x.jpg
copy /Y images\Milford-home.jpg ..\greatwalks\img\Milford-home@2x.jpg
copy /Y images\rakiura-home.jpg ..\greatwalks\img\rakiura-home@2x.jpg
copy /Y images\Routeburn-home.jpg ..\greatwalks\img\Routeburn-home@2x.jpg
copy /Y images\Waikaremoana-NEW-home.jpg ..\greatwalks\img\Waikaremoana-NEW-home@2x.jpg
copy /Y images\Whanganui-Journey-home.jpg ..\greatwalks\img\Whanganui-Journey-home@2x.jpg

copy /Y images\header-icons.png ..\greatwalks\img\header-icons.png
copy /Y images\slideout-menu.png ..\greatwalks\img\slideout-menu.png

copy /Y images\table.png ..\greatwalks\img\table.png
copy /Y images\weta_land.png ..\greatwalks\img\weta_land.png
copy /Y images\weta_twitch.png ..\greatwalks\img\weta_twitch.png

copy /Y images\map-icons\airport.png ..\greatwalks\img\icon-airport.png
copy /Y images\map-icons\alert.png ..\greatwalks\img\icon-alert.png
copy /Y images\map-icons\bird-or-animal-species.png ..\greatwalks\img\icon-bird-or-animal-species.png
copy /Y images\map-icons\camp_hut.png ..\greatwalks\img\icon-camp_hut.png
copy /Y images\map-icons\camping.png ..\greatwalks\img\icon-camping.png
copy /Y images\map-icons\carpark.png ..\greatwalks\img\icon-carpark.png
copy /Y images\map-icons\hotsprings.png ..\greatwalks\img\icon-hotsprings.png
copy /Y images\map-icons\huts.png ..\greatwalks\img\icon-huts.png
copy /Y images\map-icons\icons.png ..\greatwalks\img\icon-icons.png
copy /Y images\map-icons\information.png ..\greatwalks\img\icon-information.png
copy /Y images\map-icons\plantspecies.png ..\greatwalks\img\icon-plantspecies.png
copy /Y images\map-icons\shelter.png ..\greatwalks\img\icon-shelter.png
copy /Y images\map-icons\toilets.png ..\greatwalks\img\icon-toilets.png
copy /Y images\map-icons\trailhead.png ..\greatwalks\img\icon-trailhead.png
copy /Y images\map-icons\viewpoints.png ..\greatwalks\img\icon-viewpoints.png
copy /Y images\map-icons\generic_nature.png ..\greatwalks\img\icon-generic_nature.png
copy /Y images\map-icons\volcano.png ..\greatwalks\img\icon-volcano.png
copy /Y images\map-icons\waterfall.png ..\greatwalks\img\icon-waterfall.png
copy /Y images\map-icons\swimming.png ..\greatwalks\img\icon-swimming.png
copy /Y images\map-icons\side_trail.png ..\greatwalks\img\icon-side_trail.png

copy /Y images\content-icons\calendar.png  ..\greatwalks\img\icon-calendar.png
copy /Y images\content-icons\culture.png ..\greatwalks\img\icon-culture.png
copy /Y images\content-icons\maps_blue.png ..\greatwalks\img\icon-maps_blue.png
copy /Y images\content-icons\plants_trees.png ..\greatwalks\img\icon-plants_trees.png
copy /Y images\content-icons\volcano.png ..\greatwalks\img\icon-volcano.png
copy /Y images\content-icons\camping.png ..\greatwalks\img\icon-camping.png
copy /Y images\content-icons\kiwi.png ..\greatwalks\img\icon-kiwi.png
copy /Y images\content-icons\maps_gold.png ..\greatwalks\img\icon-maps_gold.png
copy /Y images\content-icons\river.png ..\greatwalks\img\icon-river.png
copy /Y images\content-icons\canoe.png ..\greatwalks\img\icon-canoe.png
copy /Y images\content-icons\lakes.png ..\greatwalks\img\icon-lakes.png
copy /Y images\content-icons\mountains.png ..\greatwalks\img\icon-mountains.png
copy /Y images\content-icons\specials.png ..\greatwalks\img\icon-specials.png


copy /Y images\youarehere.png ..\greatwalks\img\youarehere.png
copy /Y images\camera-placeholder.jpg ..\greatwalks\img\camera-placeholder.jpg
copy /Y images\missing-icon.png ..\greatwalks\img\missing-icon.png
copy /Y images\homepage-sign.png ..\greatwalks\img\homepage-sign.png
copy /Y images\homepage-buttons.png ..\greatwalks\img\homepage-buttons.png
copy /Y images\content-buttons.png ..\greatwalks\img\content-buttons.png

copy /Y images\walk-icons.png ..\greatwalks\img\walk-icons.png
