// Dependencies
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Initialize Express app
var express = require("express");
var app = express();

//Set Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Scraping Tools
// var axios = require("axios");
// var cheerio = require("cheerio");
// var request = require("request");
// var db = require("./models");

// Path to conroller Routes
var routes = require("./controllers/controller.js");
app.use(routes);

var PORT = process.env.PORT || 3000;

// Connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraperdb";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
