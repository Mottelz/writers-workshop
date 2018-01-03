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
    let storyID = reg.params.storyId;
    database.getStory(storyID, (story) => {res.send(story)});
});

//TODO GET a review by id

//TODO GET reviews by story

//TODO POST a review

//TODO POST a story

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