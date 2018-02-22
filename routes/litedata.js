const sqlite3 = require('sqlite3').verbose();
const dblite = new sqlite3.Database('./content/test.sqlite');
// const dblite = new sqlite3.Database(':memory:');

exports.initDB = function () {dblite.run('CREATE TABLE writers ( id INTEGER PRIMARY KEY, created TEXT, email TEXT UNIQUE, fname TEXT NOT NULL, lname TEXT NOT NULL, pword TEXT NOT NULL); CREATE TABLE stories ( id INTEGER PRIMARY KEY, created TEXT, title TEXT NOT NULL, category TEXT NOT NULL, author INTEGER NOT NULL, content TEXT NOT NULL, FOREIGN KEY (author) REFERENCES writers(id) ); CREATE TABLE reviews ( id INTEGER PRIMARY KEY, created TEXT, rating INT, author INTEGER NOT NULL, story INTEGER NOT NULL, category TEXT, content TEXT NOT NULL, FOREIGN KEY (author) REFERENCES writers(id), FOREIGN KEY (story) REFERENCES stories(id)); PRAGMA foreign_keys = ON;')};


//Add user
exports.addUser = function(fname, lname, email, pword, callback){
    dblite.run('INSERT INTO writers (fname, lname, email, pword, created) VALUES (?1, ?2, ?3, ?4, datetime(\'now\'))', {1: fname, 2: lname, 3: email, 4: pword}, function (err) {
        if(err) {
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if(callback) {
            callback({id: this.lastID, fname: fname, lname: lname, email: email});
        }
    });
};

//Add story
exports.addStory = function (title, category, author, content, callback) {
    dblite.run('INSERT INTO stories (title, category, author, content, created) VALUES (?1, ?2, ?3, ?4, datetime(\'now\'))', {1: title, 2: category, 3: author, 4: content}, function (err) {
        if(err) {
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if(callback) {
            callback({id: this.lastID});
        }
    });
};

//Add review
exports.addReview = function (author, story, category, content, callback) {
    dblite.run('INSERT INTO reviews (author, story, content, category, created) VALUES (?1, ?2, ?3, ?4, datetime(\'now\'))', {1: author, 2: story, 3: content, 4: category}, function (err) {
        if(err) {
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if(callback) {
            callback({id: this.lastID});
        }
    });
};

//Rate the review
exports.rateReview = function (revid, rating, callback) {
    dblite.run('UPDATE reviews SET rating = $rating WHERE reviews.id = $id', {id: revid, rating: rating}, function (err) {
        if(err) {
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if(callback) {
            callback({changes: this.changes});
        }
    });
};

//Get the user's info by id
exports.getUser = function (uid, callback) {
    dblite.get('SELECT fname, lname, email, id  FROM writers WHERE writers.id = ?', [uid], function (err, row) {
        if(err){
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if(callback){
            callback(row);
        }
    });
};

//Get the user's info by email
exports.getUserByEmail = function (email, callback) {
    dblite.get('SELECT fname, lname, email, id, pword FROM writers WHERE email = ?', [email], function (err, row) {
        if(err){
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if(callback){
            callback(row);
        }
    });
};


//Get a story
exports.getStory = function (storyid, callback) {
    dblite.get('SELECT title, content, category, stories.id, writers.fname, writers.lname FROM stories INNER JOIN writers ON author = writers.id WHERE stories.id = ?', [storyid], function (err, row) {
        if(err){
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if(callback){
            callback(row);
        }
    });
};

//Get the metadata for reviews by story
exports.getReviews = function (stoid, callback) {
    dblite.all('SELECT reviews.id, reviews.created, reviews.author, reviews.story, reviews.category FROM reviews WHERE reviews.story = ?', [stoid], function(err, rows) {
        if(err) {
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if (callback) {
            callback(rows);
        }
    });
};


exports.getRawPointsData = function(uid, callback) {
    try {
        dblite.all('SELECT reviews.category AS revCat, COUNT(*) AS revNum FROM reviews WHERE reviews.author = ?1 GROUP BY reviews.category', {1: uid}, function (err, revRows) {
            if(err) {
                throw err;
            } else {
                dblite.all('SELECT stories.category AS stoCat, COUNT(*) as stoNum FROM stories WHERE stories.author = ?1 GROUP BY stories.category', {1: uid}, function (err, storRows) {
                    if(err){
                        throw err;
                    } else {
                        if(revRows.length != 0 && storRows.length != 0){
                            callback({reviews: revRows, stories: storRows});
                        } else if (revRows.length == 0 && storRows.length == 0) {
                            callback({reviews: null, stories: null});
                        } else if (revRows.length == 0 && storRows.length != 0) {
                            callback({reviews: null, stories: storRows});
                        } else if (revRows.length != 0 && storRows.length == 0) {
                            callback({reviews: revRows, stories: null});
                        }
                    }
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
};

//Get the metadata for stories
exports.getStories = function (useid, callback) {
    dblite.all('SELECT title, stories.id, author, category, stories.created, fname, lname FROM stories INNER JOIN writers ON author = writers.id WHERE author = ?', [useid], function(err, rows) {
        if(err) {
            console.log(err);
            if(callback){
                callback(err.message);
            }
        } else if (callback) {
            callback(rows);
        }
    });
};

//Get a review
exports.getReview = function (revid, callback) {
    dblite.get('SELECT reviews.id, reviews.created, reviews.author, story, reviews.category, reviews.content, writers.fname, writers.lname FROM reviews INNER JOIN writers ON author = writers.id WHERE reviews.id = ?', [revid], function (err, row) {
        if (err) {
            console.log(err.message);
            if(callback){
                callback(err.message);
            }
        } else if (callback) {
            callback(row);
        }
    });
};