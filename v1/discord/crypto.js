const crypto = require("crypto");

function encrypt(text, pswd){
    var cipher = crypto.createCipher('aes-256-cbc', pswd)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text, pswd){
    var decipher = crypto.createDecipher('aes-256-cbc', pswd)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    encrypt,
    decrypt
}