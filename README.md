Here is how to run the server and Database
Install Nodejs on your local Machine and create a fork copy of the repo
 - add the forked project 
 -  run : npm init
        : npm install

Upon succesful installation
to start the project 

run : node server.js


-- THe application uses .env to store sensitive information to connect to the database
 - create a .env file within the project /UFO
 - add the following variables

DBuser = 'firstuser'
DBhost = localhost
database = ufodb
DBpassword = password
DBport = 5432
AppHost = localhost;
PORT = 8000;



You will need to setup PostgresSQL database in order to run the application
https://www.postgresql.org/download/
To make everything faster and work with the application without doing a lot of configuration I will provide 
Create a user  called 'firstuser'
Create a database name 'ufodb'
create a new table called sightings

Here is a documentation on how to import the database file
https://www.postgresql.org/docs/current/backup-dump.html

TO import the database to your postgresql
run this in terminal 
pg_restore -c -U firstuser -W -F t -d ufodb UFO/UFO_db/ufodb.tar - this last address being the location of the database file
 -  once imported start the ufodb databse and once running query
  SELECT * FROM sightings;
  - if data populates, then db is working as expected
  
In the API collection folder,
There is a collection file you can import to your postman to test the api endpoints
