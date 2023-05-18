require("dotenv").config();
const express = require("express"),
  router = require("./router.js"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

try {
  let db = mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Connected successfully");
} catch (err) {
  console.log("error while connecting db", err);
}

var app = express();
app.use(cookieParser());



function errorHandler(error, request, response, next) {
  console.error(error);
  response.status(500).send({ message: "An error occurred" });
}




app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "16mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(errorHandler);
app.use("/", router);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.listen(process.env.PORT, async () => {
  console.log(`Running on port ${process.env.PORT}`);
});



module.exports = app;
