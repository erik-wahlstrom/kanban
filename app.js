var express = require('express');
var pg = require('pg');

var conString = 'pg://erik:#Ledville100@aacxnw4546m2a8.caoeqvnamynp.us-west-2.rds.amazonaws.com:5432/kanban';
//var conString = 'pg://postgres:@localhost:5432/kanban';
var app = express();

app.get('/', function (req, res) {
    var client = new pg.Client(conString);
    var conn = client.connect();

    var query = client.query("select name from state");

    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(JSON.stringify(result.rows, null, "    "));
        console.log(JSON.stringify(result.rows, null, "    "));
        client.end();
        res.end();

    });
 });


module.exports = app;
