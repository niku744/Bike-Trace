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

//the file system module is included here
var fs = require('fs');

//the passport module is included here
var passport = require('passport');

var MMF_CLIENT_ID =
var MMF_CLIENT_SECRET =
var MMF_CALLBACK_URL =

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



app.listen(3000);