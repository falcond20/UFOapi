import http from 'http';
import express, { urlencoded } from 'express';
import bodyParser from 'body-parser'
import{getUpdate} from './scrapper.js'
import getSightings from './queriesDB.js'
import dotenv from 'dotenv';
import { port } from './config.js';
import { host } from './config.js';
import Pool from 'pg-pool';


const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
})


const app = express();

//const host = 'localhost';
//const port = 8000;


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

setInterval(getUpdate, 1000 * 60 * 60 * 24);
// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//   console.log(`Server is running on http://${host}:${port}`);
// });

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

//app.use(express.json());


app.get('/getSightings', (request, response) => {
  pool.query('SELECT * FROM sightings', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
    console.log(results.rows);
  })
});



app.get('/getSightingLocation', (request, response)=> {

  function useRegex(input) {
    let regex = /^\w+$/;
    console.log(regex.test(input));
    return regex.test(input);
  }
  var loc = useRegex(request.body.location);
  console.log(encodeURIComponent(request.body.location));
  if (request.body == null || useRegex(request.body.location) == false ) {
    response.status(400).json("Error : Provide a valid location")
  } else {
    
    const text = "SELECT * FROM sightings WHERE state = $1"
    const values= [request.body.location]
  pool.query(text,values,
    (error, results) => {
      if (error) {
        response.status(401).json("Error : Provide a valid location")
        throw error;
      }
      response.status(201).json(results.rows);
    }
  );
  }
});



app.get('/getSightingByDate', (request, response)=> {

  function useRegex(input) {
    let regex = /^\w+$/;
    console.log(regex.test(input));
    return regex.test(input);
  }
  var dat = useRegex(request.body.date);
  console.log(encodeURIComponent(request.body.date));
  if (request.body == null) {
    response.status(400).json("Error : Provide a valid location")
  } else {
    
    const text = "SELECT * FROM sightings WHERE date = $1"
    const values= [request.body.date]
  pool.query(text,values,
    (error, results) => {
      if (error) {
        response.status(401).json("Error : Provide a valid date")
        throw error;
      }
      response.status(201).json(results.rows);
    }
  );
  }
});





app.listen(port, () => {
  console.log(`App running on port ${port}. and Host ${host}`)
})