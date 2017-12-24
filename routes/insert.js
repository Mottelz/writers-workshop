var exports = module.exports = {};
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'WritersTest'
});

//Add user
exports.addUser = function(newUser){
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
        connection.query('INSERT INTO writers SET ?', {name: newUser}, function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
        connection.end();
    });
};

//Add story
exports.addStory = function(auth, ty, tit, cont){
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
        connection.query('INSERT INTO stories SET ?', {author: auth, type: ty, title: tit, content: cont}, function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
        connection.end();
    });
};

//Add review
exports.addReview = function(stor, rever, rat, rev){
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
        connection.query('INSERT INTO reviews SET ?', {story: stor, reviewer: rever, rating: rat, review: rev}, function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
        connection.end();
    });
};