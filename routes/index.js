var insert = require('../routes/insert.js');
var select = require('../routes/select.js');
var express = require('express'); //load app
var router = express.Router(); //load router

//page renders
router.get('/', (req, res) => res.render('index', {title: 'Template', headline: 'What do you want?!'}));

router.get('/about', (req, res) => res.render('about', {headline: 'About', title: 'Aboot' }));

router.get('/add/:newUser', function(req, res, next) {
    var name = req.params.newUser;
    insert.addUser(name);
    res.render('index', {headline: 'Welcome', title: name });
});

//export router
module.exports = router;