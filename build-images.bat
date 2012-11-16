REM Generate icons in "greatwalks-phonegap" android project
inkscape images/great-walks-icon.svg -z --export-png=../greatwalks-phonegap/res/drawable-hdpi/ic_launcher.png --export-width=72
inkscape images/great-walks-icon.svg -z --export-png=../greatwalks-phonegap/res/drawable-ldpi/ic_launcher.png --export-width=36
inkscape images/great-walks-icon.svg -z --export-png=../greatwalks-phonegap/res/drawable-mdpi/ic_launcher.png --export-width=48
inkscape images/great-walks-icon.svg -z --export-png=../greatwalks-phonegap/res/drawable-xhdpi/ic_launcher.png --export-width=96


REM Generate images in "greatwalks" repo
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

resize -i"images/homepage-carousel/Abel Tasman Coast Track.jpg" -o"../greatwalks/img/homepage-carousel-x2048-abel-tasman-coast-track.jpg" -s2048
resize -i"images/homepage-carousel/Rakiura Track - Stewart Island.jpg" -o"../greatwalks/img/homepage-carousel-x2048-rakiura-track---stewart-island.jpg" -s2048
resize -i"images/homepage-carousel/Heaphy Track.jpg" -o"../greatwalks/img/homepage-carousel-x2048-heaphy-track.jpg" -s2048
resize -i"images/homepage-carousel/Routeburn Track.jpg" -o"../greatwalks/img/homepage-carousel-x2048-routeburn-track.jpg" -s2048
resize -i"images/homepage-carousel/Kepler Track.jpg" -o"../greatwalks/img/homepage-carousel-x2048-kepler-track.jpg" -s2048
resize -i"images/homepage-carousel/Tongariro Northern Circuit.jpg" -o"../greatwalks/img/homepage-carousel-x2048-tongariro-northern-circuit.jpg" -s2048
resize -i"images/homepage-carousel/Lake Waikaremoana.jpg" -o"../greatwalks/img/homepage-carousel-x2048-lake-waikaremoana.jpg" -s2048
resize -i"images/homepage-carousel/Whanganui Journey.jpg" -o"../greatwalks/img/homepage-carousel-x2048-whanganui-journey.jpg" -s2048
resize -i"images/homepage-carousel/Milford Track.jpg" -o"../greatwalks/img/homepage-carousel-x2048-milford-track.jpg" -s2048
resize -i"images/homepage-carousel/_default.jpg" -o"../greatwalks/img/homepage-carousel-x2048-_default.jpg" -s2048

resize -i"images/homepage-carousel/Abel Tasman Coast Track.jpg" -o"../greatwalks/img/homepage-carousel-x1024-abel-tasman-coast-track.jpg" -s1024
resize -i"images/homepage-carousel/Rakiura Track - Stewart Island.jpg" -o"../greatwalks/img/homepage-carousel-x1024-rakiura-track---stewart-island.jpg" -s1024
resize -i"images/homepage-carousel/Heaphy Track.jpg" -o"../greatwalks/img/homepage-carousel-x1024-heaphy-track.jpg" -s1024
resize -i"images/homepage-carousel/Routeburn Track.jpg" -o"../greatwalks/img/homepage-carousel-x1024-routeburn-track.jpg" -s1024
resize -i"images/homepage-carousel/Kepler Track.jpg" -o"../greatwalks/img/homepage-carousel-x1024-kepler-track.jpg" -s1024
resize -i"images/homepage-carousel/Tongariro Northern Circuit.jpg" -o"../greatwalks/img/homepage-carousel-x1024-tongariro-northern-circuit.jpg" -s1024
resize -i"images/homepage-carousel/Lake Waikaremoana.jpg" -o"../greatwalks/img/homepage-carousel-x1024-lake-waikaremoana.jpg" -s1024
resize -i"images/homepage-carousel/Whanganui Journey.jpg" -o"../greatwalks/img/homepage-carousel-x1024-whanganui-journey.jpg" -s1024
resize -i"images/homepage-carousel/Milford Track.jpg" -o"../greatwalks/img/homepage-carousel-x1024-milford-track.jpg" -s1024
resize -i"images/homepage-carousel/_default.jpg" -o"../greatwalks/img/homepage-carousel-x1024-_default.jpg" -s1024

