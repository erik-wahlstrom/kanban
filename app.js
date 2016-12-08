var express = require('express');
var pgp = require('pg-promise')(/*options*/)

var db = pgp('postgres://erik:#Ledville100@aacxnw4546m2a8.caoeqvnamynp.us-west-2.rds.amazonaws.com:5432/database')

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!!')

    // select and return user name from id:
        db.one("select name from state where id=$1", 1)
            .then(function (state) {
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end(state.name);                
                console.log(state.name); // print state;
            })
            .catch(function (error) {
                console.log(error); // print why failed;
            });
})

app.listen(80, function () {
  console.log('Example app listening on port 80!!')
})

module.exports = app;
