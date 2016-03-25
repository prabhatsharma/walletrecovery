//ASCII 32 to 126 (Total of 94) character http://www.asciitable.com/index/asciifull.gif
var restify = require('restify');

var currentCount = 0;   //Current stats of password trial
var knownString,
passwordPosition, currentPassword;


function genPassword(kString, position) {
    
    knownString = kString;
    passwordPosition = position;
    
    console.log("Trying " + 94*94*94 + " passwords")
    
    var password = "";
    var part1OfPassword = "";
    var part2OfPassword = "";
    
    //Doing it only till 125. ~ is giving trouble. Will deal with it later
    for(var a=32;a<=126;a++){
        for(var b=32;b<=126;b++){
            for(var c=32;c<=126;c++){
                for(var d=0;d<126;d++){
                    password = String.fromCharCode(a) + String.fromCharCode(b) + String.fromCharCode(c) + String.fromCharCode(c);
                    part1OfPassword = password.substr(0,position-1);
                    part2OfPassword = password.substr(position-1, password.length);
                    currentPassword = part1OfPassword + kString + part2OfPassword;
                    
                    currentCount = (a-31)*(b-31)*(c-31)*(d-31);
                    //console.log(currentPassword);
                }
            }
        }
    }
    
    return true;
}

function respond(req, res, next) {
    var hardCodedString = req.params.hardCodedString;
    var hardCodedStringPosition = req.params.hardCodedStringPosition;
    
    genPassword(hardCodedString,hardCodedStringPosition);
    
    res.send(200, {status : "Completed successfully"});

  next();
}

var server = restify.createServer();
server.get('/password/:hardCodedString/:hardCodedStringPosition', respond);

server.get("/status", function(req, res, next) {    
    var response = {
        totalPasswords : 94*94*94,
        currentCount : currentCount,
        knownString : knownString,
        passwordPosition : passwordPosition,
        currentPassword : currentPassword
    }
    res.send(200, response);
    next();
})

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});