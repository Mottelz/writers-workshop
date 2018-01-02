const sqlite3 = require('sqlite3').verbose();
const dblite = new sqlite3.Database('./content/test.sqlite');
// const dblite = new sqlite3.Database(':memory:');

exports.initDB = function () {
    dblite.run('CREATE TABLE writers ( id INTEGER PRIMARY KEY, created TEXT, email TEXT UNIQUE, fname TEXT NOT NULL, lname TEXT NOT NULL ); CREATE TABLE stories ( id INTEGER PRIMARY KEY, created TEXT, title TEXT NOT NULL, category TEXT NOT NULL, author INTEGER NOT NULL, content TEXT NOT NULL, FOREIGN KEY (author) REFERENCES writers(id) ); CREATE TABLE reviews ( id INTEGER PRIMARY KEY, created TEXT, rating INT, author INTEGER NOT NULL, story INTEGER NOT NULL, content TEXT NOT NULL, FOREIGN KEY (author) REFERENCES writers(id), FOREIGN KEY (story) REFERENCES stories(id)); PRAGMA foreign_keys = ON;')
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

exports.addStory = function (title, category, author, content, callback) {
    dblite.run('INSERT INTO stories (title, category, author, content, created) VALUES (?1, ?2, ?3, ?4, datetime(\'now\'))', {1: title, 2: category, 3: author, 4: content});
};

exports.addReview = function (author, story, content, callback) {
    dblite.run('INSERT INTO stories (author, story, content, created) VALUES (?1, ?2, ?3, datetime(\'now\'))', {1: author, 2: story, 3: content});
};

exports.rateReview = function () {};

exports.getPoints = function () {

};

exports.getUser = function () {

};

exports.getStories = function () {

};

exports.getReviews = function () {

};