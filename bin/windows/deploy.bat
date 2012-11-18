git checkout master
git add -A
git commit -m "Automated commit"
git push
cd ../greatwalks
git checkout master
git add -A
git commit -m "Automated commit"
git push
git checkout gh-pages
git merge origin
git push origin gh-pages
git checkout master
cd ../greatwalks-phonegap/assets/www
git pull
cd ../../../greatwalks-builder
