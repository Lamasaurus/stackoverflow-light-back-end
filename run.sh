echo 'INIT BACKEND'
npm install

rm ./dist -r
npm run build

echo 'INIT FRONTEND'
git submodule update --init --recursive
cd ./frontend
npm install

npm run build 
cp -R ./build ../dist/build

echo 'START DOCKER'
cd ..
docker-compose up -d