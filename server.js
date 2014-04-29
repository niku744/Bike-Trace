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
//var connectTimeout = require('connect-timeout');

//var timeout = connectTimeout({time:45000});


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
    req.connection.setTimeout(0);
//    console.log(req);
    var routeData=[];
//    function syncLoop(iterations, process, exit){
//        var index = 0,
//            done = false,
//            shouldExit = false;
//        var loop = {
//            next:function(){
//                if(done){
//                    if(shouldExit && exit){
//                        exit(); // Exit if we're done
//                    }
//                    return; // Stop the loop if we're done
//                }
//                // If we're not finished
//                if(index < iterations){
//                    index++; // Increment our index
//                    process(loop); // Run our process, pass in the loop
//                    // Otherwise we're done
//                } else {
//                    done = true; // Make sure we say we're done
//                    if(exit) exit(); // Call the callback on exit
//                }
//            },
//            iteration:function(){
//                return index - 1; // Return the loop number we're on
//            },
//            break:function(end){
//                done = true; // End the loop
//                shouldExit = end; // Passing end as true means we still call the exit callback
//            }
//        };
//        loop.next();
//        return loop;
//    }

    var requestUrl="/v7.0/route/?close_to_location="+req.body.latitude+'%2C'+req.body.longitude+'&maximum_distance='+req.body.max+'&minimum_distance='+req.body.min+'&field_set=detailed';

    var options = apiRequestHelper(requestUrl,req.user);

    request(options, function(err, resp, body) {
//        console.log(err);
//        console.log(resp);
        if (!err && resp.statusCode == 200) {
            var dataBody=JSON.parse(body);
            console.log(dataBody.total_count);
//            console.log(body);
//            console.log(dataBody._embedded.routes);
//            console.log(dataBody._embedded.routes[0].points);
            dataBody._embedded.routes.forEach(function(route){
                if(route._links.activity_types[0].id=="11"||route._links.activity_types[0].id=="33"||route._links.activity_types[0].id=="38"||route._links.activity_types[0].id=="41"||route._links.activity_types[0].id=="44"||route._links.activity_types[0].id=="60"){
                    routeData.push({
                        date:route.created_datetime,
                        city:route.city,
                        postal:route.postal_code,
                        points:route.points
                    });
                    console.log(1);
                }
            });
//            console.log(routeData.length);

            if(dataBody.total_count>20){
//                var count=1;
////                console.log(dataBody._links);
//                var page=dataBody._links.next[0].href;
////                console.log(page);
                var parsedData;
//                async.whilst(
//                    function(){
//                        return count < Math.ceil(dataBody.total_count/20);
//                    },function(callback){
//
//                        options=apiRequestHelper(page,req.user);
//                        console.log(page);
//                        request(options,function(err,resp,rbody){
////                        console.log(page);
//
//
//                            if(!err&&resp.statusCode==200){
//                                console.log(page);
//                                parsedData=JSON.parse(rbody);
//                                if(parsedData._links.next!=null){
//                                    page=parsedData._links.next[0].href;
//                                    console.log(3);
//                                };
//
//                                parsedData._embedded.routes.forEach(function(troute){
//                                    routeData.push({
//                                        date:troute.created_datetime,
//                                        postal:troute.postal_code,
//                                        points:troute.points
//                                    });
//                                    console.log(2);
//                                });
////                            --numRunning;
////                            if(numRunning===0){
////                                res.send(routeData);
////                            }
//
//                            }else {
//                                console.log("Something is wrong");
//                                console.log(err);
//                                console.log(resp);
//                            }
//                        });
//                        count++;
//                        callback();
//                    },function(err){
//                        console.log(err);
//                        console.log(count);
//                        console.log(routeData.length);
//                    }
//                );
                function final(){
                    console.log(routeData.length);
                    res.send(routeData);
                }
                var urls=[];
                urls.push(dataBody._links.next[0].href);
                function series(item){
                  if(item){
                      options=apiRequestHelper(item,req.user);
                      console.log(item);
                      request(options,function(err,resp,rbody){
//                        console.log(page);


                          if(!err&&resp.statusCode==200){
                              console.log(item);
                              parsedData=JSON.parse(rbody);
                              if(parsedData._links.next!=null){
                                  urls.push(parsedData._links.next[0].href);
                                  console.log(3);
                              };


                              parsedData._embedded.routes.forEach(function(troute){
                                  console.log(troute._links.activity_types[0].id);
                                  if(troute._links.activity_types[0].id=="11"||troute._links.activity_types[0].id=="33"||troute._links.activity_types[0].id=="38"||troute._links.activity_types[0].id=="41"||troute._links.activity_types[0].id=="44"||troute._links.activity_types[0].id=="60"){
                                      routeData.push({
                                          date:troute.created_datetime,
                                          city:troute.city,
                                          postal:troute.postal_code,
                                          points:troute.points
                                      });
                                      console.log(2);
                                  }

                              });
//                            --numRunning;
//                            if(numRunning===0){
//                                res.send(routeData);
//                            }

                          }else {
                              console.log("Something is wrong");
                              console.log(err);
                              console.log(resp);
                          }
                          return series(urls.shift());
                      });
                  }else{
                      return final();
                  }

                }
                series(urls.shift());
//                var numRunning = 0;

//                syncLoop(Math.ceil(dataBody.total_count/20)-1,function(loop){
//                    loop.iteration();
//
//                    request(options,function(err,resp,rbody){
////                        console.log(page);
//
//
//                        if(!err&&resp.statusCode==200){
//                            console.log(page);
//                            parsedData=JSON.parse(rbody);
//                            if(parsedData._links.next!=null){
//                                page=parsedData._links.next[0].href;
//                                console.log(3);
//                            };
//
//                            parsedData._embedded.routes.forEach(function(troute){
//                                routeData.push({
//                                    date:troute.created_datetime,
//                                    postal:troute.postal_code,
//                                    points:troute.points
//                                });
//                                console.log(2);
//                            });
////                            --numRunning;
////                            if(numRunning===0){
////                                res.send(routeData);
////                            }
//
//                        }else{
//                            console.log("Something is wrong");
//                            console.log(err);
//                            console.log(resp);
//                        }
//                    });
//                    loop.next();
//                },function(){
//                    res.send(routeData);
//                });
//                for(var i=1;i<Math.ceil(dataBody.total_count/20);i++){
//                    ++numRunning;
////                    requestUrl=page;
////                    console.log(requestUrl);
//                    options=apiRequestHelper(page,req.user);
//                    request(options,function(err,resp,rbody){
////                        console.log(page);
//
//
//                        if(!err&&resp.statusCode==200){
//                            console.log(page);
//                            parsedData=JSON.parse(rbody);
//                            if(parsedData._links.next!=null){
//                                page=parsedData._links.next[0].href;
//                                console.log(3);
//                            };
//
//                            parsedData._embedded.routes.forEach(function(troute){
//                                routeData.push({
//                                    date:troute.created_datetime,
//                                    postal:troute.postal_code,
//                                    points:troute.points
//                                });
//                                console.log(2);
//                            });
//                            --numRunning;
//                            if(numRunning===0){
//                                res.send(routeData);
//                            }
//
//                        }else{
//                            console.log("Something is wrong");
//                            console.log(err);
//                            console.log(resp);
//                        }
//                    });
//                };
//                console.log(routeData.length);
            }else{
                res.send(routeData);
            }
//
        }else{
            console.log("api not working");
            console.log(resp);
        }
    });



});


var server = http.createServer(app);
server.listen(3000);

