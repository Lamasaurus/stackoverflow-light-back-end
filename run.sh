echo 'init backend'
npm install

rm ./dist -r
npm run build

echo 'init frontend'
git submodule update --init --recursive
cd ./frontend
npm install

npm run build 
cp -R ./build ../dist/build

cd ..
docker-compose up