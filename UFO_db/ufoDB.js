
import http from 'http';
import mongoose from 'mongoose';
import express from 'express';

import mongodb from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017/test';
const client = new mongodb.MongoClient(uri);

client.connect((err) => {
    if (!err) {
        console.log('connection created');
    }
    const newDB = client.db("YourNewDatabase");
   // newDB.createCollection("YourCreatedCollectionName"); // This line i s important. Unless you create collection you can not see your database in mongodb .

})