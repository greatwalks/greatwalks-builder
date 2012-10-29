mkdir "..\greatwalks\img"
mkdir "..\greatwalks\img\walks"
mkdir "..\greatwalks\img\walks\abel-tasman-coast-track"
mkdir "..\greatwalks\img\walks\heaphy-track"
mkdir "..\greatwalks\img\walks\kepler-track"
mkdir "..\greatwalks\img\walks\lake-waikaremoana-track"
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

resize -i"images/tongariro-home.jpg" -o"../greatwalks/img/tongariro-home.jpg" -s640x430
resize -i"images/Abel-NEW-home.jpg" -o"../greatwalks/img/Abel-NEW-home.jpg" -s640x430
resize -i"images/heaphy-home_0.jpg" -o"../greatwalks/img/heaphy-home_0.jpg" -s640x430
resize -i"images/Kepler-NEW-home.jpg" -o"../greatwalks/img/Kepler-NEW-home.jpg" -s640x430
resize -i"images/Milford-home.jpg" -o"../greatwalks/img/Milford-home.jpg" -s640x430
resize -i"images/rakiura-home.jpg" -o"../greatwalks/img/rakiura-home.jpg" -s640x430
resize -i"images/Routeburn-home.jpg" -o"../greatwalks/img/Routeburn-home.jpg" -s640x430
resize -i"images/Waikaremoana-NEW-home.jpg" -o"../greatwalks/img/Waikaremoana-NEW-home.jpg" -s640x430
resize -i"images/Whanganui-Journey-home.jpg" -o"../greatwalks/img/Whanganui-Journey-home.jpg" -s640x430

copy /Y images\icons.png ..\greatwalks\img\icons@2x.png
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

copy /Y images\table.png ..\greatwalks\img\table.png
copy /Y images\weta_land.png ..\greatwalks\img\weta_land.png
copy /Y images\weta_twitch.png ..\greatwalks\img\weta_twitch.png

copy /Y images\icons\animal_species.png ..\greatwalks\img\icon-animal_species.png
copy /Y images\icons\attention.png ..\greatwalks\img\icon-attention.png
copy /Y images\icons\carpark.png ..\greatwalks\img\icon-carpark.png
copy /Y images\icons\hot_springs.png ..\greatwalks\img\icon-hot_springs.png
copy /Y images\icons\isite.png ..\greatwalks\img\icon-isite.png
copy /Y images\icons\lodging.png ..\greatwalks\img\icon-lodging.png
copy /Y images\icons\plane.png ..\greatwalks\img\icon-plane.png
copy /Y images\icons\plant_species.png ..\greatwalks\img\icon-plant_species.png
copy /Y images\icons\shelter.png ..\greatwalks\img\icon-shelter.png
copy /Y images\icons\tent.png ..\greatwalks\img\icon-tent.png
copy /Y images\icons\toilets.png ..\greatwalks\img\icon-toilets.png
copy /Y images\icons\trailhead.png ..\greatwalks\img\icon-trailhead.png
copy /Y images\icons\viewpoints.png ..\greatwalks\img\icon-viewpoints.png
copy /Y images\icons\volcano.png ..\greatwalks\img\icon-volcano.png
copy /Y images\icons\waterfall.png ..\greatwalks\img\icon-waterfall.png