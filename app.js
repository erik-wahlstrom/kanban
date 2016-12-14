
var express = require('express');
var path = require('path');
var db = require('./queries');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./routes/index');
var SignedRequest = require('./auth/SignedRequest');


var fbAppSecret = "2d698b20184a3f7f0e760baec66c4aff";
var authCookieMaxAge = 900000;

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
    We use cookies for Auth
*/
app.use(cookieParser());

app.get('/reset', function(req, res, next) {
   res.clearCookie('kauth');
   res.clearCookie('user_id');
   res.render('login.ejs', {states: ''});
   res.end();
   return;
});

/*
    anyone can hit the login page
*/
app.get('/login.ejs', function(req, res, next) { 
   console.log("login.ejs");      
   res.render('login.ejs', {states: ''});
   res.end();
   return;
});
/*
    used by Auth & REST
*/
app.use(bodyParser.json());

/*
  The service that reads the raw auth token
*/
app.post('/auth', function(req, res, next) { 
   var v = new SignedRequest();
   var auth = v.FbVerify(fbAppSecret, req);
   
   if (auth.status == true) {
       res.cookie('kauth', auth.data, { maxAge: authCookieMaxAge, httpOnly: true });
       res.cookie('user_id', auth.user_id, { maxAge: authCookieMaxAge, httpOnly: true });
   } else {
       res.clearCookie('kauth');
       res.clearCookie('user_id');
   }
   res.end();
   return;
});

/*
    This is invoked for most calls.
*/
app.use(function(req, res, next) {
    //If there is no cookie, log them in.
    var sr = req.cookies.kauth;
    if (!sr) {
        res.render('login.ejs', {states: ''});
        res.end();
        return;
    }

    var v = new SignedRequest();
    var auth = v.FbVerify(fbAppSecret, req);
    if (!auth.status) {
        res.clearCookie('kauth');
        res.clearCookie('user_id');
        var err = new Error('Unauthorized');
        err.status = 401;
        return;
    } 
    res.cookie('kauth', auth.data, { maxAge: authCookieMaxAge, httpOnly: true });
    res.cookie('user_id', auth.user_id, { maxAge: authCookieMaxAge, httpOnly: true });
    next();
});



app.use('/public', express.static('public'))
app.use('/', routes);
app.use('/manage', routes);

/*
    When all else failes, try to login
*/
app.use( function(req, res, next) {
    res.render('login.ejs', {req: req, res: res, states: ''});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


module.exports = app;
