const mongoose = require('mongoose');
require("dotenv").config();


function connectionToDb() {
    try {
        mongoose.connect(process.env.MONGO_DB_CONNECTION);
        console.log('connected to DB')
    } catch (err) {
        console.log('connection to db failed');
    }
}


module.exports = connectionToDb;