const express = require('express');
const xss = require("xss-clean");
const rateLimiting = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require('hpp');
const connectionToDb = require('./config/db');
const cors = require("cors");



// connetion to DB
connectionToDb();


// init server
const server = express();


server.use(express.json());
server.use(helmet());
server.use(hpp());
server.use(xss());
server.use(rateLimiting({
  windowMs: 10 * 60 * 1000,
  max: 1000
}));
server.use(cors());


server.use(express.json());


// routes
server.use("/auth", require("./routes/auth"));
server.use("/user", require("./routes/user"));
server.use("/portfolio", require("./routes/portfolio"));


const PORT = process.env.PORT || 7575;


server.listen(PORT, () => {
    console.log(`up and running on port ${PORT}`);
});