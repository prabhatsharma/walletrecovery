'use strict';

var CryptoJS = require("crypto-js");
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
var eyes = require("eyes");

var utils = require("./src/utils");

var walletFile = argv.walletFile;
var passwordFile = argv.passwordFile;
var knownString = argv.knownString;
var passwordPosition = argv.passwordPosition;

var passwordFound = false;

var currentCount = 0;   //Current stats of password trial
var currentPassword;

var globalWallet;

console.log("\n Usage is : node app.js --walletFile=ethwallet.json [--passwordFile=passwordlist.txt] --knownString=<kString> --passwordPostion=<number>");

fs.readFile(walletFile, 'utf-8', function name(error, wallet) {
    globalWallet=wallet;
    //console.log(JSON.parse(wallet));
    if(passwordFile){
        fs.readFile(passwordFile, 'utf-8', function name(error, passwords) {
            passwords = passwords.split("\n");
            
            console.time("decryptWallet");
            
            for(var i=0;i<passwords.length;i++) {
                if(utils.decryptPresaleKey(JSON.parse(wallet), passwords[i])){
                    console.log("Password found. It is: " + passwords[i]);
                    passwordFound = true;
                    break;
                }
            }
            
            if(!passwordFound)
                console.log("Dictionary attack failed");
            
            console.timeEnd("decryptWallet");
            console.log("attacked the wallet with dictionary of : " + passwords.length + " passwords");
        });
    } else {
        bruteForce(knownString,passwordPosition);
    }
    

}) 



function bruteForce(kString, position) {
    
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
                    
                    if(utils.decryptPresaleKey(JSON.parse(globalWallet), currentPassword)){
                        console.log("Password found. It is: " + passwords[i]);
                        passwordFound = true;
                        break;
                    }
                    //console.log(currentPassword);
                }
            }
        }
    }
    
    return true;
}

