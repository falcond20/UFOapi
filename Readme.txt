Here is how to run the server and Database
Install Nodejs on your local Machine and create a fork copy of the repo


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
pg_restore -c -U firstuser -W -F t -d ufodb ufodb.tar



