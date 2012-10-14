CALL build-images.bat
CALL build-css.bat
CALL build-html.bat
git add -A
git commit -m "Automated commit"
git push
cd ../greatwalks
git add -A
git commit -m "Automated commit"
git push
cd ../greatwalks-phonegap/assets/www
git pull
cd ../../../greatwalks-builder
