# News_Scraper
By: T.J. Hooker

June 30, 2018

![alt text](https://github.com/tyrelhooker/News_Scraper/blob/master/public/images/screenshot.png "App Image")

This is a web app that scrapes news from the NY Times website and allows the user to view saved comments and leave their own comments on the latest news. 

## Technologies include:

* JavaScript
* Express
* Express-Handlebars
* MongoDB
* Mongoose
* Body-parser
* Cheerio
* Request
* node.js
* Morgan
* Bootstrap 4.0

## How it Works:
#### Scraping

The app uses cheerio attached to an onclick event to scrape the NYT website. The scraped results are stored in a mongoDB database in an articles collection. The mongo documents are populated then populated in the browser in cards using bootstrap and handlebars. If the user saves an article, the key associated with the article changes and the page refreshes showing only unsaved articles. The user can view all saved articles by clicking the link in the navbar. 

#### Saved Articles
Once the saved articles link is clicked, the page is once again populated using handlebars and bootstrap cards, but now shows only the saved articles. The user has two choices: 1) add notes or 2) removed the article from the saved status.

#### Saving/Deleting Notes
If the user clicks Notes, the app uses a handlebars partial to display a modal associated with the article id. The modal should display all previously saved notes and allow the user to add a new note. The user also has the option to delete an old note. If a note is saved or deleted, the page refreshes.

#### Clearing Articles
The user has the option of deleting all articles displayed on the homepage by clicking the "Clear Articles" button. The on click event associated with the button uses a delete route and mongoose queries to find all unsaved documents that do not have notes associated with them.

