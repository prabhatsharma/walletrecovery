'use strict';

var CryptoJS = require("crypto-js");
var pbkdf2 = require("pbkdf2");
var ethUtil = require("ethereumjs-util");

exports.decryptPresaleKey = function(presaleJson, presalepass) {
        //presaleJson = JSON.parse(presaleJson);
        var encSeedBytes = this.hexToBytes(presaleJson.encseed);
        var iv = this.hexToCryptoJS(this.bytesToHex(encSeedBytes.slice(0, 16)));
        var cipherText = this.hexToCryptoJS(this.bytesToHex(encSeedBytes.slice(16)));
        
        //var derivedKey = this.sha256.pbkdf2(this.stringToBytes(presalepass), this.stringToBytes(presalepass), 2000, 16);
        var derivedKey = pbkdf2.pbkdf2Sync(presalepass, presalepass, 2000, 16, 'sha256')
        //var derivedKey = CryptoJS.PBKDF2(this.stringToBytes(presalepass), this.stringToBytes(presalepass), 2000, 16)
        
        var passbytes = this.hexToBytes(this.bytesToHex(derivedKey)).slice(0, 16);
        var plainText = CryptoJS.AES.decrypt({
            ciphertext: cipherText,
        }, this.hexToCryptoJS(this.bytesToHex(passbytes)), {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        var plainTextHex = this.cryptoJSToHex(plainText);
        plainText = this.hex2str(plainTextHex);
        var ethPriv = CryptoJS.SHA3(plainText, {
            outputLength: 256
        });
        var privkey = ethPriv.toString();
        if(this.verifyPrivKey(privkey, presaleJson.ethaddr)) {
            //console.log("Password found : " + presalepass);
            return true;
        }
        else
            return false;
    }
    
exports.hex2str = function(hex) {
        var hex = hex.toString();
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

exports.hexToBytes = function (hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }

    
    exports.hexToCryptoJS = function (x) {
        return CryptoJS.enc.Hex.parse(x);
    }

    exports.bytesToHex = function(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("");
    }

    exports.stringToBytes = function(str) {
        var bytes = [];
        for (var i = 0; i < str.length; ++i) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }

exports.sha256 = function (a) {
  a = exports.toBuffer(a)
  return CryptoJS.createHash('SHA256').update(a).digest()
}

exports.cryptoJSToHex = function(x) {
	return CryptoJS.enc.Hex.stringify(x);
}

exports.verifyPrivKey = function (privkey, address){
    if(privkey.length!=64)
        return false;
    if(this.strPrivateKeyToAddress(privkey)!=address)
        return false;
    else
        return true;
}

exports.strPrivateKeyToAddress = function(privkey){
    var publicKey = ethUtil.privateToPublic(new Buffer(privkey, 'hex'));
    return ethUtil.publicToAddress(publicKey).toString('hex');
}