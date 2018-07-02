// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Scraping Tools
// var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var db = require("./models");
var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraperdb";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes
// GET route for scraping the NYT website
app.get("/scrape", function(req, res) {
  request("http://www.nytimes.com", function(error, response, html) {
    var $ = cheerio.load(html);
    // var scrapedNews = {};
    $("article.story").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children("h2.story-heading")
        .children("a")
        .text();
      result.summary = $(this)
        .children(".summary")
        .text();
      result.link = $(this)
        .children("h2.story-heading")
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
  });
});
// Route for getting all Articles from the newScraperdb
// Route for getting a specific Article by id & populating with a note
// Route for saving/updating an Article's note

//Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
