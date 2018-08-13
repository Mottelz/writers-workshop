//packages
const express = require("express"); //load app
const router = express.Router(); //load router

//customs
const database = require("../routes/litedata.js");
const algos = require("../routes/algos.js");
const moment = require('moment');
pointvals = require('../content/pointvals.js');

//Home & Signup
router.get("/", async (req, res) => {
  if(req.session.User == null) {
    if (req.session.errorMessage  === undefined || req.session.errorMessage  === null) {
      res.render("login", { title: "Login"});
    } else {
      res.render("login", { title: "Login", errorMessage: req.session.errorMessage });
    }
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

router.get("/init1991", (req, res) => {
  database.initDB();
  res.redirect('/');
});


//Signup
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
router
  .post('/login', (req, res) => {
  let email = req.body.email;
  let pword = req.body.password;
  database.getUserByEmail(email, function(row) {
    if (row == undefined) {
      req.session.errorMessage = "Login Failed. Invalid Email.";
      res.redirect('/');
    } else {
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
        } else {
          req.session.errorMessage = "Login Failed. Invalid Password.";
          res.redirect('/');
        }
      });
    }
  });
})
  .get('/login', (req, res) => {
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

//Home page (aka Reviewable)
router.get("/index", algos.sessionChecker, async (req, res) => {
  database.getReviewableStories(req.session.User.id, (rows)=>{
    let stories = [];
    rows.forEach((row) => {
      if (row.revCount < 5) {
        stories.push(row);
      }
    });

    if (req.session.errorMessage  !== undefined && req.session.errorMessage  !== null) {
      res.render('index', {User: req.session.User, stories: stories, title: 'Reviewable', moment: moment, errorMessage: req.session.errorMessage})
    } else if(req.session.notice  !== undefined && req.session.notice  !== null) {
      res.render('index', {User: req.session.User, stories: stories, title: 'Reviewable', moment: moment, notice: req.session.notice})
    } else {
      res.render('index', {User: req.session.User, stories: stories, title: 'Reviewable', moment: moment})
    }
  });
});


//User's stories
router.get("/my-stories", algos.sessionChecker, async (req, res) => {
  database.getUsersStories(req.session.User.id, (rows)=>{
    let stories = (rows) ? rows : [{title:'Title', content:'This is the content.',category:'Short Fiction'}];
    res.render('my-stories', {User: req.session.User, stories: stories, title: 'My Stories', moment: moment})
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
  if (pointvals.storyMulti[cat] > req.session.User.points) {
    req.session.errorMessage = "You don't have enough points. Please review more stories before trying to post your own.";
    res.redirect('/');
  } else {
    database.addStory(title, cat, req.session.User.id, story, () => {
      req.session.notice = "Your story has been added.";
      res.redirect('/');
    });
  }
});

//Get single story
router.get("/story/:sid", algos.sessionChecker, (req, res) =>{
  database.getStory(req.params.sid, (story) => {
    if (story.author === req.session.User.id) {
      database.getReviews(story.id, (reviews) => {
        res.render('my-single', {title: "Story", story: story, reviews: reviews, moment: moment, User: req.session.User})
      });
    } else {
      res.render('single', {title: "Story", story: story, moment: moment, User: req.session.User})
    }
  })
});

//Post a review
router.post('/review', algos.sessionChecker, async (req, res) => {
  let author = req.session.User.id;
  let story = req.body.story;
  let category = req.body.category;
  let content = req.body.content;
  //ensure that this person hasn't reviewed this story.
  database.getReviews(story, (reviews) => {
    let hasReviewed = false;
    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].author === author)  {
        hasReviewed = true;
      }
    }

    //If they haven't reviewed it...
    if (!hasReviewed) {
      database.addReview(author, story, category, content, (result) => {
        req.session.notice = "Your review has been added.";
        res.redirect('/');
      })
    } else {
      req.session.errorMessage = "You've already reviewed this story!";
      res.redirect('/index');
    }
  })
});

router.get('/error', (req, res) => {
  res.render('error', {title: 'Error', message:'Something went wrong.'});
});

router.get('/clearAll', algos.sessionChecker, (req, res) => {
  if (req.session.User.email == 'mottelzirkind@gmail.com') {
    database.clearStories();
    database.clearRevs();
    req.session.notice = "You've deleted all the reviews and stories.";
    res.redirect('/index');
  } else {
    req.session.errorMessage = "I'm sorry Dave, you can't do that.";
    res.redirect('/index');
  }
});

router.get('/clearRevs', algos.sessionChecker, (req, res) => {
  if (req.session.User.email == 'mottelzirkind@gmail.com') {
    database.clearRevs();
    req.session.notice = "You've deleted all the reviews.";
    res.redirect('/index');
  } else {
    req.session.errorMessage = "I'm sorry Dave, you can't do that.";
    res.redirect('/index');
  }
});

router.get('/clearStories', algos.sessionChecker, (req, res) => {
  if (req.session.User.email == 'mottelzirkind@gmail.com') {
    database.clearStories();
    req.session.notice = "You've deleted all the stories.";
    res.redirect('/index');
  } else {
    req.session.errorMessage = "I'm sorry Dave, you can't do that.";
    res.redirect('/index');
  }
});

//export router
module.exports = router;
