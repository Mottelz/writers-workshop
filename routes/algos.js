const bcrypt = require("bcrypt");

exports.calculatePoints = function(rows, callback) {
  console.log('Points!');
  let points = 0;
  let storyMulti = {
    tinyfict: 1,
    shorfict: 3,
    longfict: 5,
    shornfic: 2,
    longnfic: 5,
    shorpoem: 2,
    epicpoem: 4
  };
  let reviewMulti = {
    tinyfict: 1,
    shorfict: 2,
    longfict: 3,
    shornfic: 1,
    longnfic: 3,
    shorpoem: 1,
    epicpoem: 3
  };

  //if reviews calculate
  if (rows.reviews != null) {
    for (let i = 0; i < rows.reviews.length; i++) {
      points += reviewMulti[rows.reviews[i].revCat] * rows.reviews[i].revNum;
    }
  }

  //if stories calculate
  if (rows.stories != null) {
    for (let i = 0; i < rows.stories.length; i++) {
      points -= storyMulti[rows.stories[i].stoCat] * rows.stories[i].stoNum;
    }
  }

  if (points < 0) {
    points = 0;
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

exports.verifyPassword = async function(raw, encrypted) {
  console.log('comparing');
  bcrypt.compare(raw, encrypted, function(err, res) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log('passwords match: ',res);
      return res;
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
