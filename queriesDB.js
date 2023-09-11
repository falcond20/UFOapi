import { urlencoded } from "express";
import Pool from "pg-pool";
import { config } from "dotenv";
config();

const pool = new Pool({
  user: process.env.DBuser,
  host: process.env.DBhost,
  database: process.env.database,
  password: process.env.DBpassword,
  port: process.env.DBport,
});

function useRegex(input) {
  let regex = /^\w+$/;
  return regex.test(input);
}

async function getSightingsByID(id) {
  id = encodeURIComponent(id);
  console.log(id);

  let  jex = pool.query(
    "SELECT * FROM sightings WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      return results.rows;
    }
  );
}

async function getSightings() {
  const getSight = (request, response) => {
   pool.query("SELECT * FROM sightings", (error, results) => {
      if (error) {
        throw error;
      }
      return response.status(200).json(results.rows);
    });
  };
}

export async function createSighting(params) {
  let id = params.id;
  let country = params.Country;
  let city = params.City;
  let state = params.State,
    shape = params.Shape,
    details = params.Summary,
    date = params.Posted,
    dateTime = params.DateTime;

  if (await getSightingsByID(id) == id) {
    return "Sighting already exist";
  } else {
    let res = pool.query(
      "INSERT INTO sightings (id, country, city, state, shape, details, date, dateTime) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *",
      [id, country, city, state, shape, details, date, dateTime],
      (error, results) => {
        if (error) {
          return "Sighting already exist";
          throw error;
        }
        return results, `Sighting added with ID: ${id}`;
      }
    );
  }
}
console.log("database started");
let test = await getSightingsByID('1015221945122222Maybe15seconds')
console.log(test);

export default {
  getSightings,
};
