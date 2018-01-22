//packages
const express = require('express'); //load app
const router = express.Router(); //load router

//customs
const database = require('../routes/litedata.js');
const algos = require('../routes/algos.js');


//Home page
router.get('/', (req, res) => res.render('index'));

//login
router.post('/login', (req,res) => {
    let email = req.body.email;
    let pword = req.body.pword;
    database.getUserByEmail(email, (row)=>{
        algos.verifyPassword(pword, row.pword,
            (result) =>
            {
                if(result){
                    req.session.User = {email:row.email, id: row.id,};
                    res.send("Welcome");
                }
            })
    });
});

//logout
router.get('/logout', (req, res) => {
    if (req.session.User && req.cookies.email) {
        res.clearCookie('email');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


//GET a users info
router.get('/user/:uid', algos.sessionChecker, (req, res) => {
    //TODO Verify permission
    let userID = req.params.uid;
    if(!isNaN(userID)) {
        database.getUser(userID, (user) => {res.send(user)});
    } else {
        res.send("No ID!");
    }
});

//GET the metadata users' stories
router.get('/stories/:uid', algos.sessionChecker, (req, res) => {
    //TODO Verify permission
    let userID = req.params.uid;
    console.log(req.session);
    if(!isNaN(userID)) {
        database.getStories(userID, (stories) => {res.send(stories)});
    } else {
        res.send("No ID!");
    }
});

//GET a story by id
router.get('/story/:storyId', algos.sessionChecker, (req, res) => {
        let storyID = req.params.storyId;
        if(!isNaN(storyID)) {
            database.getStory(storyID, (story) => {res.send(story)});
        } else {
            res.send("No ID!");
        }
});

//GET a review by id
router.get('/review/:revId', algos.sessionChecker, (req, res) => {
    //TODO Verify permission
    let reveiwID = req.params.revId;
    if(!isNaN(reveiwID)) {
        database.getReview(reveiwID, (review)=>{res.send(review)});
    } else {
        res.send("No ID!");
    }
});

//GET reviews by story
router.get('/reviews/:storyId', algos.sessionChecker, (req, res) => {
    //TODO Verify permission
    let storyID = req.params.storyId;
    if(!isNaN(storyID)) {
        database.getReviews(storyID, (reviews) => {res.send(reviews)});
    } else {
        res.send("No ID!");
    }
});

//GET points by userID
router.get('/points/:uid', algos.sessionChecker, (req, res) => {
    //TODO Verify permission
    let userID = req.params.uid;
    if(!isNaN(userID)) {
        database.getRawPointsData(userID, (rows) => {algos.calculatePoints(rows, (points) => res.send(points))});
    } else {
        res.send("No ID!");
    }
});


//POST a review
router.post('/review', algos.sessionChecker, (req, res) => {
    //TODO Verify permission
    //let author = req.cookie; //TODO get this to actually access the user token
    let author = req.body.writer;
    let story = req.body.story;
    let category = req.body.category.toLowerCase();
    let content = req.body.content;
    database.addReview(author, story, category, content, (result) => {res.send(result)});
});

//POST a story
router.post('/story', algos.sessionChecker, (req, res) => {
    //TODO Verify permission
    // let author = req.cookie; //TODO get this to actually access the user token
    let author = req.body.writer;
    let title = req.body.title;
    let category = req.body.category.toLowerCase();
    let content = req.body.content;
    database.addStory(title, category, author, content, (result)=>{res.send(result)});
});

//POST a new user
router.post('/user', (req, res) => {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let pword = req.body.pword;
    algos.encryptPassword(pword, (encrypted) => {database.addUser(fname, lname, email, encrypted, (result) => {res.send(result)});})

});

//export router
module.exports = router;