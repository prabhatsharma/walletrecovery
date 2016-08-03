'use strict';

var CryptoJS = require("crypto-js");
var pbkdf2 = require("pbkdf2");
var ethUtil = require("ethereumjs-util");
/**
 * This functions tries a password to an ethereum wallet and return trueness/falseness of password
 * @param  {object} presaleJson - Presale JSON wallet object
 * @param  {string} presalepass - presale password to be tried
 * @returns true=if password is able to decrypt the wallet, false otherwise
 */
exports.decryptPresaleKey = function(presaleJson, presalepass) {

    var hex2str = function(hex) {
        var hex = hex.toString();
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
    /**
     * Convert a hexadecimal encoded string into an array of integers
     * @param  {string} hex hexadecimal encoded string
     * @returns {array} bytes - array of integers
     */
    var hexToBytes = function(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }


    var hexToCryptoJS = function(x) {
        return CryptoJS.enc.Hex.parse(x);
    }
    /**
     * Convert bytes into hex values
     * @param  {any} bytes
     */
    var bytesToHex = function(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("");
    }

    var cryptoJSToHex = function(x) {
        return CryptoJS.enc.Hex.stringify(x);
    }

    var verifyPrivKey = function(privkey, address) {
        if (privkey.length != 64)
            return false;
        if (strPrivateKeyToAddress(privkey) != address)
            return false;
        else
            return true;
    }

    var strPrivateKeyToAddress = function(privkey) {
        var publicKey = ethUtil.privateToPublic(new Buffer(privkey, 'hex'));
        return ethUtil.publicToAddress(publicKey).toString('hex');
    }

    /***************************************************************************
     * Actual program execution begins from here
     ****************************************************************************/
    // var encSeedBytes = hexToBytes(presaleJson.encseed);     //Get the hexadeciml encoded encrypted seed and convert it into an array of 96 bytes
    // var iv = hexToCryptoJS(bytesToHex(encSeedBytes.slice(0, 16)));
    // var cipherText = hexToCryptoJS(bytesToHex(encSeedBytes.slice(16)));
    
    // encseed = 16 bytes initialization vector + 80 bytes ciphertext
    
    //Get the initialization vector from the encrypted seed. First 16 bytes (32 hex encoded chars)
    var iv = hexToCryptoJS(presaleJson.encseed.substr(0,32));   
    
    //Get the ciphertext from encrypted seed. Next X bytes (X * 2 hex encoded chars)
    var cipherText = hexToCryptoJS(presaleJson.encseed.substr(32, presaleJson.encseed.length - 32)); 

    
    //Create the derived key from presalepassword
    var derivedKey = pbkdf2.pbkdf2Sync(presalepass, presalepass, 2000, 16, 'sha256')
    var passbytes = hexToBytes(bytesToHex(derivedKey)).slice(0, 16);
    
    //Get the private key from derived key
    //AES.decrypt(ciphertext, key, cfg)
    var plainText = CryptoJS.AES.decrypt({
        ciphertext: cipherText,
    }, hexToCryptoJS(bytesToHex(passbytes)), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    var plainTextHex = cryptoJSToHex(plainText);
    plainText = hex2str(plainTextHex);
    
    var ethPriv = CryptoJS.SHA3(plainText, {
        outputLength: 256
    });
    var privkey = ethPriv.toString();
    //We got the private key at this point
    
    
    
    //Generate public address(ethaddr) that was generated using private key and compare against 
    //public address to verify the correctness of private key
    if (verifyPrivKey(privkey, presaleJson.ethaddr)) {
        //console.log("Password found : " + presalepass);
        return true;
    } else {
        return false;
    }
}
