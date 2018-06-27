//packages
const express = require("express"); //load app
const router = express.Router(); //load router

//customs
const database = require("../routes/litedata.js");
const algos = require("../routes/algos.js");
moment = require('moment');

//Home & Signup
router.get("/", async (req, res) => {
  if(req.session.User == null) {
    res.render("login", { title: "Login" });
  } else {
    //If logged in, update the info
    database.getUserByEmail(req.session.User.email, function(row) {
      database.getRawPointsData(row.id, row.bonus, (row2) => {
        algos.calculatePoints(row2, (points) => {
          req.session.User = {
            email: row.email,
            id: row.id,
            points: points.points,
            fname: row.fname,
            lname: row.lname,
          };
          res.redirect('/index');
        });
      });
    });
  }
});


router
  .get("/signup", (req, res) => res.render("signup", { title: "Sign Up" }))
  .post("/signup", (req, res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let pword = req.body.password;
    algos.encryptPassword(pword, encrypted => {
      database.addUser(fname, lname, email, encrypted, result => {
        res.redirect('/');
      });
    });
  });


//login
router.post('/login', (req, res) => {
  let email = req.body.email;
  let pword = req.body.password;
  database.getUserByEmail(email, function(row) {
    algos.verifyPassword(pword, row.pword, (passVerified) => {
      if (passVerified) {
        database.getRawPointsData(row.id, row.bonus, (row2) => {
          algos.calculatePoints(row2, (points) => {
            req.session.User = {
              email: row.email,
              id: row.id,
              points: points.points,
              fname: row.fname,
              lname: row.lname,
            };
            res.redirect('/index');
          });
        });
      }
    });
  });
});

router.get('/test', (req,res)=>{
  const User = (req.session.User) ? req.session.User : { email: 'm@t.com', id: 1, points: 5, fname: 'Test', lname: 'Person' };
  res.render('test', {User: User, title: 'Progress'})
});


router.get('/login', (req, res) => {
  res.redirect('/');
});

//logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

//Home page
router.get("/index", algos.sessionChecker, async (req, res) => {
  database.getStories(req.session.User.id, (rows)=>{
    let stories = (rows) ? rows : [{title:'Title', content:'This is the content.',category:'Short Fiction'}];
    res.render('index', {User: req.session.User, stories: stories, title: 'Reviewable', moment: moment})
  });

});

//Get story submission form
router.get("/submit-story", algos.sessionChecker, async (req, res) => {
  res.render('submit-story', {User: req.session.User, title: 'Submit Story'})
});


//Post new story
router.post("/submit-story", algos.sessionChecker, (req, res) => {
  let cat = req.body.category;
  let story = req.body.story;
  let title = req.body.title;
  database.addStory(title, cat, req.session.User.id, story, () => {
    res.redirect('/');
  });
});

//Get single story
router.get("/story/:sid", algos.sessionChecker, (req, res) =>{
  console.log("ID: " + req.params.sid);
  res.redirect('/');
});





//GET a user's info
router.get("/user/:uid", (req, res) => {
  let userID = req.params.uid;
  if (!isNaN(userID)) {
    database.getUser(userID, user => {
      res.send(user);
    });
  } else {
    res.send("No User ID to check!");
  }
});

//GET the metadata users' stories
router.get("/stories/:uid", algos.sessionChecker, (req, res) => {
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
router.get("/story/:storyId", algos.sessionChecker, (req, res) => {
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
router.get("/review/:revId", algos.sessionChecker, (req, res) => {
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
router.get("/reviews/:storyId", algos.sessionChecker, (req, res) => {
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
router.get("/points", algos.sessionChecker, (req, res) => {
  let userID = req.session.User.id;
  database.getRawPointsData(userID, rows => {
    algos.calculatePoints(rows, points => res.send(points));
  });
});

//POST a review
router.post("/review", algos.sessionChecker, (req, res) => {
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
router.post("/story", algos.sessionChecker, (req, res) => {
  let author = req.session.User.id;
  let title = req.body.title;
  let category = req.body.category.toLowerCase();
  let content = req.body.content;
  database.addStory(title, category, author, content, result => {
    res.send(result);
  });
});

//export router
module.exports = router;
