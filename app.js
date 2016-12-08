var express = require('express');
var pg = require('pg');

var conString = 'pg://erik:#Ledville100@aacxnw4546m2a8.caoeqvnamynp.us-west-2.rds.amazonaws.com:5432/kanban';
//var conString = 'pg://postgres:@localhost:5432/kanban';
var app = express();

app.get('/', function (req, res) {
    var client = new pg.Client(conString);
    var conn = client.connect();

    var query = client.query("select name from state");

  // Stream results back one row at a time
  query.on('row', (row) => {
    results.push(row);
  });
  // After all data is returned, close connection and return results
  query.on('end', () => {
    client.end();
    return res.json(results);
  });
 });


module.exports = app;
