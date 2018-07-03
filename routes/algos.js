const bcrypt = require("bcrypt");
pointVal = require('../content/pointvals.js');

exports.calculatePoints = function(rows, callback) {
  let points = 0;


  //if reviews calculate
  if (rows.reviews != null) {
    for (let i = 0; i < rows.reviews.length; i++) {
      points += pointVal.reviewMulti[rows.reviews[i].revCat] * rows.reviews[i].revNum;
    }
  }

  //if stories calculate
  if (rows.stories != null) {
    for (let i = 0; i < rows.stories.length; i++) {
      points -= pointVal.storyMulti[rows.stories[i].stoCat] * rows.stories[i].stoNum;
    }
  }

  if (points <= 0) {
    points = 0;
  }

  if (rows.stories == null){
    points += rows.bonus;
  }
  //callback with result
  if (callback) {
    callback({ points: points });
  }
};

exports.encryptPassword = function(password, callback) {
  bcrypt.hash(password, 5, function(err, hash) {
    if (err) {
      console.log(err);
      if (callback) {
        callback(err);
      }
    } else if (callback) {
      callback(hash);
    } else {
      console.log(hash);
    }
  });
};


exports.verifyPassword = function(raw, encrypted, callback) {
  bcrypt.compare(raw, encrypted, function(err, res) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      return callback(res);
    }
  });
};

// middleware function to check for logged-in users
exports.sessionChecker = (req, res, next) => {
  if (!req.session.User) {
    res.redirect("/login");
  } else if (!req.session.User.email || !req.session.User.id) {
    res.redirect("/login");
  } else {
    next();
  }
};
