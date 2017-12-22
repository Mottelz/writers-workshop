var express = require('express'); //load app
var router = express.Router(); //load router

//page renders
router.get('/', (req, res) => res.render('index', {title: 'Template', headline: 'What do you want?!'}));

//export router
module.exports = router;