var express = require('express');
var pg = require('pg');

var conString = 'pg://erik:Leadville100@aacxnw4546m2a8.caoeqvnamynp.us-west-2.rds.amazonaws.com:5432/kanban';

var app = express();

app.get('/', function (req, res) {
    const results = [];
    pg.connect(conString, (err, client, done) => {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM state;');
        // Stream results back one row at a time
        query.on('row', (row) => {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
});


/*
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
*/
module.exports = app;
