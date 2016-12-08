var express = require('express');
var pgp = require('pg-promise')(/*options*/)

var db = pgp('postgres://erik:#Ledville100@aacxnw4546m2a8.caoeqvnamynp.us-west-2.rds.amazonaws.com:5432/database')

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 80!!')
})

module.exports = app;
