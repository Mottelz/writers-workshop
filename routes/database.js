//configure connection
const mysql = require('mysql');
const connection = initializeConnection({
    host     : 'localhost',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'WritersTest'
});

function initializeConnection(config) {

    function addDisconnectHandler(connection) {
        connection.on("error", function (error) {
            if (error instanceof Error) {
                if (error.code === "PROTOCOL_CONNECTION_LOST") {
                    console.error(error.stack);
                    console.log("Lost connection. Reconnecting...");
                    initializeConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }
    let connection = mysql.createConnection(config);
    // Add handlers.
    addDisconnectHandler(connection);
    connection.connect();
    return connection;
};

//Add user
exports.addUser = function(newUser){
    connection.query('INSERT INTO writers SET ?', {name: newUser}, function (error, results, fields) {
        if (error) throw error;
    });
};

//Add story
exports.addStory = function(auth, ty, tit, cont){
    connection.query('INSERT INTO stories SET ?', {author: auth, type: ty, title: tit, content: cont}, function (error, results, fields) {
        if (error) throw error;
        console.log(results.insertId);
    });
};

//Add review
exports.addReview = function(stor, rever, rat, rev){
    connection.query('INSERT INTO reviews SET ?', {story: stor, reviewer: rever, rating: rat, review: rev}, function (error, results, fields) {
        if (error) throw error;
        console.log(results.insertId);
    });
};

//Get user
exports.getUser = function(id) {
    let toReturn = '';
    connection.query('SELECT * FROM writers WHERE ? LIMIT 1', {id: id}, function (error, results, fields) {
        if (error) throw error;
        toReturn = results[0].name;
        console.log(toReturn);
    });
    console.log('outer' + toReturn);
    return toReturn;
};