// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Scraping Tools
// var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var db = require("./models");
var PORT = 3000;
var app = express();

//Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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
    if (error) {
      console.log("error: ", error);
    } else {
      console.log("statusCode: ", response && response.statusCode);
    }
    const $ = cheerio.load(html);
    // var scrapedNews = {};
    $("article").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .find("h2")
        .find("a")
        .text();
      result.summary = $(this)
        .find(".summary")
        .text()
        .replace(/\n\s*/g, '');
      result.link = $(this)
        .find("h2")
        .find("a")
        .attr("href");
      // result.saved = false;
      if (result.title && result.link && result.summary) {
        db.Article.findOneAndUpdate({title: result.title, saved: false}, result, {upsert: true})
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            return res.json(err);
          });
        }
    });
    res.send("Scrape Complete");
  });
});

// Route for getting all non-saved Articles from the newScraperdb
app.get("/", function(req, res) {
  db.Article.find({ saved: false})
    .then(function(dbArticle) {
      var hbsObject = {
        art: dbArticle
      };
      // console.log("hbsObject++++++++: ", hbsObject);
      // res.json(dbArticle);
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/saved", function(req, res,) {
  db.Article.find({ saved: true })
    .populate("note")
    .then(function(data) {
      console.log(data);
      var hbsObject = {
        savedArt: data
      };
      res.render("saved", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    })
});

// Route to find article id and change saved value to true
app.post("/saveArticle/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
  .then(function(err, data) {
    res.send(data);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route to find article by id and change saved value to untrue
app.post("/unsaveArticle/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id, note: { $exists: false }}, { saved: false })
  .then(function(err, data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log("Error!!!")
    res.json(err);
  });
});

// Route for getting a specific Article by id & populating with a note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for saving/updating an Article's note
app.post("/articles/:id", function(req, res) {
  console.log("req.body in post", req.body);
  console.log("res.body in post", res.body);
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, 
        { $push: { note: dbNote._id } }, 
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Clear All Unsaved Articles from DB
app.post("/clearall", function(req, res) {
  db.Article.remove({ saved: false }, function(err){
    console.log(err);
  });
  console.log("Cleared all unsaved articles");
  res.send("Cleared all unsaved articles from db");
});


//Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
