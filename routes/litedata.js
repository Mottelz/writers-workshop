const sqlite3 = require('sqlite3').verbose();
// const dblite = new sqlite3.Database('./content/test.sqlite');
const dblite = new sqlite3.Database(':memory:');

exports.initDB = function () {
    dblite.run('CREATE TABLE writers ( id INTEGER PRIMARY KEY, created TEXT, email TEXT UNIQUE, fname TEXT NOT NULL, lname TEXT NOT NULL ); CREATE TABLE stories ( id INTEGER PRIMARY KEY, created TEXT, title TEXT NOT NULL, category TEXT NOT NULL, author INTEGER NOT NULL, content TEXT NOT NULL, FOREIGN KEY (author) REFERENCES writers(id) ); CREATE TABLE reviews ( id INTEGER PRIMARY KEY, created TEXT, rating INT, author INTEGER NOT NULL, story INTEGER NOT NULL, category TEXT, content TEXT NOT NULL, FOREIGN KEY (author) REFERENCES writers(id), FOREIGN KEY (story) REFERENCES stories(id)); PRAGMA foreign_keys = ON;')
}


//Add user
exports.addUser = function(fname, lname, email, callback){
    dblite.run('INSERT INTO writers (fname, lname, email, created) VALUES (?1, ?2, ?3, datetime(\'now\'))', {1: fname, 2: lname, 3: email}, (err) => {
        if(err) {
            console.log(err.message);
        }
        console.log(`New writer added with id ${this.lastID}`);
    });
};

//Add story
exports.addStory = function (title, category, author, content, callback) {
    dblite.run('INSERT INTO stories (title, category, author, content, created) VALUES (?1, ?2, ?3, ?4, datetime(\'now\'))', {1: title, 2: category, 3: author, 4: content});
};

//Add review
exports.addReview = function (author, story, category, content, callback) {
    dblite.run('INSERT INTO stories (author, story, content, category, created) VALUES (?1, ?2, ?3, ?4, datetime(\'now\'))', {1: author, 2: story, 3: content, 4: category});
};

//Rate the review
exports.rateReview = function (revid, rating, callback) {};

//Get the user's info
exports.getUser = function (useid, callback) {};

//Get the metadata for stories
exports.getStories = function (useid, callback) {};

//Get a story
exports.getStory = function (useid, callback) {};

//Get the metadata for reviews by story
exports.getReviews = function (stoid, callback) {};

//Get a review
exports.getReview = function (revid, callback) {};