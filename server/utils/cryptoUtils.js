const CryptoJS = require("crypto-js");

const SECRET_KEY = "your-secret-key";

function encrypt(message) {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };
