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
//    fs.readFile('public/main.html',function(err,data){
//        res.writeHead(200,{'Content-type':'text/html'});
//        res.end(data);
//    });
//
//}).listen(1337,'127.0.0.1');
//console.log('Webserver has started');

//express is included here
var express = require('express');
var http = require('http');
var path = require('path');

//the passport module is included here
var passport = require('passport');

var mapMyFitnessStrategy = require('./Auth-Config-Files').Strategy;
//the request module is included here
var request = require('request');



var MMF_CLIENT_ID ='8k5ze8f3cawxmh2svuc5ebyfr8d8k29n';
var MMF_CLIENT_SECRET ='tR52PySfqq5ZtxAKpYseVV3jHjmdbrKynMxSfNuR76A';
var MMF_CALLBACK_URL ='http://localhost.mapmyapi.com:3000/callback';

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
    app.engine('html',require('ejs').__express);
    app.use(express.bodyParser());
    app.use(express.session({
        secret: sessionSecret
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/public',express.static(path.join(__dirname, 'public')));
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
app.get('/callback',
    passport.authenticate('mapMyFitness',{
        successRedirect: '/mainView',
        failureRedirect: '/login'
    })
);

app.get('/auth/mapmyfitness', passport.authenticate('mapMyFitness'));


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
        res.render('index.html')
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
//    console.log(req);
    var routeData=[];
    var requestUrl="/v7.0/route/?limit=40&close_to_location="+req.body.latitude+'%2C'+req.body.longitude+'&maximum_distance='+req.body.max+'&minimum_distance='+req.body.min+'&field_set=detailed';

    var options = apiRequestHelper(requestUrl,req.user);

    request(options, function(err, resp, body) {
        console.log(err);
        console.log(resp);
        var dataBody=JSON.parse(body);
        if (!err && resp.statusCode == 200) {
            console.log(body);
            console.log(dataBody._embedded);
            console.log(dataBody._embedded.routes[0].points);
            for(var route in dataBody._embedded.routes){
                routeData.push(route.created_datetime,route.postal_code,route.points);
            }
            if(dataBody.total_count>40){
                var page=body._links.next.href;
                for(var i=1;i<Math.ceil(dataBody.total_count/40);i++){
                    requestUrl=page;
                    options=apiRequestHelper(requestUrl,req.user);
                    request(options,function(err,resp,body){
                        var parsedData=JSON.parse(body);
                        page=parsedData._links.next.href;
                        if(!err&&resp.statusCode==200){
                            for(var route in body._embedded.routes){
                                routeData.push(route.created_datetime,route.postal_code,route.points);
                            }
                        }else{
                            console.log("Something is wrong");
                        }
                    });
                };
            }
            console.log(routeData);
        }else{
            console.log("api not working");
        }
    });

});


var server = http.createServer(app);
server.listen(3000);
