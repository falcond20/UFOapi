import http from "http";
import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import { getUpdate } from "./scrapper.js";
import getSightings from "./queriesDB.js";
import dotenv from "dotenv";
import { config } from "dotenv";

import Pool from "pg-pool";

config();

const pool = new Pool({
  user: process.env.DBuser,
  host: process.env.DBhost,
  database: process.env.database,
  password: process.env.DBpassword,
  port: process.env.DBport,
});

console.log(process.env.DBuser);
console.log(process.env.NODE_ENV);
const app = express();

const host = process.env.AppHost;
const port = 8000;

function useRegex(input) {
  let regex = /^\w+$/;

  return regex.test(input);
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// check every 24 hrs for new data
setInterval(getUpdate, 1000 * 60 * 60 * 24);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/getSightings", (request, response) => {
  pool.query("SELECT * FROM sightings", (error, results) => {
    if (error) {
      console.log(error);
      return response.status(404).json(results.rows);
    }
    response.status(200).json(results.rows);
  });
});

app.get("/getSightingLocation", (request, response) => {
  var loc = request.body.location;

  if (useRegex(loc)) {
    console.log(useRegex(loc));

    console.log(encodeURIComponent(request.body.location));
    if (request.body == null || useRegex(request.body.location) == false) {
      response.status(404).json("Error : Provide a valid location");
    } else {
      const lookup = "SELECT * FROM sightings WHERE state = $1";
      const value = [loc];
      pool.query(lookup, value, (error, results) => {
        if (error) {
          console.log("logged this error 404");
          console.log(error);
          return response.status(404).json("Error : Provide a valid location");
        }
        response.status(201).json(results.rows);
      });
    }
  } else {
    console.log("logged this error 401");
    return response.status(401).json("Error : Provide a valid location");
  }
});

function isDateValid(dateStr) {
  return !isNaN(new Date(dateStr));
}

app.get("/getSightingByDate", (request, response) => {
  var date = request.body.date;

  if (isDateValid(date)) {
    const text = "SELECT * FROM sightings WHERE date = $1";
    const values = [date];
    pool.query(text, values, (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(404)
          .json("Error : Provide a valid date MM/DD/YYYY or YYYY/MM/DD");
      }
      response.status(201).json(results.rows);
    });
  } else {
    response
      .status(404)
      .json("Error : Provide a valid Date MM/DD/YYYY or YYYY/MM/DD");
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}. and Host ${host}`);
});
