import axios from "axios";
import cheerio from "cheerio";
import e from "express";
import fs from "fs";
import pretty from "pretty";
import { createSighting } from "./queriesDB.js";

export async function getUpdate() {
  let id;
  var results = [];
  try {
    const url = "https://nuforc.org/webreports/ndxp230519.html";

    const { data } = await axios.get(url);
    //console.log(data);

    var jsonResponse = [];
    var $ = cheerio.load(data);

    $("table").each(function (i, table) {
      var tableAsJson = [];
      // Get column headings
      // @fixme Doesn't support vertical column headings.
      // @todo Try to support badly formated tables.
      var columnHeadings = [];
      $(table)
        .find("tr")
        .each(function (i, row) {
          $(row)
            .find("th")
            .each(function (j, cell) {
              columnHeadings[j] = $(cell)
                .text()
                .trim()
                .replace("/", "")
                .replace(/\s+/g, "");
            });
        });

      // Fetch each row
      $(table)
        .find("tr")
        .each(function (i, row) {
          var rowAsJson = {};
          $(row)
            .find("td")
            .each(function (j, cell) {
              if (columnHeadings[j]) {
                rowAsJson[columnHeadings[j]] = $(cell).text().trim();
              } else {
                rowAsJson[j] = $(cell).text().trim();
              }
            });

          // Skip blank rows
          if (JSON.stringify(rowAsJson) != "{}")
            tableAsJson.push(JSON.parse(JSON.stringify(rowAsJson)));
        });

      // Add the table to the response
      if (tableAsJson.length != 0) jsonResponse.push(tableAsJson);
    });
    //results = jsonResponse;
    jsonResponse[0].forEach((element) => {
      //id =  (element.DateTime+element.Posted).replace(/\s+/g, '').replace(/\//g, '');
      id = (element.DateTime + element.Posted + element.Duration).replace(
        /[^a-zA-Z0-9]/g,
        ""
      );

      element = { ...element, id: id };

      //results.push(element);
      createSighting(element);
      //console.log(element.id);
    });
    //console.log(results.length);
    //console.log(results[0].each.length);s
    //console.log(jsonResponse.length);
    //console.log(results);

    //console.log("WAS I logged earlier");

    fs.writeFile("test.txt", JSON.stringify(results), (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
    return JSON.stringify(jsonResponse);
  } catch (err) {
    console.error(err);
  }
  /* 
       res.json({
        "message":"success",
        "data": results
      })*/
}

//getUpdate();

export default {
  getUpdate,
};
