
var express = require('express');
var path = require('path');
var db = require('./queries');
var bodyParser = require('body-parser');

var routes = require('./routes/index');



var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use('/public', express.static('public'))
app.use('/', routes);
app.use('/manage', routes);

app.use( function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


module.exports = app;
