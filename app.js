'use strict';

var CryptoJS = require("crypto-js");
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
var eyes = require("eyes");
var moment = require("moment")

var utils = require("./src/utils");

var walletFile = argv.walletFile;
var passwordFile = argv.passwordFile;
var knownString = argv.knownString;
var passwordPosition = argv.passwordPosition;
var showTrials;

if(argv.showTrials=="true") true
else showTrials=false

var passwordFound = false;

var currentCount = 0; //Current stats of password trial
var currentPassword;

var globalWallet;

console.log("\n Usage is : node app.js --walletFile=ethwallet.json [--passwordFile=passwordlist.txt] --knownString=<kString> --passwordPostion=<number> --showTrials=true/false");

fs.readFile(walletFile, 'utf-8', function name(error, wallet) {
    globalWallet = wallet;
    //console.log(JSON.parse(wallet));
    if (passwordFile) {
        fs.readFile(passwordFile, 'utf-8', function name(error, passwords) {
            passwords = passwords.split("\n");

            console.time("decryptWallet");

            for (var i = 0; i < passwords.length; i++) {
                console.log("Trying password : " + passwords[i]);
                if (utils.decryptPresaleKey(JSON.parse(wallet), passwords[i])) {
                    console.log("Password found. It is: " + passwords[i]);
                    passwordFound = true;
                    break;
                }
            }

            if (!passwordFound)
                console.log("Dictionary attack failed");

            console.timeEnd("decryptWallet");
            console.log("attacked the wallet with dictionary of : " + passwords.length + " passwords");
        });
    } else {
        console.time("bruteForce")
        
        if(!bruteForce1(knownString, passwordPosition, showTrials)) //Try brute force with 1 wildcard character
            if(!bruteForce2(knownString, passwordPosition, showTrials)) //Try brute force with 2 wildcard characters if using 1 wildcard fails
                if(!bruteForce3(knownString, passwordPosition, showTrials)) //Try brute force with 3 wildcard characters if using 2 wildcard fails
                    bruteForce4(knownString, passwordPosition, showTrials)  //Try brute force with 4 wildcard characters if using 3 wildcard fails
        
        console.timeEnd("bruteForce")
        
    }


})

function bruteForce1(kString, position, showTrials) {
    console.time("bruteForce1")

    knownString = kString;
    passwordPosition = position;

    console.log("Trying 1 wildcard (94) passwords") // http://www.asciitable.com/

    var password = "";
    var part1OfPassword = "";
    var part2OfPassword = "";

    //Doing it for all printable characters

    //1 possible wildcards will be tested

    for (var d = 32; d < 126; d++) {
        password = String.fromCharCode(d);
        part1OfPassword = password.substr(0, position - 1);
        part2OfPassword = password.substr(position - 1, password.length);
        currentPassword = part1OfPassword + kString + part2OfPassword;

        if(showTrials) console.log("Trying password : " + currentPassword);

        currentCount = (d - 31);

        if (utils.decryptPresaleKey(JSON.parse(globalWallet), currentPassword)) {
            console.log("Password found. It is: " + currentPassword);
            console.timeEnd("bruteForce1")
            return true;
        }
    }
    console.timeEnd("bruteForce1")
    
    return false;
}

function bruteForce2(kString, position, showTrials) {
    console.time("bruteForce2")

    knownString = kString;
    passwordPosition = position;

    console.log("Trying 2 wildcards (94*94 = 8836) passwords")

    var password = "";
    var part1OfPassword = "";
    var part2OfPassword = "";

    //Doing it for all printable characters

    //2 possible wildcards will be tested

    for (var c = 32; c <= 126; c++) {
        for (var d = 32; d < 126; d++) {
            password = String.fromCharCode(c) + String.fromCharCode(d);
            part1OfPassword = password.substr(0, position - 1);
            part2OfPassword = password.substr(position - 1, password.length);
            currentPassword = part1OfPassword + kString + part2OfPassword;

            if(showTrials) console.log("Trying password : " + currentPassword);

            currentCount = (c - 31) * (d - 31);

            if (utils.decryptPresaleKey(JSON.parse(globalWallet), currentPassword)) {
                console.log("Password found. It is: " + currentPassword);
                console.timeEnd("bruteForce2")
                return true;
            }
        }
    }
    console.timeEnd("bruteForce2")

    return false;
}

function bruteForce3(kString, position, showTrials) {
    
    console.time("bruteForce3")

    knownString = kString;
    passwordPosition = position;

    console.log("Trying 3 wildcards (94*94*94 = 830,584) passwords")

    var password = "";
    var part1OfPassword = "";
    var part2OfPassword = "";

    //Doing it for all printable characters

    //3 possible wildcards will be tested
    for (var b = 32; b <= 126; b++) {
        for (var c = 32; c <= 126; c++) {
            for (var d = 32; d < 126; d++) {
                password = String.fromCharCode(b) + String.fromCharCode(c) + String.fromCharCode(d);
                part1OfPassword = password.substr(0, position - 1);
                part2OfPassword = password.substr(position - 1, password.length);
                currentPassword = part1OfPassword + kString + part2OfPassword;

                if(showTrials) console.log("Trying password : " + currentPassword);

                currentCount = (b - 31) * (c - 31) * (d - 31);

                if (utils.decryptPresaleKey(JSON.parse(globalWallet), currentPassword)) {
                    console.log("Password found. It is: " + currentPassword);
                    console.timeEnd("bruteForce3")
                    return true;
                }
            }
        }
    }
    
    console.timeEnd("bruteForce3")

    return false;
}


function bruteForce4(kString, position, showTrials) {
    console.time("bruteForce4")

    knownString = kString;
    passwordPosition = position;

    console.log("Trying 4 wildcards (94*94*94*94 = 78,074,896) passwords")

    var password = "";
    var part1OfPassword = "";
    var part2OfPassword = "";

    //Doing it for all printable characters

    //4 possible wildcards will be tested
    for (var a = 32; a <= 126; a++) {
        for (var b = 32; b <= 126; b++) {
            for (var c = 32; c <= 126; c++) {
                for (var d = 32; d < 126; d++) {
                    password = String.fromCharCode(a) + String.fromCharCode(b) + String.fromCharCode(c) + String.fromCharCode(d);
                    part1OfPassword = password.substr(0, position - 1);
                    part2OfPassword = password.substr(position - 1, password.length);
                    currentPassword = part1OfPassword + kString + part2OfPassword;

                    if(showTrials) console.log("Trying password : " + currentPassword);

                    currentCount = (a - 31) * (b - 31) * (c - 31) * (d - 31);

                    if (utils.decryptPresaleKey(JSON.parse(globalWallet), currentPassword)) {
                        console.log("Password found. It is: " + currentPassword);
                        console.timeEnd("bruteForce4")
                        return true;
                    }
                }
            }
        }
    }
    console.timeEnd("bruteForce4")

    return false;
}