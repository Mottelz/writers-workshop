//packages
const express = require('express'); //load app
const router = express.Router(); //load router


//customs
// const database = require('../routes/database.js');
const database = require('../routes/litedata.js');

//Home page
router.get('/', (req, res) => res.render('index'));

//GET a users info
router.get('/user/:uid', (req, res) => {
    //TODO Verify permission
    let userID = req.params.uid;
    if(!isNaN(userID)) {
        database.getUser(userID, (user) => {res.send(user)});
    } else {
        res.send("No ID!");
    }
});

//GET the metadata users' stories
router.get('/stories/:uid', (req, res) => {
    //TODO Verify permission
    let userID = req.params.uid;
    if(!isNaN(userID)) {
        database.getStories(userID, (stories) => {res.send(stories)});
    } else {
        res.send("No ID!");
    }
});

//GET a story by id
router.get('/story/:storyId', (req, res) => {
    //TODO Verify permission
    let storyID = req.params.storyId;
    if(!isNaN(storyID)) {
        database.getStory(storyID, (story) => {res.send(story)});
    } else {
        res.send("No ID!");
    }
});

//GET a review by id
router.get('/review/:revId', (req, res) => {
    //TODO Verify permission
    let reveiwID = req.params.revId;
    if(!isNaN(reveiwID)) {
        database.getReview(reveiwID, (review)=>{res.send(review)});
    } else {
        res.send("No ID!");
    }
});

//GET reviews by story
router.get('/reviews/:storyId', (req, res) => {
    //TODO Verify permission
    let storyID = req.params.storyId;
    if(!isNaN(storyID)) {
        database.getReviews(storyID, (reviews) => {res.send(reviews)});
    } else {
        res.send("No ID!");
    }
});

//POST a review
router.post('/review', (req, res) => {
    //TODO Verify permission
    //let author = req.cookie; //TODO get this to actually access the user token
    let author = req.body.writer;
    let story = req.body.story;
    let category = req.body.category;
    let content = req.body.content;
    database.addReview(author, story, category, content, (result) => {res.send(result)});
});

//POST a story
router.post('/story', (req, res) => {
    //TODO Verify permission
    // let author = req.cookie; //TODO get this to actually access the user token
    let author = req.body.writer;
    let title = req.body.title;
    let category = req.body.category;
    let content = req.body.content;
    database.addStory(title, category, author, content, (result)=>{res.send(result)});
});

//POST a new user
router.post('/user', (req, res) => {
    //TODO Verify permission
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    database.addUser(fname, lname, email, (result) => {res.send(result)});
});


//export router
module.exports = router;