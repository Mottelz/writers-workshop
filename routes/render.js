//packages
const express = require("express"); //load app
const router = express.Router(); //load router

//customs
const database = require("../routes/litedata.js");
const algos = require("../routes/algos.js");

const promisifiedGetRawPointsData = require("util").promisify(
  database.getRawPointsData
);
const promisifiedCalculatePoints = require("util").promisify(
  algos.calculatePoints
);

//Home & Signup
router.get("/", (req, res) => res.render("login", { title: "Login" }));
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

router.post('/login', (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let pword = req.body.password;
  database.getUserByEmail(email, async row => {
    const result = await algos.verifyPassword(pword, row.pword);
    if (result) {
      const points = await promisifiedCalculatePoints(
        await promisifiedGetRawPointsData(row.id)
      );
      console.log('boobs');
      req.session.User = {
        email: row.email,
        id: row.id,
        points: 5,
        fname: row.fname,
        lname: row.lname
      };
      console.log(req.session.User);
      res.redirect('/index');
    }
  });
});

router.get('/login', (req, res) => {
  res.redirect('/');
});

//logout
router.get("/logout", (req, res) => {
  if (req.session.User) {
    res.clearCookie("User");
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

//Home page
router.get("/index", /*algos.sessionChecker,*/ async (req, res) => {
  //const stories = await database.getStories();
  const stories = [{title:'Title', content:'This is the content.',category:'Short Fiction'}];
  const User = {
    email: 'm@t.com',
    id: 1,
    points: 5,
    fname: 'Mottel',
    lname: 'Zirkind'
  };
  res.render('index', {User: User, stories, title: 'Reviewable'});
  // res.render('index', {User: req.session.User, stories, title: 'Reviewable'})
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
