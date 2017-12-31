const sqlite3 = require('sqlite3').verbose();
const dblite = new sqlite3.Database('./content/test.sqlite');
// const dblite = new sqlite3.Database(':memory:');



//Add user
exports.addUser = function(){
    dblite.run('INSERT INTO writers (uname, email) VALUES (?1, ?2)', {1: 'Mottelz', 2: 'shachna@gmail.com'});
};

exports.addStory = function () {
    dblite.run('INSERT INTO stories (uname, email) VALUES (?1, ?2)', {1: 'Mottelz', 2: 'shachna@gmail.com'});
};

exports.addReview = function () {

};

exports.getPoints = function () {

};

exports.getUser = function () {

};

exports.getStories = function () {

};

exports.getReviews = function () {

};