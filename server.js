/**
 * Created by Nicholas on 4/8/14.
 */
//var http = require('http');
//
//http.createServer(function(req,res){
//   res.writeHead(200,{'Content-type':'text/Plain'});
//   res.end('Hello');
//}).listen(1337,'127.0.0.1');
//console.log('Webserver has started');

//var http = require('http');
//var fs = require('fs');
//
//http.createServer(function(req,res){
//    fs.readFile('clientSide/main.html',function(err,data){
//        res.writeHead(200,{'Content-type':'text/html'});
//        res.end(data);
//    });
//
//}).listen(1337,'127.0.0.1');
//console.log('Webserver has started');

//express is included here
var express = require('express');
var http = require('http');
//the passport module is included here
var passport = require('passport');

var mapMyFitnessStrategy = require('./Auth-Config-Files').Strategy;
//the request module is included here
var request = require('request');



var MMF_CLIENT_ID ='8k5ze8f3cawxmh2svuc5ebyfr8d8k29n';
var MMF_CLIENT_SECRET ='tR52PySfqq5ZtxAKpYseVV3jHjmdbrKynMxSfNuR76A';
var MMF_CALLBACK_URL ='localhost:3000/auth/mapmyfitness/callback';

if(sessionSecret){
    var sessionSecret = 'secret';
}else{
    var sessionSecret = 'secret';
}

//express is instantiated and assigned with a variable for this app
var app = express();
app.configure(function(){
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.set('view engine','html');
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, 'clientSide')));
});

passport.serializeUser(function(user,done){
    done(null,user);
});
passport.deserializeUser(function(id,done){
    console.log("Deserialized has been called");
    done(null,{identifier: id});
});
//passport config
passport.use(new mapMyFitnessStrategy({
    clientID:MMF_CLIENT_ID,
    clientSecret:MMF_CLIENT_SECRET,
    callbackURL:MMF_CALLBACK_URL
},function(accessToken,refreshToken,profile,done){
    console.log("Access Token:"+accessToken);
    console.log("Refresh Token:"+refreshToken);
    console.log("User:"+JSON.stringify(profile._json));
    profile.accessToken = accessToken;
    return done(null, profile);
}
));

app.get('auth/mapmyfitness', passport.authenticate('mapMyFitness'));

app.get('/auth/mapmyfitness/callback',
    passport.authenticate('mapMyFitness',{
        successRedirect: '/mainView',
        failureRedirect: '/login'
    })
);
//logout handler
app.get('/auth/logout',function(req,res){
    req.logOut();
    res.redirect('/');
});

//check to see if a user is already authenticated and then redirect them based on their situation
const authenticated = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.json(403,{
            error: "forbidden",
            reason: "not_authenticated"
        });
    }
};

//check to see if a user is already authenticated and then redirect them based on their situation
app.get('/', function(req,res){
    if(req.isAuthenticated()){
        res.redirect('/mainView');
    }else{
        res.render('landPage')
    }
});

//helper function to help map my fitness api requests
var apiRequestHelper = function(url,user){
    var basicURL = 'https://oauth2-api.mapmyapi.com';
    var options = {
        url: basicURL + url,
        headers: {
            'Api-Key':MMF_CLIENT_ID,
            'Authorization':"Bearer "+user.identifier.accessToken,
            'Content-Type': 'application/json'
        }
    };
    return options;
};
//handle main page rendering
app.get('/mainView',authenticated, function(req,res){
    res.render('main');
});

//process angular app request for map my fitness data
app.post('/giveRouteData',function(req,res){
    var requestUrl="/7.0/route/?limit=20"+"&close_to_location="+req.location.lat()+'%2C'+req.location.lng()+'&maximum_distance='+req.max+'&minimum_distance='+req.min+'field_set=detailed'

    var options = apiRequestHelper(requestUrl,req.user);

    request(options, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            console.log(JSON.parse(body));
        }else{
            alert("api not working")
        }
    });

});

var server = http.createServer(app);
server.listen(3000);