copy /Y images\bootstrap-images\glyphicons-halflings.png ..\greatwalks\img\glyphicons-halflings.png
copy /Y images\bootstrap-images\glyphicons-halflings-white.png ..\greatwalks\img\glyphicons-halflings-white.png
copy /Y images\header-icons.png ..\greatwalks\img\header-icons.png
copy /Y images\slideout-menu.png ..\greatwalks\img\slideout-menu.png
copy /Y images\table.png ..\greatwalks\img\table.png
copy /Y images\weta_land.png ..\greatwalks\img\weta_land.png
copy /Y images\weta_twitch.png ..\greatwalks\img\weta_twitch.png
copy /Y images\map-icons\airport.png ..\greatwalks\img\icon-map-airport.png
copy /Y images\map-icons\alert.png ..\greatwalks\img\icon-map-alert.png
copy /Y images\map-icons\bird-or-animal-species.png ..\greatwalks\img\icon-map-bird-or-animal-species.png
copy /Y images\map-icons\camp_hut.png ..\greatwalks\img\icon-map-camp_hut.png
copy /Y images\map-icons\camping.png ..\greatwalks\img\icon-map-camping.png
copy /Y images\map-icons\carpark.png ..\greatwalks\img\icon-map-carpark.png
copy /Y images\map-icons\hotsprings.png ..\greatwalks\img\icon-map-hotsprings.png
copy /Y images\map-icons\huts.png ..\greatwalks\img\icon-map-huts.png
copy /Y images\map-icons\icons.png ..\greatwalks\img\icon-map-icons.png
copy /Y images\map-icons\information.png ..\greatwalks\img\icon-map-information.png
copy /Y images\map-icons\plantspecies.png ..\greatwalks\img\icon-map-plantspecies.png
copy /Y images\map-icons\shelter.png ..\greatwalks\img\icon-map-shelter.png
copy /Y images\map-icons\toilets.png ..\greatwalks\img\icon-map-toilets.png
copy /Y images\map-icons\trailhead.png ..\greatwalks\img\icon-map-trailhead.png
copy /Y images\map-icons\viewpoints.png ..\greatwalks\img\icon-map-viewpoints.png
copy /Y images\map-icons\generic_nature.png ..\greatwalks\img\icon-map-generic_nature.png
copy /Y images\map-icons\volcano.png ..\greatwalks\img\icon-map-volcano.png
copy /Y images\map-icons\waterfall.png ..\greatwalks\img\icon-map-waterfall.png
copy /Y images\map-icons\swimming.png ..\greatwalks\img\icon-map-swimming.png
copy /Y images\map-icons\side_trail.png ..\greatwalks\img\icon-map-side_trail.png
copy /Y images\content-icons\calendar.png  ..\greatwalks\img\icon-content-calendar.png
copy /Y images\content-icons\culture.png ..\greatwalks\img\icon-content-culture.png
copy /Y images\content-icons\maps_blue.png ..\greatwalks\img\icon-content-maps_blue.png
copy /Y images\content-icons\plants_trees.png ..\greatwalks\img\icon-content-plants_trees.png
copy /Y images\content-icons\volcano.png ..\greatwalks\img\icon-content-volcano.png
copy /Y images\content-icons\camping.png ..\greatwalks\img\icon-content-camping.png
copy /Y images\content-icons\kiwi.png ..\greatwalks\img\icon-content-kiwi.png
copy /Y images\content-icons\maps_gold.png ..\greatwalks\img\icon-content-maps_gold.png
copy /Y images\content-icons\river.png ..\greatwalks\img\icon-content-river.png
copy /Y images\content-icons\canoe.png ..\greatwalks\img\icon-content-canoe.png
copy /Y images\content-icons\lakes.png ..\greatwalks\img\icon-content-lakes.png
copy /Y images\content-icons\mountains.png ..\greatwalks\img\icon-content-mountains.png
copy /Y images\content-icons\specials.png ..\greatwalks\img\icon-content-specials.png
copy /Y images\youarehere.png ..\greatwalks\img\youarehere.png
copy /Y images\camera-placeholder.jpg ..\greatwalks\img\camera-placeholder.jpg
copy /Y images\missing-icon.png ..\greatwalks\img\missing-icon.png
copy /Y images\homepage-sign.png ..\greatwalks\img\homepage-sign.png
copy /Y images\homepage-buttons.png ..\greatwalks\img\homepage-buttons.png
copy /Y images\content-buttons.png ..\greatwalks\img\content-buttons.png
copy /Y images\walk-icons.png ..\greatwalks\img\walk-icons.png
