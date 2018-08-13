const sqlite3 = require("sqlite3").verbose();
const dblite = new sqlite3.Database("./content/test.sqlite");
// const dblite = new sqlite3.Database("./content/real.db");
// const dblite = new sqlite3.Database(':memory:');

exports.initDB = function() {
  //Create writers table
  dblite.run(
    "CREATE TABLE writers ( id INTEGER PRIMARY KEY, bonus INTEGER, created TEXT, email TEXT UNIQUE, fname TEXT NOT NULL, lname TEXT NOT NULL, pword TEXT NOT NULL);");
  //Create stories table
  dblite.run("CREATE TABLE stories ( id INTEGER PRIMARY KEY, created TEXT, title TEXT NOT NULL, category TEXT NOT NULL, author INTEGER NOT NULL, content TEXT NOT NULL, FOREIGN KEY (author) REFERENCES writers(id) ); ");
  //Create reviews table
  dblite.run("CREATE TABLE reviews ( id INTEGER PRIMARY KEY, created TEXT, rating INT, author INTEGER NOT NULL, story INTEGER NOT NULL, category TEXT, content TEXT NOT NULL, FOREIGN KEY (author) REFERENCES writers(id), FOREIGN KEY (story) REFERENCES stories(id)); ");
  //Activate foreign keys
  dblite.run("PRAGMA foreign_keys = ON;");
};

//Add user
exports.addUser = function(fname, lname, email, pword, callback) {
  dblite.run(
    "INSERT INTO writers (fname, lname, email, pword, created, bonus) VALUES (?1, ?2, ?3, ?4, datetime('now'), ?5)",
    { 1: fname, 2: lname, 3: email, 4: pword, 5: bonus},
    function(err) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback({ id: this.lastID, fname: fname, lname: lname, email: email });
      }
    }
  );
};

//Add story
exports.addStory = function(title, category, author, content, callback) {
  dblite.run(
    "INSERT INTO stories (title, category, author, content, created) VALUES (?1, ?2, ?3, ?4, datetime('now'))",
    { 1: title, 2: category, 3: author, 4: content },
    function(err) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback({ id: this.lastID });
      }
    }
  );
};

//Add review
exports.addReview = function(author, story, category, content, callback) {
  dblite.run(
    "INSERT INTO reviews (author, story, content, category, created) VALUES (?1, ?2, ?3, ?4, datetime('now'))",
    { 1: author, 2: story, 3: content, 4: category },
    function(err) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback({ id: this.lastID });
      }
    }
  );
};

//Rate the review
exports.rateReview = function(revid, rating, callback) {
  dblite.run(
    "UPDATE reviews SET rating = $rating WHERE reviews.id = $id",
    { id: revid, rating: rating },
    function(err) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback({ changes: this.changes });
      }
    }
  );
};

//Get the user's info by id
exports.getUser = function(uid, callback) {
  dblite.get(
    "SELECT fname, lname, email, id, pword, bonus  FROM writers WHERE writers.id = ?",
    [uid],
    function(err, row) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback(row);
      }
    }
  );
};

//Get the user's info by email
exports.getUserByEmail = function(email, callback) {
  dblite.get(
    "SELECT fname, lname, email, id, pword, bonus FROM writers WHERE email = ?",
    [email],
    function(err, row) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback(row);
      }
    }
  );
};

//Get a story
exports.getStory = function(storyid, callback) {
  dblite.get(
    "SELECT title, content, category, stories.id, writers.fname, writers.lname, author FROM stories INNER JOIN writers ON author = writers.id WHERE stories.id = ?",
    [storyid],
    function(err, row) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback(row);
      }
    }
  );
};

//Get reviews by story
exports.getReviews = function(stoid, callback) {
  dblite.all(
    "SELECT reviews.id, reviews.created, reviews.author, reviews.story, reviews.content, reviews.category, writers.fname, writers.lname FROM reviews LEFT OUTER JOIN writers on reviews.author = writers.id WHERE reviews.story = ?",
    [stoid],
    function(err, rows) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback(rows);
      }
    }
  );
};

exports.getRawPointsData = function(uid, bonus, callback) {
  try {
    dblite.get("SELECT bonus FROM writers WHERE id = ?1", { 1: uid }, function(err) {
      if (err) {
        throw err;
      } else {
        dblite.all(
          "SELECT reviews.category AS revCat, COUNT(*) AS revNum FROM reviews WHERE reviews.author = ?1 GROUP BY reviews.category", { 1: uid },
          function(err, revRows) {
            if (err) {
              throw err;
            } else {
              dblite.all(
                "SELECT stories.category AS stoCat, COUNT(*) as stoNum FROM stories WHERE stories.author = ?1 GROUP BY stories.category", { 1: uid },
                function(err, storRows) {
                  if (err) {
                    throw err;
                  } else {
                    if (revRows.length != 0 && storRows.length != 0) {
                      callback({ reviews: revRows, stories: storRows, bonus: bonus });
                    } else if (revRows.length == 0 && storRows.length == 0) {
                      callback({ reviews: null, stories: null, bonus: bonus });
                    } else if (revRows.length == 0 && storRows.length != 0) {
                      callback({ reviews: null, stories: storRows, bonus: bonus });
                    } else if (revRows.length != 0 && storRows.length == 0) {
                      callback({ reviews: revRows, stories: null, bonus: bonus });
                    }
                  }
                }
              );
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//Get the metadata for stories
exports.getAllStories = function(callback) {
    dblite.all(
    "SELECT title, stories.id, author, category, stories.created, fname, lname, substr(stories.content, 1, 450) as blurb FROM stories INNER JOIN writers ON author = writers.id", function(err, row) {
        if (err) {
          console.log(err.message);
          if (callback) {
            callback(err.message);
          }
        } else if (callback) {
          callback(row);
        }
      });
};


//Get the metadata for stories
exports.getReviewableStories = function(useid, callback) {
  dblite.all(
    "SELECT stories.title, COUNT(DISTINCT reviews.id) as revCount, stories.id, stories.author, stories.category, stories.created, w.fname, w.lname, substr(stories.content, 1, 450) as blurb FROM stories INNER JOIN writers w ON stories.author = w.id LEFT OUTER JOIN reviews ON stories.id = reviews.story WHERE stories.author != ? GROUP BY stories.id ORDER BY stories.created DESC;",
    [useid], function(err, row) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback(row);
      }
    });
};


//Get the metadata for stories
exports.getUsersStories = function(useid, callback) {
  dblite.all(
    "SELECT title, stories.id, author, category, stories.created, fname, lname, substr(stories.content, 1, 450) as blurb FROM stories INNER JOIN writers ON author = writers.id WHERE author = ? ORDER BY stories.created DESC",
    [useid], function(err, row) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback(row);
      }
    });
};

//Get a review
exports.getReview = function(revid, callback) {
  dblite.get(
    "SELECT reviews.id, reviews.created, reviews.author, story, reviews.category, reviews.content, writers.fname, writers.lname FROM reviews INNER JOIN writers ON author = writers.id WHERE reviews.id = ?",
    [revid],
    function(err, row) {
      if (err) {
        console.log(err.message);
        if (callback) {
          callback(err.message);
        }
      } else if (callback) {
        callback(row);
      }
    }
  );
};
