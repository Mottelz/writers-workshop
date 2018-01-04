//packages
const express = require('express'); //load app
const router = express.Router(); //load router
const sanitizer = require('sanitize')(); //load sanitizer

//customs
// const database = require('../routes/database.js');
const database = require('../routes/litedata.js');

//Home page
router.get('/', (req, res) => res.render('index'));

//GET a users info
router.get('/user/:uid', (req, res) => {
    //TODO Verify permission
    //TODO Sanitize uid
    let userID = req.params.uid;
    database.getUser(userID, (user) => {res.send(user)});
});

//GET the metadata users' stories
router.get('/stories/:uid', (req, res) => {
    //TODO Verify permission
    //TODO Sanitize uid
    let userID = req.params.uid;
    database.getStories(userID, (stories) => {res.send(stories)});
});

//GET a story by id
router.get('/story/:storyId', (req, res) => {
    //TODO Verify permission
    let storyID = req.params.storyId;
    database.getStory(storyID, (story) => {res.send(story)});
});

//GET a review by id
router.get('/review/:revId', (req, res) => {
    //TODO Verify permission
    let reveiwID = req.params.revId;
    database.getReview(reveiwID, (review)=>{res.send(review)});
});

//GET reviews by story
router.get('/reviews/:storyId', (req, res) => {
    //TODO Verify permission
    let storyID = req.params.storyId;
    database.getReviews(storyID, (reviews) => {res.send(reviews)});
});

//POST a review
router.post('/review', (req, res) => {
    //TODO Verify permission
    //TODO Sanitize data
    let author = req.cookie; //TODO get this to actually access the user token
    let story = req.body.story;
    let category = req.body.category;
    let content = req.body.content;
    database.addReview(author, story, category, content, (result) => {res.send(result)});
});

//POST a story
router.post('/story', (req, res) => {
    //TODO Verify permission
    //TODO Sanitize data
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
    //TODO Sanitize data
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    database.addUser(fname, lname, email, (result) => {res.send(result)});
});


//export router
module.exports = router;