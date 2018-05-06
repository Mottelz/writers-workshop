//packages
const express = require("express"); //load app
const router = express.Router(); //load router

//customs
const database = require("../routes/litedata.js");
const algos = require("../routes/algos.js");

//Home page
// router.get('/', (req, res) => res.render('index'));

//login
router.post("/api/login", (req, res) => {
  let email = req.body.email;
  let pword = req.body.pword;
  database.getUserByEmail(email, row => {
    algos.verifyPassword(pword, row.pword, result => {
      if (result) {
        req.session.User = { email: row.email, id: row.id };
        let userID = row.id;
        database.getUser(userID, user => {
          res.send(user);
        });
      }
    });
  });
});

//logout
router.get("/api/logout", (req, res) => {
  if (req.session.User && req.cookies.email) {
    res.clearCookie("email");
    res.clearCookie("id");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

//GET a user's info
router.get(
  "/api/user/:uid",
  /*algos.sessionChecker,*/ (req, res) => {
    //let userID = req.session.User.id;
    let userID = req.params.uid;
    if (!isNaN(userID)) {
      database.getUser(userID, user => {
        res.send(user);
      });
    } else {
      res.send("No ID!");
    }
  }
);

//GET the metadata users' stories
router.get("/api/stories/:uid", algos.sessionChecker, (req, res) => {
  let userID = req.params.uid;
  if (!isNaN(userID)) {
    database.getStories(userID, stories => {
      res.send(stories);
    });
  } else {
    res.send("No ID!");
  }
});

//GET a story by id
router.get("/api/story/:storyId", algos.sessionChecker, (req, res) => {
  let storyID = req.params.storyId;
  if (!isNaN(storyID)) {
    database.getStory(storyID, story => {
      res.send(story);
    });
  } else {
    res.send("No ID!");
  }
});

//GET a review by id
router.get("/api/review/:revId", algos.sessionChecker, (req, res) => {
  let reveiwID = req.params.revId;
  if (!isNaN(reveiwID)) {
    database.getReview(reveiwID, review => {
      res.send(review);
    });
  } else {
    res.send("No ID!");
  }
});

//GET reviews by story
router.get("/api/reviews/:storyId", algos.sessionChecker, (req, res) => {
  let storyID = req.params.storyId;
  if (!isNaN(storyID)) {
    database.getReviews(storyID, reviews => {
      res.send(reviews);
    });
  } else {
    res.send("No ID!");
  }
});

//GET points by userID
router.get("/api/points", algos.sessionChecker, (req, res) => {
  let userID = req.session.User.id;
  database.getRawPointsData(userID, rows => {
    algos.calculatePoints(rows, points => res.send(points));
  });
});

//POST a review
router.post("/api/review", algos.sessionChecker, (req, res) => {
  //TODO You can currently add a review to your own story.
  let author = req.session.User.id;
  let story = req.body.story;
  let category = req.body.category.toLowerCase();
  let content = req.body.content;
  database.addReview(author, story, category, content, result => {
    res.send(result);
  });
});

//POST a story
router.post("/api/story", algos.sessionChecker, (req, res) => {
  let author = req.session.User.id;
  let title = req.body.title;
  let category = req.body.category.toLowerCase();
  let content = req.body.content;
  database.addStory(title, category, author, content, result => {
    res.send(result);
  });
});

//POST a new user
router.post("/api/user", (req, res) => {
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let pword = req.body.pword;
  algos.encryptPassword(pword, encrypted => {
    database.addUser(fname, lname, email, encrypted, result => {
      res.send(result);
    });
  });
});

//export router
module.exports = router;
