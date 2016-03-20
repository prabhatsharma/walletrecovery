'use strict';

var CryptoJS = require("crypto-js");
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
var eyes = require("eyes");

var utils = require("./src/utils");

var walletFile = argv.walletFile;
var passwordFile = argv.passwordFile;

var passwordFound = false;

console.log("\n Usage is : node app.js --walletFile=ethwallet.json --passwordFile=passwordlist.txt");

fs.readFile(walletFile, 'utf-8', function name(error, wallet) {
    //console.log(JSON.parse(wallet));
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

}) 


// console.log("SHA1 hash is : " + CryptoJS.SHA1("Message"));

// console.log("SHA256 hash is : " + CryptoJS.SHA256("Message"));


// console.log("MD5 hash is : " + CryptoJS.MD5("Message"));
// // Encrypt 
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
 
// // Decrypt 
// var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
// var plaintext = bytes.toString(CryptoJS.enc.Utf8);
 
// console.log('AES ciphertext is : ' + ciphertext); 
// console.log('plaintext : ' + plaintext);





