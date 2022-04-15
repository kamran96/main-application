#!bin/sh

docker-compose up

# now install npm
npm run install
# setup new db and blah blah
DB=mongo node setup-dbs.js 


# loop from 1 to 10
for i in {1..10}
do
    echo "Looping ... number $i"
    MIGRATE=$i node app.js 
done

