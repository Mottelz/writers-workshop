var exports = module.exports = {};
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'WritersTest'
});