// Dependencies
var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
// var path = require("path");

var router = express.Router();
var db = require("../models");


// ROUTES //

// GET route for scraping the NYT website
router.get("/scrape", function(req, res) {
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
router.get("/", function(req, res) {
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

router.get("/saved", function(req, res,) {
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
router.post("/saveArticle/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
  .then(function(err, data) {
    res.send(data);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route to find article by id and change saved value to untrue
router.post("/unsaveArticle/:id", function(req, res) {
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
router.get("/articles/:id", function(req, res) {
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
router.post("/articles/:id", function(req, res) {
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

// Route for deleting notes saved connected to article id
router.delete("/deleteNote/:id", function(req, res) {
  db.Note.findOneAndRemove({ _id: req.params.id }, function(err) {
    console.log(err);
    res.send(err);
  });
});

// Clear All Unsaved Articles from DB
router.delete("/clearall", function(req, res) {
  db.Article.remove({ saved: false }, function(err){
    console.log(err);
  });
  console.log("Cleared all unsaved articles");
  res.send("Cleared all unsaved articles from db");
});

module.exports = router;
