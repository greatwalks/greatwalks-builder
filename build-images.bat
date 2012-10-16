mkdir "..\greatwalks\img"
mkdir "..\greatwalks\img\walks"
mkdir "..\greatwalks\img\walks\abel-tasman-coast-track"
copy /Y "walks\Abel Tasman Coast Track\map.png" "..\greatwalks\img\walks\abel-tasman-coast-track\map.png"
mkdir "..\greatwalks\img\walks\heaphy-track"
copy /Y "walks\Heaphy Track\map.png" "..\greatwalks\img\walks\heaphy-track\map.png"
mkdir "..\greatwalks\img\walks\kepler-track"
copy /Y "walks\Kepler Track\map.png" "..\greatwalks\img\walks\kepler-track\map.png"
mkdir "..\greatwalks\img\walks\lake-waikaremoana-track"
copy /Y "walks\Lake Waikaremoana Track\map.png" "..\greatwalks\img\walks\lake-waikaremoana-track\map.png"
mkdir "..\greatwalks\img\walks\milford-track"
copy /Y "walks\Milford Track\map.png" "..\greatwalks\img\walks\milford-track\map.png"
mkdir "..\greatwalks\img\walks\rakiura-track---stewart-island"
copy /Y "walks\Rakiura Track - Stewart Island\map.png" "..\greatwalks\img\walks\rakiura-track---stewart-island\map.png"
mkdir "..\greatwalks\img\walks\routeburn-track"
copy /Y "walks\Routeburn Track\map.png" "..\greatwalks\img\walks\routeburn-track\map.png"
mkdir "..\greatwalks\img\walks\tongariro-northern-circuit"
copy /Y "walks\Tongariro Northern Circuit\map.png" "..\greatwalks\img\walks\tongariro-northern-circuit\map.png"
mkdir "..\greatwalks\img\walks\whanganui-journey"
copy /Y "walks\Whanganui Journey\map.png" "..\greatwalks\img\walks\whanganui-journey\map.png"


inkscape images/great-walks-logo.svg -z --export-png=../greatwalks/img/logo-large.png --export-width=600
inkscape images/great-walks-logo.svg -z --export-png=../greatwalks/img/logo-large@2x.png --export-width=1200

resize -i"images/tongariro-home.jpg" -o"../greatwalks/img/tongariro-home.jpg" -s640x430
copy /Y images\tongariro-home.jpg ..\greatwalks\img\tongariro-home@2x.jpg

resize -i"images/Abel-NEW-home.jpg" -o"../greatwalks/img/Abel-NEW-home.jpg" -s640x430
copy /Y images\Abel-NEW-home.jpg ..\greatwalks\img\Abel-NEW-home@2x.jpg

resize -i"images/heaphy-home_0.jpg" -o"../greatwalks/img/heaphy-home_0.jpg" -s640x430
copy /Y images\heaphy-home_0.jpg.jpg ..\greatwalks\img\heaphy-home_0@2x.jpg

resize -i"images/Kepler-NEW-home.jpg" -o"../greatwalks/img/Kepler-NEW-home.jpg" -s640x430
copy /Y images\Kepler-NEW-home.jpg ..\greatwalks\img\Kepler-NEW-home@2x.jpg

resize -i"images/Milford-home.jpg" -o"../greatwalks/img/Milford-home.jpg" -s640x430
copy /Y images\Milford-home.jpg ..\greatwalks\img\Milford-home@2x.jpg

resize -i"images/rakiura-home.jpg" -o"../greatwalks/img/rakiura-home.jpg" -s640x430
copy /Y images\rakiura-home.jpg ..\greatwalks\img\rakiura-home@2x.jpg

resize -i"images/Routeburn-home.jpg" -o"../greatwalks/img/Routeburn-home.jpg" -s640x430
copy /Y images\Routeburn-home.jpg ..\greatwalks\img\Routeburn-home@2x.jpg

resize -i"images/Waikaremoana-NEW-home.jpg" -o"../greatwalks/img/Waikaremoana-NEW-home.jpg" -s640x430
copy /Y images\Waikaremoana-NEW-home.jpg ..\greatwalks\img\Waikaremoana-NEW-home@2x.jpg

resize -i"images/Whanganui-Journey-home.jpg" -o"../greatwalks/img/Whanganui-Journey-home.jpg" -s640x430
copy /Y images\Whanganui-Journey-home.jpg ..\greatwalks\img\Whanganui-Journey-home@2x.jpg

