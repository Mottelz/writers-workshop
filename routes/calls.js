//packages
const express = require('express'); //load app
const router = express.Router(); //load router

//customs
// const database = require('../routes/database.js');
const database = require('../routes/litedata.js');

//gets
router.get('/', (req, res) => res.render('index'));


router.get('/about', (req, res) => {
    database.getUser(10, (result) => {
        res.render('result', {mess: result});
    });
});

router.get('/init', (req, res) => {
    database.initDB();
    res.render('index');
});

//posts
router.post('/addUser', (req, res) => {
    //TODO Verify User
    //TODO Sanitize request
    database.addUser('Mottel', 'Zirkind', 'mottel@mail.com');
    res.render('index');
});

//export router
module.exports = router;