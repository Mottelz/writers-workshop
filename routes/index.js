//packages
const express = require('express'); //load app
const router = express.Router(); //load router

//customs
const database = require('../routes/database.js');

//gets
router.get('/', (req, res) => res.render('index'));


router.get('/about', (req, res) => {
    let result = database.getUser(10);
    res.render('result', {mess: result});
});


//posts
router.post('/addUser', function(req, res, next) {
    //TODO Verify User
    //TODO Sanitize request
    let name = req.body.newName;
    // console.log(name);
    database.addUser(name);
    res.render('result', {mess: name});
});

//export router
module.exports = router;